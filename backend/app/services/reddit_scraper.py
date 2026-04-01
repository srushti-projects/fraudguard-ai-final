import time
import requests
import json
import logging
import threading
from apscheduler.schedulers.background import BackgroundScheduler
from app.database import get_db_connection
from app.services.ml_scanner import run_scan

logger = logging.getLogger("reddit_scraper")
logger.setLevel(logging.INFO)
# Quick console output
ch = logging.StreamHandler()
ch.setLevel(logging.INFO)
logger.addHandler(ch)

SUBREDDITS = ["Scams", "phishing", "fraud", "cybersecurity", "personalfinance"]
ENDPOINTS = ["hot.json?limit=100", "new.json?limit=100"]
HEADERS = {"User-Agent": "scam-tracker/1.0"}
MODELS = ["sms", "email", "url", "image", "video", "audio", "prompt", "jailbreak"]

def classify_reddit_post(text_content):
    scores = {}
    for model in MODELS:
        if model in ["image", "video", "audio", "url"]:
            scores[model] = 0.0
            continue
            
        try:
            res = run_scan(model, text_content)
            conf = res.get("confidence", 0.0) if isinstance(res, dict) else 0.0
            scores[model] = conf
        except Exception as e:
            scores[model] = 0.0
            
    max_label = max(scores, key=scores.get)
    max_score = scores[max_label]
    
    if max_score < 0.3:
        final_label = "unclassified"
    else:
        final_label = max_label
        
    return final_label, max_score, scores

def scrape_reddit_job():
    logger.info("Starting Reddit Scraping Job...")
    conn = get_db_connection()
    c = conn.cursor()
    
    for sub in SUBREDDITS:
        for ep in ENDPOINTS:
            url = f"https://www.reddit.com/r/{sub}/{ep}"
            try:
                resp = requests.get(url, headers=HEADERS, timeout=10)
                if resp.status_code == 200:
                    data = resp.json()
                    children = data.get("data", {}).get("children", [])
                    
                    for child in children:
                        post = child["data"]
                        post_id = post.get("id")
                        title = post.get("title", "")
                        body = post.get("selftext", "")
                        post_url = post.get("url", "")
                        subreddit = post.get("subreddit", sub)
                        score = post.get("score", 0)
                        author = post.get("author", "unknown")
                        created_utc = post.get("created_utc", 0)
                        
                        c.execute("SELECT post_id FROM reddit_posts WHERE post_id = ?", (post_id,))
                        if c.fetchone():
                            continue
                            
                        # Insert post
                        c.execute('''
                            INSERT INTO reddit_posts (post_id, title, body, url, subreddit, score, author, created_utc)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                        ''', (post_id, str(title), str(body), str(post_url), str(subreddit), int(score), str(author), int(created_utc)))
                        
                        # Classify
                        text_content = f"{title}\n\n{body}"
                        final_label, max_score, raw_scores = classify_reddit_post(text_content)
                        
                        c.execute('''
                            INSERT INTO reddit_classifications (post_id, label, confidence, raw_scores)
                            VALUES (?, ?, ?, ?)
                        ''', (post_id, final_label, float(max_score), json.dumps(raw_scores)))
                        
                else:
                    logger.warning(f"Reddit API returned {resp.status_code} for {url}")
            except Exception as e:
                logger.error(f"Error scraping {url}: {e}")
                
        conn.commit()
        time.sleep(2) 
        
    conn.close()
    logger.info("Reddit Scraping Job Completed.")

def start_scraper():
    def _run_bg():
        scrape_reddit_job()
        
    scheduler = BackgroundScheduler()
    scheduler.add_job(scrape_reddit_job, 'interval', hours=6, id='reddit_scraper_6h')
    scheduler.start()
    
    # Run once at startup
    t = threading.Thread(target=_run_bg, daemon=True)
    t.start()
