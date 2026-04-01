import joblib
import numpy as np
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3]

# ==============================
# LOAD MODELS
# ==============================

models = {}

def load_model(name, model_path, vectorizer_path=None, scaler_path=None):
    try:
        model = joblib.load(model_path)
        vectorizer = joblib.load(vectorizer_path) if vectorizer_path else None
        scaler = joblib.load(scaler_path) if scaler_path else None

        models[name] = {
            "model": model,
            "vectorizer": vectorizer,
            "scaler": scaler
        }

        print(f"[LOADED] {name}")
    except Exception as e:
        print(f"[ERROR LOADING {name}]:", e)


# ==============================
# TEXT MODELS
# ==============================

load_model(
    "sms",
    BASE_DIR / "ml/sms/sms_model.pkl",
    BASE_DIR / "ml/sms/sms_vectorizer.pkl"
)

load_model(
    "email",
    BASE_DIR / "ml/email/email_model.pkl",
    BASE_DIR / "ml/email/email_vectorizer.pkl"
)

load_model(
    "prompt",
    BASE_DIR / "ml/prompt/prompt_model.pkl",
    BASE_DIR / "ml/prompt/prompt_vectorizer.pkl"
)

load_model(
    "jailbreak",
    BASE_DIR / "ml/jailbreak/jailbreak_model.pkl",
    BASE_DIR / "ml/jailbreak/jailbreak_vectorizer.pkl"
)

# ==============================
# URL MODEL (NUMERIC)
# ==============================

load_model(
    "url",
    BASE_DIR / "ml/url/url_model.pkl",
    scaler_path=BASE_DIR / "ml/url/url_scaler.pkl"
)

# ==============================
# MEDIA MODELS 
# ==============================

load_model("image", BASE_DIR / "ml/image/image_model.pkl", scaler_path=BASE_DIR / "ml/image/image_vectorizer.pkl")
load_model("audio", BASE_DIR / "ml/audio/audio_model.pkl", scaler_path=BASE_DIR / "ml/audio/audio_vectorizer.pkl")
load_model("video", BASE_DIR / "ml/video/video_model.pkl", scaler_path=BASE_DIR / "ml/video/video_vectorizer.pkl")

# ==============================
# HELPER: FEATURE GENERATION FOR MEDIA
# ==============================

def extract_image_features(path):
    import cv2
    img = cv2.imread(path)
    if img is None:
        return np.zeros((64 * 64 * 3,))
    img_resized = cv2.resize(img, (64, 64))
    img_norm = img_resized.astype(np.float32) / 255.0
    return img_norm.flatten()

def extract_audio_features(path):
    import librosa
    try:
        audio, sr = librosa.load(path, sr=22050)
        mfccs = librosa.feature.mfcc(y=audio, sr=sr, n_mfcc=20)
        return np.mean(mfccs.T, axis=0)
    except Exception:
        return np.zeros((20,))

def extract_video_features(path):
    import cv2
    cap = cv2.VideoCapture(path)
    extracted_frames = []
    frame_count = 0
    while cap.isOpened() and frame_count < 100: # limit to avoid hanging
        ret, frame = cap.read()
        if not ret: break
        if frame_count % 5 == 0:
            extracted_frames.append(np.mean(frame, axis=(0, 1)))
        frame_count += 1
    cap.release()
    if not extracted_frames:
        return np.zeros((6,))
    extracted_frames = np.array(extracted_frames)
    temp_mean = np.mean(extracted_frames, axis=0)
    temp_std = np.std(extracted_frames, axis=0)
    return np.concatenate([temp_mean, temp_std])

# ==============================
# CORE FUNCTION
# ==============================

def run_scan(scan_type, input_data):
    """
    scan_type: sms | email | url | prompt | jailbreak | image | audio | video
    input_data: text OR dict OR filepath
    """

    if scan_type not in models or not models[scan_type].get("model"):
        return {
            "prediction": 0,
            "label": "Safe",
            "confidence": 0.0,
            "error": "Invalid or missing model for scan type",
            "details": "Model load error"
        }

    model_data = models[scan_type]
    model = model_data["model"]

    try:
        # ==============================
        # TEXT MODELS
        # ==============================
        if scan_type in ["sms", "email", "prompt", "jailbreak"]:
            vectorizer = model_data["vectorizer"]

            X = vectorizer.transform([str(input_data)])
            prediction = model.predict(X)[0]
            prob = model.predict_proba(X)[0]

        # ==============================
        # URL MODEL
        # ==============================
        elif scan_type == "url":
            scaler = model_data["scaler"]

            if not isinstance(input_data, dict):
                return {
                    "prediction": 0,
                    "label": "Safe",
                    "confidence": 0.0,
                    "error": "URL input must be a feature dictionary",
                    "details": "Fallback URL scan"
                }

            X = np.array([list(input_data.values())])
            X_scaled = scaler.transform(X)

            prediction = model.predict(X_scaled)[0]
            prob = model.predict_proba(X_scaled)[0]

        # ==============================
        # MEDIA MODELS (IMAGE/AUDIO/VIDEO)
        # ==============================
        elif scan_type in ["image", "audio", "video"]:
            scaler = model_data.get("scaler")
            
            if scan_type == "image":
                features = extract_image_features(input_data)
            elif scan_type == "audio":
                features = extract_audio_features(input_data)
            else:
                features = extract_video_features(input_data)

            # Scale if scaler is available
            X = np.array([features])
            if scaler:
                X = scaler.transform(X)
                
            prediction = model.predict(X)[0]
            prob = model.predict_proba(X)[0]

        else:
            return {
                "prediction": 0,
                "label": "Safe",
                "confidence": 0.0,
                "error": "Unsupported scan type",
                "details": "Invalid module specified"
            }

        # ==============================
        # FORMAT OUTPUT
        # ==============================

        confidence = float(max(prob))

        return {
            "prediction": int(prediction),
            "label": "Scam" if prediction == 1 else "Safe",
            "confidence": confidence,
            "details": f"Processed via {scan_type} model"
        }

    except Exception as e:
        return {
            "prediction": 0,
            "label": "Safe",
            "confidence": 0.0,
            "details": str(e),
            "error": str(e)
        }