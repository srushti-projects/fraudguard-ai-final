# FraudGuard AI 🛡️

FraudGuard AI is an advanced, multi-modal fraud and cybersecurity threat detection platform. It combines a state-of-the-art **FastAPI** neural backend with a high-performance **React + Tailwind** glassmorphic frontend to classify, track, and mitigate 8 distinct vectors of digital deception in real-time.

## ✨ Core Features

*   **8-Vector ML Detection Engine**: Independent, optimized models to analyze incoming payloads across all primary attack surfaces:
    *   **SMS & Chat**: NLP-driven spam and phishing detection.
    *   **Email**: Deep semantic analysis of spoofed or malicious correspondence.
    *   **URL**: Lexical and structural evaluation of high-risk domains.
    *   **Image**: Spatial manipulation and anomaly detection via OpenCV.
    *   **Audio**: Acoustic deepfake spotting using MFCC (Mel-frequency cepstral coefficients) via Librosa.
    *   **Video**: Spatio-temporal frame sequencing to catch visual manipulation.
    *   **Prompt Injection**: LLM defense identifying malicious payload inputs.
    *   **Jailbreak Attempt**: AI behavioral limit testing detection.
*   **Live Threat Telemetry Dashboard**: Real-time analytical grid rendering multi-modal trend data via `Recharts`, providing an overarching view of global scam heuristics.
*   **Decentralized Intelligence Network**: A live community threat feed allowing users to submit zero-day threats directly into the system to organically warn others.
*   **Glassmorphic Cyber UI**: A unified aesthetic system coupling specialized color codes and neon lighting for distinct threat vectors, keeping data perfectly structured and legible. 

## 🏗️ Architecture Stack

### Frontend
*   **React + Vite**: Ultra-fast build tool and modular UI framework.
*   **Tailwind CSS**: Utility-first styling with advanced custom gradients and blur utilities.
*   **Framer Motion**: Smooth, cinematic layout transitions and micro-interactions.
*   **Recharts**: High-density analytics and real-time jagged data lines.

### Backend & ML
*   **FastAPI**: Asynchronous Python API handling endpoints, payload transformations, and routing.
*   **Scikit-Learn**: Vectorization, scaling, model tuning (GridSearch), and RandomForest/LogisticRegression compilation.
*   **Joblib**: Model serialization and lightning-fast loading.
*   **SQLite**: Persisted tracking of community submissions and historical trends.
*   **OpenCV & Librosa**: Spatial and temporal media feature extraction.

## 🚀 Installation & Setup

### 1. Backend Setup
Ensure you have Python 3.9+ installed and configure your virtual environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt
pip install opencv-python Pillow librosa scikit-learn numpy pandas
```

### 2. Train the Machine Learning Models
If you cloned the repository or need to generate local predictions from scratch, train the modular neural networks:
*(Assuming you are in the project root `Fraud_detection_system/`)*

```bash
python ml/sms/train.py
python ml/email/train.py
python ml/url/train.py
python ml/prompt/train.py
python ml/jailbreak/train.py
python ml/image/train.py
python ml/audio/train.py
python ml/video/train.py
```
*(All models will auto-generate their serialized `.pkl` and vectorizer states into their respective target directories.)*

### 3. Start the Backend API
```bash
cd backend
uvicorn app.main:app --reload
```
The REST API will boot on `http://127.0.0.1:8000`.

### 4. Frontend Setup
In a new terminal split, initialize the React client:
```bash
cd frontend
npm install
npm run dev
```
The app will bind visually on `http://localhost:5173`.

---

## 🎨 Unified Color Mapping
The interface utilizes an active color-coding heuristic. Ensure all newly proposed threat modifications map correctly onto this schema:
- **Cyan**: SMS / Chat
- **Orange**: Email
- **Green**: URL
- **Purple**: Image
- **Pink**: Audio
- **Blue**: Video
- **Yellow**: Prompt Injection
- **Red**: Jailbreak
