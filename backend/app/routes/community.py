from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.database import get_db_connection

router = APIRouter()

class PostRequest(BaseModel):
    title: str
    description: str
    type: str
    content: str

@router.post("/post")
def create_post(req: PostRequest):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO scam_records (type, content, prediction, confidence, source, likes_count, comments_count)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (req.type.lower(), f"[{req.title}] {req.description} | Payload: {req.content}", 1, 1.0, "community", 0, 0))
    
    post_id = cursor.lastrowid
    conn.commit()
    
    cursor.execute("SELECT * FROM scam_records WHERE id = ?", (post_id,))
    new_post = dict(cursor.fetchone())
    conn.close()
    
    return new_post

@router.get("/posts")
def get_posts():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('''
        SELECT *, (likes_count * 2) + (comments_count * 3) AS engagement_score 
        FROM scam_records 
        WHERE source = 'community' 
        ORDER BY engagement_score DESC, timestamp DESC
    ''')
    posts = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return posts

@router.post("/upvote/{post_id}")
def upvote(post_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE scam_records SET likes_count = likes_count + 1 WHERE id = ?", (post_id,))
    
    if cursor.rowcount == 0:
        conn.close()
        return {"error": "Post not found"}
        
    conn.commit()
    cursor.execute("SELECT likes_count FROM scam_records WHERE id = ?", (post_id,))
    updated_votes = cursor.fetchone()["likes_count"]
    conn.close()
    
    return {"upvotes": updated_votes}

@router.post("/comment/{post_id}")
def add_comment(post_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE scam_records SET comments_count = comments_count + 1 WHERE id = ?", (post_id,))
    
    if cursor.rowcount == 0:
        conn.close()
        return {"error": "Post not found"}
        
    conn.commit()
    cursor.execute("SELECT comments_count FROM scam_records WHERE id = ?", (post_id,))
    updated_comments = cursor.fetchone()["comments_count"]
    conn.close()
    
    return {"comments_count": updated_comments}