FROM python:3.11-slim

WORKDIR /app

# Copy requirements and install dependencies
COPY services/routing/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY services/routing/ .

# Expose the port the app runs on
EXPOSE 8004

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8004"]