FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY services/ai-tabular/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY services/ai-tabular/ .

# Expose the port the app runs on
EXPOSE 8002

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8002"]