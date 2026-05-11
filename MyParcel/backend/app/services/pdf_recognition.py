import logging
import re
from pathlib import Path
import pdfplumber

logger = logging.getLogger(__name__)

def recognize_pdf_table(pdf_path: str) -> dict:
    logger.info("recognize_pdf_table called with pdf_path=%s", pdf_path)

    coords = []
    table_found = False

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text() or ""
                if "X" in text and "Y" in text:
                    rows = re.findall(r"(\d+)\s+(\d+\.\d+)\s+(\d+\.\d+)", text)
                    if rows:
                        table_found = True
                        for _, x, y in rows:
                            coords.append({"x": float(x), "y": float(y)})
                        break

        if table_found and coords:
            result = {"result": {"table": True, "coords": coords}}
        else:
            result = {"result": {"table": False}}

        logger.info("recognize_pdf_table response=%s", result)
        return result

    except Exception as exc:
        logger.exception("recognize_pdf_table error: %s", exc)
        return {"result": {"table": False, "error": "recognition_failed"}}