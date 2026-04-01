from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import detect, community, trends, scan_routes, reddit
from app.services.reddit_scraper import start_scraper

app = FastAPI(title="FraudGuard API", version="1.0.0")

@app.on_event("startup")
def startup_event():
    start_scraper()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# legacy detect and image routes
app.include_router(detect.router)

# new modular scan routes: /scan/sms, /scan/image, etc.
app.include_router(scan_routes.router)

# community routes -> /community/post, etc.
app.include_router(community.router, prefix="/community")

# trends -> /api/trends (legacy), /analytics/trends (new)
app.include_router(trends.router, prefix="/api")
app.include_router(trends.router, prefix="/analytics")

# reddit routes -> /reddit
app.include_router(reddit.router)

@app.get("/")
def root():
    # force uvicorn reload 4
    return {"status": "FraudGuard API online", "docs": "/docs"}





