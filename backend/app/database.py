import sqlite3
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).resolve().parent.parent / "fraudguard.db"

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS scam_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            type TEXT NOT NULL,
            content TEXT NOT NULL,
            prediction INTEGER NOT NULL,
            confidence REAL NOT NULL,
            source TEXT NOT NULL,
            votes INTEGER DEFAULT 0,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            likes_count INTEGER DEFAULT 0,
            comments_count INTEGER DEFAULT 0
        )
    ''')

    # Apply schema updates gracefully to existing DB
    try:
        cursor.execute("ALTER TABLE scam_records ADD COLUMN likes_count INTEGER DEFAULT 0")
    except:
        pass
    try:
        cursor.execute("ALTER TABLE scam_records ADD COLUMN comments_count INTEGER DEFAULT 0")
    except:
        pass
    try:
        cursor.execute("UPDATE scam_records SET likes_count = votes WHERE likes_count = 0")
    except:
        pass
    
    # Create an index for engagement_score ordering optimization
    try:
        cursor.execute("CREATE INDEX idx_engagement ON scam_records (likes_count, comments_count, timestamp)")
    except:
        pass

    # REDDIT INTEGRATION TABLES
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reddit_posts (
            post_id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            body TEXT,
            url TEXT,
            subreddit TEXT NOT NULL,
            score INTEGER DEFAULT 0,
            author TEXT,
            created_utc INTEGER NOT NULL,
            scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reddit_classifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id TEXT NOT NULL,
            label TEXT NOT NULL,
            confidence REAL NOT NULL,
            raw_scores TEXT NOT NULL,
            classified_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(post_id) REFERENCES reddit_posts(post_id)
        )
    ''')
    try:
        cursor.execute("CREATE INDEX idx_reddit_created_utc ON reddit_posts (created_utc)")
        cursor.execute("CREATE INDEX idx_reddit_label ON reddit_classifications (label)")
        cursor.execute("CREATE INDEX idx_reddit_subreddit ON reddit_posts (subreddit)")
    except:
        pass

    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

# Automatically seed with data so the dashboard works instantly
def seed_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM scam_records")
    count = cursor.fetchone()[0]
    
    if count == 0:
        # Dummy baseline data
        records = [
            ("sms", "Urgent: UPS package fee pending.", 1, 0.95, "community", 15),
            ("sms", "Bank Alert: Unrecognized login attempt.", 1, 0.88, "scanner", 0),
            ("email", "Update Office365 password now.", 1, 0.99, "scanner", 0),
            ("email", "Invoice attached for overdue payment.", 1, 0.70, "community", 2),
            ("url", "http://paypal-verification-secure-portal.net", 1, 0.92, "community", 5),
            ("url", "http://amazon-prime-renewal-hub.com", 1, 0.90, "scanner", 0),
            ("image", "Executive voice deepfake via MP4.", 1, 0.85, "scanner", 0)
        ]
        
        for rec in records:
            cursor.execute('''
                INSERT INTO scam_records (type, content, prediction, confidence, source, votes)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', rec)
        conn.commit()
    conn.close()

init_db()
seed_db()
