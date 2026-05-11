import logging
from pyproj import CRS, Transformer
from shapely.geometry import Polygon, MultiPolygon
from shapely.validation import explain_validity

logger = logging.getLogger(__name__)

CRS_WGS84 = CRS.from_epsg(4326)

CRS_MSK50Z1 = CRS.from_proj4(
    "+proj=tmerc +lat_0=0 +lon_0=35.48333333333 +k=1 +x_0=1250000 +y_0=-5712900.566 "
    "+ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +units=m +no_defs"
)

CRS_MSK50Z2 = CRS.from_proj4(
    "+proj=tmerc +lat_0=0 +lon_0=38.48333333333 +k=1 +x_0=2250000 +y_0=-5712900.566 "
    "+ellps=krass +towgs84=23.57,-140.95,-79.8,0,0.35,0.79,-0.22 +units=m +no_defs"
)

def get_transformer(sk: str) -> Transformer:
    source_crs = CRS_MSK50Z1 if sk == "msk50z1" else CRS_MSK50Z2
    return Transformer.from_crs(source_crs, CRS_WGS84, always_xy=True)

def to_wgs84(coords: list[dict], sk: str) -> list[tuple[float, float]]:
    logger.info("to_wgs84 called sk=%s coords=%s", sk, coords)

    transformer = get_transformer(sk)
    result: list[tuple[float, float]] = []

    for c in coords:
        x = c["y"]
        y = c["x"]
        lon, lat = transformer.transform(x, y)
        result.append((lon, lat))

    logger.info("to_wgs84 result=%s", result)
    return result

def ensure_closed(coords: list[tuple[float, float]]) -> list[tuple[float, float]]:
    if not coords:
        return coords
    if coords[0] != coords[-1]:
        return coords + [coords[0]]
    return coords

def build_multipolygon_wkt(coords_wgs84: list[tuple[float, float]]) -> tuple[bool, str | None, str | None]:
    logger.info("build_multipolygon_wkt called coords_count=%s", len(coords_wgs84))

    coords_wgs84 = ensure_closed(coords_wgs84)

    if len(coords_wgs84) < 4:
        return False, None, "Too few coordinates"

    polygon = Polygon(coords_wgs84)

    if not polygon.is_valid:
        reason = explain_validity(polygon)
        logger.info("Polygon invalid: %s", reason)
        return False, None, reason

    multipolygon = MultiPolygon([polygon])

    if not multipolygon.is_valid:
        reason = explain_validity(multipolygon)
        logger.info("MultiPolygon invalid: %s", reason)
        return False, None, reason

    logger.info("MultiPolygon valid: %s", multipolygon.wkt)
    return True, multipolygon.wkt, None