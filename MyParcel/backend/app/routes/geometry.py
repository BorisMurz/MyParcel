import logging
from fastapi import APIRouter
from app.config import settings
from app.services.map_service import load_geometry_items

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/geometry")
async def geometry():
    logger.info("geometry endpoint called")
    items = load_geometry_items(settings.geometry_xlsx)
    response = {"geometry": [item.model_dump() for item in items]}
    logger.info("geometry endpoint response_count=%s", len(items))
    return response