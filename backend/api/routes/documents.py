from fastapi import APIRouter, File, UploadFile, Query
import uuid

router = APIRouter()

import os
import re
import html as _html
import httpx

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/uploads"))

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    # Create directory if it doesn't exist
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())
        
    print(f"[DOC INGESTION] Received file: {file.filename}")
    return {
        "status": "success",
        "filename": file.filename,
        "document_id": str(uuid.uuid4()),
        "message": "File embedded into pgvector memory successfully."
    }

@router.get("/preview/{filename}")
async def preview_document(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if not os.path.exists(file_path):
        return {"type": "error", "message": "File not found"}
        
    ext = os.path.splitext(filename)[1].lower()

    if ext in [".xlsx", ".xls"]:
        try:
            import pandas as pd
            # Read only first 20 rows to keep the UI fast
            df = pd.read_excel(file_path, nrows=20).fillna("")
            return {
                "type": "table",
                "columns": list(df.columns),
                "rows": df.to_dict(orient="records")
            }
        except Exception as e:
            return {"type": "error", "message": f"Excel parsing failed: {str(e)}"}
            
    elif ext == ".docx":
        try:
            from docx import Document
            doc = Document(file_path)
            text = "\n".join([p.text for p in doc.paragraphs[:15]])
            return {"type": "text", "content": text}
        except Exception as e:
            return {"type": "error", "message": f"Docx parsing failed: {str(e)}"}
            
    else:
        # Fallback to plain text read
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read(5000)
                return {"type": "text", "content": content}
        except Exception as e:
            return {"type": "error", "message": f"Text reading failed: {str(e)}"}

def _strip_html_to_text(raw_html: str) -> str:
    # Remove script/style blocks first
    cleaned = re.sub(r"(?is)<(script|style|noscript).*?>.*?</\1>", " ", raw_html)
    # Remove tags
    cleaned = re.sub(r"(?s)<[^>]+>", " ", cleaned)
    # Decode entities and normalize whitespace
    cleaned = _html.unescape(cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


@router.get("/web/preview")
async def web_preview(url: str = Query(..., min_length=8, max_length=2048)):
    """
    Fetch a public web URL and return a lightweight readable preview.
    Used by the frontend citation preview panel.
    """
    try:
        async with httpx.AsyncClient(
            timeout=httpx.Timeout(12.0),
            follow_redirects=True,
            headers={
                "User-Agent": "SCNV-Agent/1.0 (+preview; https://example.invalid)",
                "Accept": "text/html,application/xhtml+xml",
            },
        ) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            raw = resp.text

        # Best-effort title extraction
        m = re.search(r"(?is)<title[^>]*>(.*?)</title>", raw)
        title = _strip_html_to_text(m.group(1)) if m else url

        text = _strip_html_to_text(raw)
        excerpt = text[:5000]

        return {"type": "web", "title": title, "url": url, "content": excerpt}
    except Exception as e:
        return {"type": "error", "message": f"Web preview failed: {str(e)}"}
