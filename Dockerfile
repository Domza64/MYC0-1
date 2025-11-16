# TODO: Test and support arm as well as x86
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

# Copy frontend
COPY --from=builder /build/dist/ /app/static/
COPY --from=builder /build/dist/static/ /app/static/
RUN rm -rf /app/static/static

RUN chown -R appuser:appuser /app

# Install gosu to drop privileges safely
ENV GOSU_VERSION 1.16
RUN apt-get update && apt-get install -y wget ca-certificates && \
    wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/1.19/gosu-amd64" && \
    chmod +x /usr/local/bin/gosu && \
    gosu nobody true && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

CMD ["fastapi", "run", "main.py", "--port", "5000"]