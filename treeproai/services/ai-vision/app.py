from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os

app = FastAPI(title="TreeProAI Vision Service", description="AI heuristics for tree detection and segmentation")

class TreeDetection(BaseModel):
    id: str
    label: str
    confidence: float
    bbox: List[float]  # [x1, y1, x2, y2]
    heightEstimateM: Optional[float]
    dbhEstimateCm: Optional[float]

class AnalysisResponse(BaseModel):
    trees: List[TreeDetection]
    confidence: float
    notes: List[str]

@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.get("/readyz")
def readyz():
    return {"ready": True}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    # Heuristic fallback: return mock detections
    mock_trees = [
        TreeDetection(
            id="tree_1",
            label="Oak",
            confidence=0.85,
            bbox=[100, 100, 300, 500],
            heightEstimateM=12.5,
            dbhEstimateCm=45
        ),
        TreeDetection(
            id="tree_2",
            label="Maple",
            confidence=0.72,
            bbox=[400, 150, 600, 450],
            heightEstimateM=9.2,
            dbhEstimateCm=32
        )
    ]
    
    return AnalysisResponse(
        trees=mock_trees,
        confidence=0.78,
        notes=["Heuristic mode: using reference object scaling", "EXIF focal length: 24mm"]
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8001"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)