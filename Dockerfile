# Build frontend
FROM node:20-alpine AS builder

WORKDIR /build
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Production image
FROM python:3.11-slim

RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app

COPY app/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY app/ .

COPY --from=builder /build/dist /app/static

RUN chown -R appuser:appuser /app

USER appuser

CMD ["fastapi", "run", "main.py", "--port", "5000"]