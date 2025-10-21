from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os

app = FastAPI(title="TreeProAI Pricing Service", description="AI pricing math and lead scoring")

class PriceRequest(BaseModel):
    trees: List[dict]  # From vision service
    crewSize: int = 3
    crewHourly: float = 50.0
    equipment: List[dict] = []
    greenWasteKg: float = 100.0
    accessDifficulty: str = "EASY"  # EASY, MODERATE, HARD
    riskFactor: str = "LOW"  # LOW, MEDIUM, HIGH

class PriceResponse(BaseModel):
    baseLabor: float
    equipmentCost: float
    disposalCost: float
    priceBeforeOH: float
    price: float
    priceRange: List[float]  # [min, max]
    confidence: float
    notes: List[str]

class ScoreRequest(BaseModel):
    leadData: dict
    quoteHistory: List[dict]

class ScoreResponse(BaseModel):
    score: float  # 0.0 to 1.0
    reasoning: List[str]

@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.get("/readyz")
def readyz():
    return {"ready": True}

@app.post("/price", response_model=PriceResponse)
async def price_quote(req: PriceRequest):
    # Deterministic pricing formula
    estHours = len(req.trees) * 1.5
    BaseLabor = req.crewHourly * req.crewSize * estHours
    
    Equip = 0.0
    for e in req.equipment:
        Equip += e.get("ratePerHour", 0) * e.get("hours", 1)
    
    dumpPerTon = 35.0
    Disposal = (req.greenWasteKg / 1000) * dumpPerTon
    
    AccessMult = {"EASY": 1.0, "MODERATE": 1.2, "HARD": 1.5}.get(req.accessDifficulty, 1.0)
    RiskMult = {"LOW": 1.0, "MEDIUM": 1.1, "HIGH": 1.3}.get(req.riskFactor, 1.0)
    
    PriceBeforeOH = (BaseLabor + Equip + Disposal) * AccessMult * RiskMult
    OverheadPct = 0.20
    MarginPct = 0.30
    Price = PriceBeforeOH * (1 + OverheadPct + MarginPct)
    
    # Range by confidence
    RangePct = 0.15
    priceRange = [Price * (1 - RangePct), Price * (1 + RangePct)]
    
    return PriceResponse(
        baseLabor=BaseLabor,
        equipmentCost=Equip,
        disposalCost=Disposal,
        priceBeforeOH=PriceBeforeOH,
        price=Price,
        priceRange=priceRange,
        confidence=0.82,
        notes=["Heuristic pricing: deterministic formula", f"Estimated {estHours} hours for {len(req.trees)} trees"]
    )

@app.post("/score", response_model=ScoreResponse)
async def score_lead(req: ScoreRequest):
    # Simple lead scoring heuristic
    score = 0.5
    reasoning = ["Fallback scoring: using average probability"]
    
    # Boost score if lead has high-value trees
    highValueCount = sum(1 for t in req.leadData.get("trees", []) if t.get("dbhEstimateCm", 0) > 40)
    if highValueCount > 2:
        score = min(1.0, score + 0.2)
        reasoning.append("High-value trees detected")
    
    return ScoreResponse(score=score, reasoning=reasoning)

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8002"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)