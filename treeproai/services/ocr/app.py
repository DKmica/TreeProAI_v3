from fastapi import FastAPI, UploadFile, File
import uvicorn
import os

app = FastAPI(
    title="TreeProAI OCR Service",
    description="Extracts text from documents and images using PaddleOCR.",
    version="0.1.0"
)

# TODO: Initialize the OCR model at startup for production use
# from paddleocr import PaddleOCR
# ocr_model = PaddleOCR(use_angle_cls=True, lang='en', use_gpu=False) 

@app.post("/ocr")
async def ocr(file: UploadFile = File(...)):
    # In a real implementation, you would process the file:
    # contents = await file.read()
    # result = ocr_model.ocr(contents, cls=True)
    # if result and result[0]:
    #     extracted_text = " ".join([line[1][0] for line in result[0]])
    #     return {"text": extracted_text}
    return {"text": ""}

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8005"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)