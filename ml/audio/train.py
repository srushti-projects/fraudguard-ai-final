import os
import numpy as np
import librosa
import joblib
import soundfile as sf
from pathlib import Path
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score

BASE_DIR = Path(__file__).resolve().parent

def generate_dummy_audio():
    print("Generating synthetic audio dataset...")
    data_dir = BASE_DIR / "dataset"
    data_dir.mkdir(exist_ok=True)
    audios = []
    labels = []
    sr = 22050
    for i in range(100):
        # 0 = safe, 1 = scam
        label = i % 2
        duration = 1.0
        t = np.linspace(0, duration, int(sr * duration), endpoint=False)
        
        # Simulated frequencies
        if label == 0:
            audio = 0.5 * np.sin(2 * np.pi * 440 * t)  # 440 Hz standard tone
        else:
            audio = 0.5 * np.sin(2 * np.pi * 1000 * t) # 1000 Hz high tone (scam proxy)

        filename = str(data_dir / f"audio_{i}.wav")
        sf.write(filename, audio, sr)
        audios.append(filename)
        labels.append(label)
    return audios, labels

def extract_mfcc(path, augment=False):
    # Proper sampling rate aligned
    audio, sr = librosa.load(path, sr=22050)
    
    # Noise handling and augmentation
    if augment and np.random.rand() > 0.5:
        noise = np.random.randn(len(audio)) * 0.005
        audio = audio + noise
        
    mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=20)
    # Average MFCC over time for feature representation
    mfcc_mean = np.mean(mfccs.T, axis=0)
    return mfcc_mean

def train():
    audios, labels = generate_dummy_audio()
    
    X = []
    y = []
    print("Extracting features (MFCC) and augmenting...")
    for path, label in zip(audios, labels):
        # Original
        X.append(extract_mfcc(path, augment=False))
        y.append(label)
        # Augmented
        X.append(extract_mfcc(path, augment=True))
        y.append(label)

    X = np.array(X)
    y = np.array(y)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Optimization: Model tuning
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(random_state=42))
    ])

    param_grid = {
        'classifier__n_estimators': [50, 100],
        'classifier__max_depth': [5, 10, None]
    }

    print("Training and optimizing Audio model...")
    grid = GridSearchCV(pipeline, param_grid, cv=3, n_jobs=-1)
    grid.fit(X_train, y_train)

    best_model = grid.best_estimator_

    print("Validation Accuracy:", accuracy_score(y_test, best_model.predict(X_test)))
    print("Sample Test Outputs:", best_model.predict(X_test[:5]), "Expected:", y_test[:5])

    joblib.dump(best_model.named_steps['classifier'], BASE_DIR / "audio_model.pkl")
    joblib.dump(best_model.named_steps['scaler'], BASE_DIR / "audio_vectorizer.pkl")
    print("✅ Audio model trained and optimized successfully.")

if __name__ == "__main__":
    train()
