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

def test_analyze_mock():
    # Since we can't upload files in test, we just verify the endpoint exists
    # In a real test, we'd use client.post("/analyze", files=...)
    response = client.post("/analyze", files={"file": ("test.jpg", b"fake image data", "image/jpeg")})
    assert response.status_code == 200
    data = response.json()
    assert "trees" in data
    assert "confidence" in data
    assert len(data["trees"]) > 0