from fastapi import FastAPI, UploadFile, File
from typing import List
import uvicorn

app = FastAPI()

# TODO: load YOLO11 + SAM2 models at startup
@app.post("/infer")
async def infer(images: List[UploadFile] = File(...)):
    # 1) YOLO11 detect: trees/obstacles/PPE/powerlines
    # 2) SAM2 segment canopies/brush piles as needed
    # 3) Return detections + masks + engineered features
    return {"detections": [], "features": {}}

if __name__ == "__main__":
    # Using port 8000 to match the existing docker-compose configuration
    uvicorn.run(app, host="0.0.0.0", port=8000)