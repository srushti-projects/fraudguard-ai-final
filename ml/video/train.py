import os
import cv2
import numpy as np
import joblib
from pathlib import Path
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import Pipeline
from sklearn.metrics import accuracy_score

BASE_DIR = Path(__file__).resolve().parent

def generate_dummy_videos():
    print("Generating synthetic video dataset...")
    data_dir = BASE_DIR / "dataset"
    data_dir.mkdir(exist_ok=True)
    videos = []
    labels = []
    
    fps = 10
    duration = 2
    frames = fps * duration
    
    for i in range(100):
        # 0 = safe, 1 = scam
        label = i % 2
        filename = str(data_dir / f"video_{i}.avi")
        
        out = cv2.VideoWriter(filename, cv2.VideoWriter_fourcc(*'XVID'), fps, (64, 64))
        
        for f in range(frames):
            if label == 0:
                # Safe: constant color
                color = (0, 200, 0)
            else:
                # Scam: flashing/changing color (temporal variation)
                color = (0, 0, 200) if f % 2 == 0 else (50, 50, 50)
                
            img = np.full((64, 64, 3), color, dtype=np.uint8)
            out.write(img)
            
        out.release()
        videos.append(filename)
        labels.append(label)
    return videos, labels

def extract_video_features(path, augment=False):
    cap = cv2.VideoCapture(path)
    extracted_frames = []
    frame_count = 0
    
    # Frame extraction and sampling
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        # Sample every 5th frame
        if frame_count % 5 == 0:
            if augment and np.random.rand() > 0.5:
                # Spatial Augmentation: Flips
                frame = cv2.flip(frame, 1)
            frame_features = np.mean(frame, axis=(0, 1)) # Mean RGB
            extracted_frames.append(frame_features)
        frame_count += 1
    cap.release()
    
    # Handle Temporal sequencing representation
    if not extracted_frames:
        return np.zeros((6,))
        
    extracted_frames = np.array(extracted_frames)
    # Temporal mean and standard deviation across frames
    temp_mean = np.mean(extracted_frames, axis=0)
    temp_std = np.std(extracted_frames, axis=0)
    
    return np.concatenate([temp_mean, temp_std])

def train():
    videos, labels = generate_dummy_videos()
    
    X = []
    y = []
    print("Extracting spatial & temporal features from video frames...")
    for path, label in zip(videos, labels):
        # Original
        X.append(extract_video_features(path, augment=False))
        y.append(label)
        # Augmented
        X.append(extract_video_features(path, augment=True))
        y.append(label)

    X = np.array(X)
    y = np.array(y)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Optimization: Tuning Random Forest
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(random_state=42))
    ])

    param_grid = {
        'classifier__n_estimators': [50, 100],
        'classifier__max_depth': [5, 10]
    }

    print("Training and optimizing Video model...")
    grid = GridSearchCV(pipeline, param_grid, cv=3, n_jobs=-1)
    grid.fit(X_train, y_train)

    best_model = grid.best_estimator_

    print("Validation Accuracy:", accuracy_score(y_test, best_model.predict(X_test)))
    print("Sample Test Outputs:", best_model.predict(X_test[:5]), "Expected:", y_test[:5])

    joblib.dump(best_model.named_steps['classifier'], BASE_DIR / "video_model.pkl")
    joblib.dump(best_model.named_steps['scaler'], BASE_DIR / "video_vectorizer.pkl")
    print("✅ Video model trained and optimized successfully.")

if __name__ == "__main__":
    train()
