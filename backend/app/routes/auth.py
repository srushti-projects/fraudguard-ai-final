import os
import shutil
from pathlib import Path
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File
from sqlalchemy.orm import Session
from datetime import datetime

from app.database import get_db
from app.models.user import User
from app.schemas.user_schema import UserCreate, UserLogin, UserResponse, UserUpdate
from app.services.auth_service import create_user, update_profile, get_user_by_username_or_email

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=UserResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    return create_user(db, user)

@router.post("/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = get_user_by_username_or_email(db, user_credentials.username_or_email)
    
    if not user or user.password_hash != user_credentials.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Credentials")
        
    return {
        "success": True,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "full_name": user.full_name,
            "phone_number": user.phone_number,
            "profile_image_url": user.profile_image_url,
            "bio": user.bio,
            "created_at": user.created_at,
            "updated_at": user.updated_at
        }
    }

@router.post("/logout")
def logout():
    return {"success": True, "message": "Logged out"}

@router.get("/profile/{user_id}", response_model=UserResponse)
def get_user_profile(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/profile/{user_id}", response_model=UserResponse)
def update_user_profile(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db)):
    return update_profile(db, user_id, user_update)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@router.post("/upload-profile-pic/{user_id}")
def upload_profile_pic(user_id: int, file: UploadFile = File(...), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    valid_extensions = {".jpg", ".jpeg", ".png", ".webp"}
    ext = Path(file.filename).suffix.lower()
    if ext not in valid_extensions:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    file_name = f"user_{user_id}_{datetime.utcnow().timestamp()}{ext}"
    file_path = UPLOAD_DIR / file_name
    
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    image_url = f"/uploads/{file_name}"
    user.profile_image_url = image_url
    db.commit()
    return {"profile_image_url": image_url}
