import requests

data = {
    "full_name": "Test User",
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
}

try:
    res = requests.post("http://127.0.0.1:8000/auth/register", json=data)
    print("STATUS:", res.status_code)
    print("BODY:", res.text)
except Exception as e:
    print("ERROR:", e)
