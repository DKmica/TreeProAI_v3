FROM python:3.11-slim

WORKDIR /app

# PaddleOCR requires some image processing libraries
RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0 && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY services/ocr/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY services/ocr/ .

# Expose the port
EXPOSE 8005

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8005"]