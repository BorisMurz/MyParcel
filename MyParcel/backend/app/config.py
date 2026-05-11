from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    upload_dir: str = str(BASE_DIR / "uploads")
    logs_dir: str = str(BASE_DIR / "logs")
    geometry_xlsx: str = str(BASE_DIR / "geometry.xlsx")
    cors_origins: list[str] = ["http://localhost:5173"]

settings = Settings()