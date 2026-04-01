import pandas as pd
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

BASE_DIR = Path(__file__).resolve().parents[2]
DATA_PATH = BASE_DIR / "data/url/url_dataset.csv"

print(f"📂 Loading dataset from: {DATA_PATH}")

df = pd.read_csv(DATA_PATH)

print("📊 Columns:", df.columns)

# ✅ DROP NON-NUMERIC / USELESS COLUMNS
drop_cols = ["FILENAME", "URL", "Domain", "Title", "TLD"]
df = df.drop(columns=[col for col in drop_cols if col in df.columns])

# ✅ HANDLE MISSING VALUES
df = df.fillna(0)

# ✅ FEATURES & LABEL
X = df.drop(columns=["label"])
y = df["label"]

# ✅ SCALE FEATURES
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# ✅ TRAIN TEST SPLIT (optional but good)
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42
)

# ✅ FAST + STRONG MODEL
model = LogisticRegression(max_iter=1000, n_jobs=-1)

model.fit(X_train, y_train)

# ✅ SAVE EVERYTHING
joblib.dump(model, BASE_DIR / "ml/url/url_model.pkl")
joblib.dump(scaler, BASE_DIR / "ml/url/url_scaler.pkl")

print("✅ URL model trained successfully (OPTIMIZED)")