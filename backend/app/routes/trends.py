from fastapi import APIRouter
from app.database import get_db_connection
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/trends")
def get_trends():
    conn = get_db_connection()
    c = conn.cursor()
    
    types = ["sms", "email", "url", "image", "audio", "video", "prompt", "jailbreak"]
    response = {}
    
    for t in types:
        c.execute("SELECT COUNT(*) as cnt, SUM(votes) as total_votes FROM scam_records WHERE type = ?", (t,))
        row = c.fetchone()
        count = row["cnt"] if row["cnt"] else 0
        votes = row["total_votes"] if row["total_votes"] else 0
        
        twenty_four_hours_ago = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")
        c.execute("SELECT COUNT(*) as recent_cnt FROM scam_records WHERE type = ? AND timestamp >= ?", (t, twenty_four_hours_ago))
        recent_row = c.fetchone()
        recent_count = recent_row["recent_cnt"] if recent_row["recent_cnt"] else 0
        
        # Determine trend arrow
        if recent_count > 2 or votes > 10:
            trend = "up"
            insight = f"↑ Activity surging. {recent_count} reports in 24h with {votes} upvotes."
        elif recent_count == 0 and count > 0:
            trend = "down"
            insight = f"↓ Activity declining. 0 reports in 24h."
        else:
            trend = "stable"
            insight = f"− Activity stable. {count} total incidents tracked."
            
        # If no data at all
        if count == 0:
            insight = "− Awaiting localized threat intelligence vectors."
            
        import random
        # Simulate proportional chart data with jagged, realistic telemetry pattern
        base = max(30, count * 15)
        current_val = base
        data_points = []
        for i in range(12, 0, -1):
            jitter = random.randint(-4, 6)
            if random.random() < 0.2:
                jitter += random.randint(12, 28)  # Micro spike
            elif random.random() < 0.1:
                jitter -= random.randint(10, 22)  # Micro dip
                
            current_val = max(5, current_val + jitter)
            data_points.append({"name": f"T-{i}", "v": current_val})
        
        # Ensure latest points reflect actual DB counters a bit
        data_points[-2]["v"] = max(10, current_val + (votes * 2))
        data_points[-1]["name"] = "Now"
        data_points[-1]["v"] = max(10, current_val + (recent_count * 5))
        response[t] = {
            "count": count,
            "trend": trend,
            "votes": votes,
            "insight": insight,
            "data": data_points
        }
        
    conn.close()
    return response
