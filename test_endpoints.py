import requests
import json
import os

BASE_URL = "http://localhost:8000"

def test_endpoint(endpoint, tmp_path=None):
    if not os.path.exists(tmp_path):
        with open(tmp_path, "wb") as f:
            f.write(b"dummy")
    try:
        with open(tmp_path, "rb") as f:
            files = {"file": f}
            res = requests.post(f"{BASE_URL}{endpoint}", files=files)
            print(f"[{endpoint}] STATUS: {res.status_code}")
            print(f"[{endpoint}] RESPONSE: {res.json()}")
    except Exception as e:
        print(f"[{endpoint}] FAILED to connect: {e}")

test_endpoint("/scan/image", "ml/image/dataset/img_0.jpg")
test_endpoint("/scan/audio", "ml/audio/dataset/audio_0.wav")
test_endpoint("/scan/video", "ml/video/dataset/video_0.avi")
