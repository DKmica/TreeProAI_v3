from fastapi import FastAPI, UploadFile, File, HTTPException, Body
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os

app = FastAPI(
    title="TreeProAI Vision Service",
    description="AI heuristics for tree detection and analysis.",
    version="0.1.0"
)

# --- Pydantic Models ---
class TreeHazard(BaseModel):
    type: str # e.g., 'near_house', 'powerline_conflict'
    severity: str # 'LOW', 'MEDIUM', 'HIGH'

class TreeAccess(BaseModel):
    bucket_truck_possible: bool
    backyard_gate_width_cm: Optional[int]

class TreeDetection(BaseModel):
    id: str
    species: str
    dbh_cm: float
    height_m: float
    canopy_diameter_m: float
    hazards: List[str]
    access: TreeAccess

class AnalysisInput(BaseModel):
    image_keys: List[str]
    location: Optional[dict] = None

class AnalysisResponse(BaseModel):
    trees: List[TreeDetection]
    confidence: float
    notes: List[str]

# --- Endpoints ---
@app.get("/healthz")
def healthz():
    return {"status": "ok"}

@app.get("/readyz")
def readyz():
    return {"status": "ready"}

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_images(input_data: AnalysisInput):
    """
    Analyzes images from S3 keys to detect trees and their properties.
    In this heuristic version, it returns a fixed mock response.
    """
    if not input_data.image_keys:
        raise HTTPException(status_code=400, detail="No image keys provided.")

    # HEURISTIC FALLBACK LOGIC
    # This logic does not actually download or analyze images.
    # It returns a consistent, hardcoded response for demonstration purposes.
    mock_trees = [
        TreeDetection(
            id="t1",
            species="Oak (Quercus robur) (est.)",
            dbh_cm=61.5,
            height_m=17.2,
            canopy_diameter_m=9.2,
            hazards=["near_house", "fence_within_3m"],
            access=TreeAccess(bucket_truck_possible=True, backyard_gate_width_cm=90)
        ),
        TreeDetection(
            id="t2",
            species="Maple (Acer rubrum) (est.)",
            dbh_cm=45.0,
            height_m=12.0,
            canopy_diameter_m=7.5,
            hazards=["possible_powerline"],
            access=TreeAccess(bucket_truck_possible=False, backyard_gate_width_cm=90)
        )
    ]

    return AnalysisResponse(
        trees=mock_trees,
        confidence=0.78,
        notes=["Heuristic mode active. Reshoot trunk base for better accuracy.", "Powerline proximity requires on-site verification."]
    )

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)