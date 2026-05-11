from pydantic import BaseModel
from typing import List, Optional

class Coord(BaseModel):
    x: float
    y: float

class RecognitionResult(BaseModel):
    result: dict

class VisualizationRequest(BaseModel):
    sk: str
    coords: List[Coord]
    file_name: Optional[str] = None

class VisualizationResult(BaseModel):
    result: bool

class GeometryItem(BaseModel):
    name: str
    WKT: str

class GeometryResponse(BaseModel):
    geometry: List[GeometryItem]