import sys
from pathlib import Path
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Allow running this file directly with `python main.py` from Backend/app.
if __package__ in (None, ""):
    sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.database.db import engine, Base
from app.router.auth_router import router as auth_router
from app.router.mango_router import router as mango_router
from app.router.purchase_router import router as purchase_router
from app.router.other_expense_router import router as other_expense_router
from app.router.download_router import router as download_router

# Create database tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000").rstrip("/")
allow_origins = [
    frontend_url,
    "https://kesar-king.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allow_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "Parth's Mango Record System Running"}


app.include_router(auth_router)
app.include_router(mango_router)
app.include_router(purchase_router)
app.include_router(other_expense_router)
app.include_router(download_router)
