# Build frontend
FROM node:18 as frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./

RUN npm run build

# Build backend
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim

WORKDIR /app

# Create non-root user
# RUN useradd -m -u 1000 user

# Create and configure cache directory
RUN mkdir -p /app/.cache
#RUN chown -R user:user /app

# UV params
ENV UV_COMPILE_BYTECODE=1
ENV UV_CACHE_DIR=/app/.cache

# Copy uv configuration files
COPY backend/pyproject.toml backend/uv.lock ./

# Install dependencies using uv
RUN uv sync --frozen --no-install-project --no-dev

# Copy backend code
COPY backend/ .

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    curl \
    netcat-openbsd \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# Copy frontend server and build
COPY --from=frontend-build /app/build ./frontend/build
COPY --from=frontend-build /app/package*.json ./frontend/
COPY --from=frontend-build /app/server.js ./frontend/

# Install frontend production dependencies
WORKDIR /app/frontend
RUN npm install --production
WORKDIR /app

# Environment variables
ENV HF_HOME=/app/.cache \
    TRANSFORMERS_CACHE=/app/.cache \
    HF_DATASETS_CACHE=/app/.cache \
    INTERNAL_API_PORT=7861 \
    PORT=7860 \
    NODE_ENV=production

# Note: HF_TOKEN should be provided at runtime, not build time
# RUN chown -R user:user /app
RUN chmod -R 777 /app/
# USER user
EXPOSE 7860

# Start both servers with wait-for
CMD ["sh", "-c", "uv run uvicorn app.asgi:app --host 0.0.0.0 --port 7861 & while ! nc -z localhost 7861; do sleep 1; done && cd frontend && npm run serve"]
