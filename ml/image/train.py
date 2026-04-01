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

def generate_dummy_images():
    print("Generating synthetic image dataset...")
    data_dir = BASE_DIR / "dataset"
    data_dir.mkdir(exist_ok=True)
    images = []
    labels = []
    for i in range(100):
        # 0 = safe, 1 = scam
        label = i % 2
        bg_color = (200, 200, 200) if label == 0 else (50, 50, 50) # Scam is darker
        img = np.full((128, 128, 3), bg_color, dtype=np.uint8)
        
        # Add random noise
        noise = np.random.randint(0, 40, (128, 128, 3), dtype=np.uint8)
        img = cv2.add(img, noise)

        filename = str(data_dir / f"img_{i}.jpg")
        cv2.imwrite(filename, img)
        images.append(filename)
        labels.append(label)
    return images, labels

def preprocess_image(path, augment=False):
    img = cv2.imread(path)
    if img is None:
        return np.zeros((64 * 64 * 3,))
    # Resizing
    img_resized = cv2.resize(img, (64, 64))
    
    # Augmentation (Horizontal Flip)
    if augment and np.random.rand() > 0.5:
        img_resized = cv2.flip(img_resized, 1)
        
    # Normalization
    img_norm = img_resized.astype(np.float32) / 255.0
    
    # Feature Representation (Flattening)
    return img_norm.flatten()

def train():
    images, labels = generate_dummy_images()
    
    X = []
    y = []
    print("Preprocessing and augmenting images...")
    for path, label in zip(images, labels):
        # Original
        X.append(preprocess_image(path, augment=False))
        y.append(label)
        # Augmented
        X.append(preprocess_image(path, augment=True))
        y.append(label)

    X = np.array(X)
    y = np.array(y)

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Optimization: Regularization and Hyperparameter Tuning
    pipeline = Pipeline([
        ('scaler', StandardScaler()),
        ('classifier', RandomForestClassifier(random_state=42))
    ])

    param_grid = {
        'classifier__n_estimators': [50, 100],
        'classifier__max_depth': [5, 10],   # explicit regularization to avoid overfitting
        'classifier__min_samples_split': [2, 5]
    }

    print("Training and optimizing Image model...")
    grid = GridSearchCV(pipeline, param_grid, cv=3, n_jobs=-1)
    grid.fit(X_train, y_train)

    best_model = grid.best_estimator_

    print("Validation Accuracy:", accuracy_score(y_test, best_model.predict(X_test)))
    print("Sample Test Outputs:", best_model.predict(X_test[:5]), "Expected:", y_test[:5])

    joblib.dump(best_model.named_steps['classifier'], BASE_DIR / "image_model.pkl")
    joblib.dump(best_model.named_steps['scaler'], BASE_DIR / "image_vectorizer.pkl")
    print("✅ Image model trained and optimized successfully.")

if __name__ == "__main__":
    train()
