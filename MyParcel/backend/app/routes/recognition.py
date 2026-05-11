import logging
import uuid
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.config import settings
from app.services.pdf_recognition import recognize_pdf_table

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/recognition")
async def recognition(file: UploadFile = File(...)):
    logger.info("recognition endpoint called filename=%s content_type=%s", file.filename, file.content_type)

    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")

    upload_dir = Path(settings.upload_dir)
    upload_dir.mkdir(parents=True, exist_ok=True)

    safe_name = f"{uuid.uuid4().hex}_{file.filename}"
    pdf_path = upload_dir / safe_name

    content = await file.read()
    pdf_path.write_bytes(content)

    response = recognize_pdf_table(str(pdf_path))
    logger.info("recognition endpoint response=%s", response)
    return response