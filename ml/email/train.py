import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib
from pathlib import Path
import re

def clean_text(text):
    text = str(text).lower()
    text = re.sub(r"http\S+", " url ", text)
    text = re.sub(r"\d+", " number ", text)
    text = re.sub(r"[^a-z\s]", " ", text)
    return text

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_PATH = BASE_DIR / "data/email/email_dataset.csv"

df = pd.read_csv(DATA_PATH)

print("📊 Columns:", df.columns)

# ✅ YOUR DATASET FIX
df = df.rename(columns={
    "text": "text",
    "target": "label"
})

df["text"] = df["text"].apply(clean_text)
df["label"] = df["label"].astype(int)

X = df["text"]
y = df["label"]

vectorizer = TfidfVectorizer(stop_words="english", max_features=5000)
X_vec = vectorizer.fit_transform(X)

model = LogisticRegression(max_iter=1000)
model.fit(X_vec, y)

joblib.dump(model, Path(__file__).parent / "email_model.pkl")
joblib.dump(vectorizer, Path(__file__).parent / "email_vectorizer.pkl")

print("Accuracy:", model.score(X_vec, y))
print("✅ Email model trained successfully")