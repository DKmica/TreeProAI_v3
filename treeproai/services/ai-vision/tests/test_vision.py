import pytest
from fastapi.testclient import TestClient
from ..app import app

client = TestClient(app)

def test_healthz():
    response = client.get("/healthz")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_analyze_success():
    response = client.post("/analyze", json={"image_keys": ["some/key.jpg"]})
    assert response.status_code == 200
    data = response.json()
    assert "trees" in data
    assert "confidence" in data
    assert len(data["trees"]) == 2
    assert data["trees"][0]["species"] == "Oak (Quercus robur) (est.)"

def test_analyze_no_keys():
    response = client.post("/analyze", json={"image_keys": []})
    assert response.status_code == 400