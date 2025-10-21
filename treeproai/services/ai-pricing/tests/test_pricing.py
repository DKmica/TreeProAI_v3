import pytest
from fastapi.testclient import TestClient
from ..app import app

client = TestClient(app)

def test_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"ok": True}

def test_readyz():
    response = client.get("/readyz")
    assert response.status_code == 200
    assert response.json() == {"ready": True}

def test_price_quote():
    response = client.post("/price", json={
        "trees": [{"id": "tree_1", "label": "Oak", "confidence": 0.9}],
        "crewSize": 3,
        "crewHourly": 50.0,
        "equipment": [],
        "greenWasteKg": 100.0
    })
    assert response.status_code == 200
    data = response.json()
    assert "price" in data
    assert data["price"] > 0

def test_score_lead():
    response = client.post("/score", json={
        "leadData": {"trees": [{"dbhEstimateCm": 50}]},
        "quoteHistory": []
    })
    assert response.status_code == 200
    data = response.json()
    assert "score" in data
    assert 0 <= data["score"] <= 1