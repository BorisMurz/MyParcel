from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.logger import setup_logging
from app.routes.recognition import router as recognition_router
from app.routes.visualization import router as visualization_router
from app.routes.geometry import router as geometry_router
from app.config import settings

setup_logging()

app = FastAPI(title="Land Parcel SRZU", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recognition_router, prefix="/api", tags=["recognition"])
app.include_router(visualization_router, prefix="/api", tags=["visualization"])
app.include_router(geometry_router, prefix="/api", tags=["geometry"])


@app.get("/api/health")
async def health():
    return {"status": "ok"}