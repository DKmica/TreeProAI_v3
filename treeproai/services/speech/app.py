from fastapi import FastAPI, UploadFile, File
import uvicorn
import os

app = FastAPI(
    title="TreeProAI Speech Service",
    description="Transcribes audio files to text using faster-whisper.",
    version="0.1.0"
)

# TODO: Initialize the model at startup for production use
# from faster_whisper import WhisperModel
# model_size = "base.en"
# model = WhisperModel(model_size, device="cpu", compute_type="int8")

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    # In a real implementation, you would transcribe the audio file:
    # segments, info = model.transcribe(file.file, beam_size=5)
    # transcribed_text = "".join([segment.text for segment in segments])
    # return {"text": transcribed_text}
    return {"text": ""}

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8006"))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)