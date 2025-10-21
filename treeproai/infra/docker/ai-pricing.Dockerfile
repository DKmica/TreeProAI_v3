# infra/docker/ai-pricing.Dockerfile
# This Dockerfile builds and runs the FastAPI AI Pricing service.
# To build: docker build -t treeproai-ai-pricing -f infra/docker/ai-pricing.Dockerfile .

FROM python:3.9-slim

WORKDIR /app

# Install dependencies
COPY services/ai-pricing/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY services/ai-pricing/ ./services/ai-pricing/

EXPOSE 8002

# Run the application
CMD ["uvicorn", "services.ai-pricing.app:app", "--host", "0.0.0.0", "--port", "8002"]