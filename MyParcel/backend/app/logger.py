import logging
from pathlib import Path
from app.config import settings

def setup_logging():
    logs_dir = Path(settings.logs_dir)
    logs_dir.mkdir(parents=True, exist_ok=True)

    log_file = logs_dir / "app.log"

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
        handlers=[
            logging.FileHandler(log_file, encoding="utf-8"),
            logging.StreamHandler()
        ],
    )