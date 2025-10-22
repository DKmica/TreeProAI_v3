from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os

app = FastAPI(
    title="TreeProAI Pricing Service",
    description="Deterministic pricing and lead scoring.",
    version="0.1.0"
)

# --- Pydantic Models ---
class PricingInput(BaseModel):
    vision_json: dict
    region: str = "default"
    crew_hourly_rate: float = 75.0
    crew_size: int = 3
    overhead_pct: float = 0.20
    margin_pct: float = 0.30
    dump_fee_per_ton: float = 150.0

class PricingResponse(BaseModel):
    price: float
    price_range: List[float]
    confidence: float
    line_items: List[dict]
    notes: List[str]

class LeadScoreInput(BaseModel):
    lead_metadata: dict

class LeadScoreResponse(BaseModel):
    score: float # 0.0 to 1.0
    reasoning: List[str]

# --- Endpoints ---
@app.get("/healthz")
def healthz():
    return {"status": "ok"}

@app.get("/readyz")
def readyz():
    return {"status": "ready"}

@app.post("/price", response_model=PricingResponse)
async def get_price(input_data: PricingInput):
    """Calculates a price based on vision analysis and business logic."""
    line_items = []
    total_est_hours = 0
    total_green_waste_kg = 0
    risk_multiplier = 1.0

    for tree in input_data.vision_json.get("trees", []):
        # Heuristic: hours based on DBH
        est_hours = 2.0 + (tree.get("dbh_cm", 30) / 20.0)
        total_est_hours += est_hours
        
        # Heuristic: waste based on height
        total_green_waste_kg += tree.get("height_m", 10) * 50

        # Risk multiplier
        if "near_house" in tree.get("hazards", []):
            risk_multiplier = max(risk_multiplier, 1.1)
        if "powerline_conflict" in tree.get("hazards", []):
            risk_multiplier = max(risk_multiplier, 1.25)
        
        line_items.append({
            "description": f"Work on {tree.get('species', 'unknown tree')}",
            "qty": 1,
            "unit_price": 0 # will be calculated later
        })

    base_labor = input_data.crew_hourly_rate * input_data.crew_size * total_est_hours
    # For now, no equipment cost
    equip_cost = 0.0
    disposal_cost = (total_green_waste_kg / 1000) * input_data.dump_fee_per_ton

    price_before_oh = (base_labor + equip_cost + disposal_cost) * risk_multiplier
    final_price = price_before_oh * (1 + input_data.overhead_pct + input_data.margin_pct)

    # Distribute price across line items
    if line_items:
        price_per_item = price_before_oh / len(line_items)
        for item in line_items:
            item["unit_price"] = round(price_per_item * (1 + input_data.overhead_pct + input_data.margin_pct), 2)

    confidence = input_data.vision_json.get("confidence", 0.75)
    price_range_pct = 0.20 * (1 - confidence) # Higher confidence = tighter range
    price_range = [
        round(final_price * (1 - price_range_pct), 2),
        round(final_price * (1 + price_range_pct), 2)
    ]

    return PricingResponse(
        price=round(final_price, 2),
        price_range=price_range,
        confidence=confidence,
        line_items=line_items,
        notes=["Pricing based on v1-heuristic model."]
    )

@app.post("/score", response_model=LeadScoreResponse)
async def get_score(input_data: LeadScoreInput):
    """Provides a simple lead quality score."""
    score = 0.5 # Baseline
    reasoning = ["Baseline score"]
    return LeadScoreResponse(score=score, reasoning=reasoning)

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8001"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)