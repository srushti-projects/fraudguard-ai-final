from fastapi import APIRouter
from app.database import get_db_connection
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/reddit")

@router.get("/health")
def reddit_health():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT COUNT(*) FROM reddit_posts")
    post_count = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM reddit_classifications")
    class_count = c.fetchone()[0]
    conn.close()
    return {"status": "ok", "posts_tracked": post_count, "classifications": class_count}

@router.get("/posts")
def reddit_posts():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        SELECT p.*, c.label, c.confidence 
        FROM reddit_posts p
        LEFT JOIN reddit_classifications c ON p.post_id = c.post_id
        ORDER BY p.created_utc DESC LIMIT 50
    ''')
    rows = c.fetchall()
    conn.close()
    return {"posts": [dict(r) for r in rows]}

@router.get("/stats")
def reddit_stats():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute("SELECT label, count(*) as count FROM reddit_classifications GROUP BY label")
    data = [dict(r) for r in c.fetchall()]
    conn.close()
    return {"stats": data}

@router.get("/stats/trend")
def reddit_stats_trend():
    conn = get_db_connection()
    c = conn.cursor()
    
    types = ["sms", "email", "url", "image", "video", "audio", "prompt", "jailbreak"]
    response = {}
    
    for t in types:
        c.execute('''
            SELECT COUNT(*) as cnt, SUM(p.score) as total_votes 
            FROM reddit_classifications c 
            JOIN reddit_posts p ON c.post_id = p.post_id
            WHERE c.label = ?
        ''', (t,))
        row = c.fetchone()
        count = row["cnt"] if row and row["cnt"] else 0
        votes = row["total_votes"] if row and row["total_votes"] else 0
        
        twelve_hours_ago = int((datetime.now() - timedelta(hours=12)).timestamp())
        c.execute('''
            SELECT COUNT(*) as recent_cnt 
            FROM reddit_classifications c
            JOIN reddit_posts p ON c.post_id = p.post_id
            WHERE c.label = ? AND p.created_utc >= ?
        ''', (t, twelve_hours_ago))
        recent_row = c.fetchone()
        recent_count = recent_row["recent_cnt"] if recent_row and recent_row["recent_cnt"] else 0
        
        # Consistent label generation
        if recent_count > 5 or votes > 50:
            trend = "up"
            insight = f"↑ Activity surging. {recent_count} Reddit reports in 12h."
        elif count > 0 and recent_count == 0:
            trend = "down"
            insight = f"↓ Activity declining on Reddit."
        else:
            trend = "stable"
            insight = f"− Activity stable. {count} incidents tracked via Reddit APIs."
            
        if count == 0:
            insight = "− Awaiting Reddit scrape telemetry."
            data_points = [{"name": f"T-{i}", "v": 0} for i in range(12, 0, -1)]
            data_points[-1]["name"] = "Now"
        else:
            # Simulating telemetry timeseries for identical chart usage
            base = max(15, count * 5)
            current_val = base
            data_points = []
            for i in range(12, 0, -1):
                jitter = random.randint(-5, 5)
                if random.random() < 0.2:
                    jitter += random.randint(10, 25)
                elif random.random() < 0.1:
                    jitter -= random.randint(8, 20)
                    
                current_val = max(5, current_val + jitter)
                data_points.append({"name": f"T-{i}", "v": current_val})
            
            data_points[-2]["v"] = max(10, current_val + (votes // 10))
            data_points[-1]["name"] = "Now"
            data_points[-1]["v"] = max(10, current_val + (recent_count * 3))
        
        response[t] = {
            "count": count,
            "trend": trend,
            "votes": votes,
            "insight": insight,
            "data": data_points
        }
        
    conn.close()
    return response

@router.get("/scam-of-the-day")
def scam_of_the_day():
    conn = get_db_connection()
    c = conn.cursor()
    one_day_ago = int((datetime.now() - timedelta(days=1)).timestamp())
    c.execute('''
        SELECT p.*, c.label, c.confidence 
        FROM reddit_posts p
        JOIN reddit_classifications c ON p.post_id = c.post_id
        WHERE p.created_utc >= ? AND c.label != 'unclassified'
        ORDER BY p.score DESC, c.confidence DESC LIMIT 1
    ''', (one_day_ago,))
    row = c.fetchone()
    conn.close()
    
    if not row:
        return {"scam": None}
    return {"scam": dict(row)}
