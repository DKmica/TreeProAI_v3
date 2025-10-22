FROM python:3.11-slim

WORKDIR /app

# Prophet's dependency (pystan) needs a C++ compiler.
# We install build-essential, run pip install, then remove it to keep the image small.
RUN apt-get update && \
    apt-get install -y build-essential && \
    pip install --no-cache-dir -r /app/requirements.txt && \
    apt-get purge -y --auto-remove build-essential && \
    rm -rf /var/lib/apt/lists/*

# Copy application code after installing dependencies to leverage Docker cache
COPY services/forecast/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY services/forecast/ .

# Expose the port the app runs on
EXPOSE 8003

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8003"]