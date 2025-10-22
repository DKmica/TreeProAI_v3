FROM python:3.9-slim

WORKDIR /app

COPY services/ai-pricing/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY services/ai-pricing/ .

EXPOSE 8001

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001"]