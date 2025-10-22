import pytest
from fastapi.testclient import TestClient
from ..app import app

client = TestClient(app)

@pytest.fixture
def vision_data():
    return {
        "trees": [
            {
                "id": "t1",
                "species": "Oak (Quercus robur) (est.)",
                "dbh_cm": 60,
                "height_m": 17,
                "canopy_diameter_m": 9,
                "hazards": ["near_house"],
                "access": {"bucket_truck_possible": True, "backyard_gate_width_cm": 90}
            }
        ],
        "confidence": 0.8,
        "notes": []
    }

def test_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_get_price(vision_data):
    response = client.post("/price", json={"vision_json": vision_data})
    assert response.status_code == 200
    data = response.json()
    assert "price" in data
    assert "price_range" in data
    assert "line_items" in data
    assert data["price"] > 0
    assert len(data["line_items"]) == 1
    assert data["line_items"][0]["unit_price"] == data["price"]

def test_get_score():
    response = client.post("/score", json={"lead_metadata": {}})
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert 0 <= data["score"] <= 1