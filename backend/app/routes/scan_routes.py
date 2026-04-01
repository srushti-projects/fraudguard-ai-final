from fastapi import APIRouter, UploadFile, File, Request
from pydantic import BaseModel
from app.services.ml_scanner import run_scan
from typing import Dict, Any

router = APIRouter(prefix="/scan")

class ScanRequest(BaseModel):
    content: str
    sender: str = None

# TEXT endpoints
@router.post("/sms")
def scan_sms(req: ScanRequest): return run_scan("sms", req.content)

@router.post("/email")
def scan_email(req: ScanRequest): return run_scan("email", req.content)

@router.post("/url")
def scan_url(req: ScanRequest): return run_scan("url", req.content)

@router.post("/prompt")
def scan_prompt(req: ScanRequest): return run_scan("prompt", req.content)

@router.post("/jailbreak")
def scan_jailbreak(req: ScanRequest): return run_scan("jailbreak", req.content)

# MEDIA endpoints that receive multipart/form-data
async def handle_media(type_name: str, file: UploadFile):
    import tempfile, shutil, os
    ext = os.path.splitext(file.filename)[1]
    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as tmp:
        shutil.copyfileobj(file.file, tmp)
        tmp_path = tmp.name
        
    try:
        res = run_scan(type_name, tmp_path)
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
            
    return res

@router.post("/image")
async def scan_img(file: UploadFile = File(...)): return await handle_media("image", file)

@router.post("/audio")
async def scan_aud(file: UploadFile = File(...)): return await handle_media("audio", file)

@router.post("/video")
async def scan_vid(file: UploadFile = File(...)): return await handle_media("video", file)