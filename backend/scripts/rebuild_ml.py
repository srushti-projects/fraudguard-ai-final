import os

print("🔁 Retraining all models...")

os.system("python ml/sms/train.py")
os.system("python ml/email/train.py")
os.system("python ml/url/train.py")

print("✅ Done")