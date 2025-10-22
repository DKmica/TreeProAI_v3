FROM python:3.11-slim

WORKDIR /app

# Install ffmpeg for audio processing, which is required by Whisper
RUN apt-get update && apt-get install -y ffmpeg && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY services/speech/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY services/speech/ .

# Expose the port
EXPOSE 8006

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8006"]