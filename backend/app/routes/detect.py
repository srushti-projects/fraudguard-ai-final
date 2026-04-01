from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ml_scanner import run_scan

router = APIRouter()

# ✅ Request Schema
class ScanRequest(BaseModel):
    type: str
    input: str | dict

@router.post("/detect")
def detect(data: ScanRequest):
    result = run_scan(data.type, data.input)
    return result