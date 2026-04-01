from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.database import get_db_connection

router = APIRouter()

class PostRequest(BaseModel):
    title: str
    description: str
    type: str
    content: str
    username: str = None

@router.post("/post")
def create_post(req: PostRequest):
    import random
    author = req.username if req.username else f"Guest-{random.randint(1000, 9999)}"
    
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO scam_records (type, content, prediction, confidence, source, likes_count, comments_count, author)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (req.type.lower(), f"[{req.title}] {req.description} | Payload: {req.content}", 1, 1.0, "community", 0, 0, author))
        
        post_id = cursor.lastrowid
        conn.commit()
        
        cursor.execute("SELECT * FROM scam_records WHERE id = ?", (post_id,))
        new_post = dict(cursor.fetchone())
        conn.close()
        
        return new_post
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

@router.get("/posts")
def get_posts():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            SELECT *, (likes_count * 2) + (comments_count * 3) AS engagement_score 
            FROM scam_records 
            WHERE source = 'community' 
            ORDER BY engagement_score DESC, timestamp DESC
        ''')
        posts = []
        for row in cursor.fetchall():
            post_dict = dict(row)
            post_dict["username"] = post_dict.get("author", "Anonymous User")
            posts.append(post_dict)
        conn.close()
        return posts
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

@router.post("/upvote/{post_id}")
def upvote(post_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("UPDATE scam_records SET likes_count = likes_count + 1 WHERE id = ?", (post_id,))
        
        if cursor.rowcount == 0:
            conn.close()
            raise HTTPException(status_code=404, detail="Post not found")
            
        conn.commit()
        cursor.execute("SELECT likes_count FROM scam_records WHERE id = ?", (post_id,))
        row = cursor.fetchone()
        updated_votes = row["likes_count"] if row else 0
        conn.close()
        
        return {"upvotes": updated_votes}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

class CommentRequest(BaseModel):
    username: str
    comment_text: str

@router.post("/comment/{post_id}")
def add_comment(post_id: int, req: CommentRequest):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO post_comments (post_id, username, comment_text) VALUES (?, ?, ?)",
                       (post_id, req.username, req.comment_text))
        cursor.execute("UPDATE scam_records SET comments_count = comments_count + 1 WHERE id = ?", (post_id,))
        
        if cursor.rowcount == 0:
            conn.close()
            raise HTTPException(status_code=404, detail="Post not found")
            
        conn.commit()
        cursor.execute("SELECT comments_count FROM scam_records WHERE id = ?", (post_id,))
        row = cursor.fetchone()
        updated_comments = row["comments_count"] if row else 0
        conn.close()
        
        return {"comments_count": updated_comments}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")

@router.get("/comments/{post_id}")
def get_comments(post_id: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id, username as author, comment_text as text, created_at FROM post_comments WHERE post_id = ? ORDER BY created_at ASC", (post_id,))
        comments = [dict(row) for row in cursor.fetchall()]
        conn.close()
        return comments
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Database error: {str(e)}")