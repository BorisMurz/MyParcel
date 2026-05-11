import logging
from fastapi import APIRouter, HTTPException
from app.schemas import VisualizationRequest
from app.services.geometry_service import to_wgs84, build_multipolygon_wkt
from app.services.excel_storage import save_geometry
from app.config import settings

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/visualization")
async def visualization(payload: VisualizationRequest):
    logger.info("visualization endpoint called payload=%s", payload.model_dump())

    if payload.sk not in ["msk50z1", "msk50z2"]:
        raise HTTPException(status_code=400, detail="Invalid coordinate system")

    try:
        coords_wgs84 = to_wgs84([c.model_dump() for c in payload.coords], payload.sk)
        is_valid, wkt, reason = build_multipolygon_wkt(coords_wgs84)

        if is_valid and wkt:
            save_geometry(payload.file_name or "unknown.pdf", wkt, settings.geometry_xlsx)
            response = {"result": True}
        else:
            logger.info("visualization invalid geometry reason=%s", reason)
            response = {"result": False}

        logger.info("visualization endpoint response=%s", response)
        return response

    except Exception as exc:
        logger.exception("visualization error: %s", exc)
        return {"result": False}