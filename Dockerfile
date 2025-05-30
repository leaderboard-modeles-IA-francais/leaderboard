# Build frontend
FROM node:18 as frontend-build
WORKDIR /app
COPY frontend/package*.json ./
RUN yarn install
COPY frontend/ ./

RUN yarn build

# Build backend
FROM python:3.12-slim
WORKDIR /app

# Create non-root user
RUN useradd -m -u 1000 user

# Install poetry
RUN pip install poetry

# Install PyTorch
RUN pip install torch

# Create and configure cache directory
RUN mkdir -p /app/.cache && \
    chown -R user:user /app

# Copy and install backend dependencies
COPY backend/pyproject.toml backend/poetry.lock* ./
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi --no-root --only main

# Copy backend code
COPY backend/ .

# Install Node.js and npm
RUN apt-get update && apt-get install -y \
    curl \
    netcat-openbsd \
    && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*
RUN npm install --global yarn

# Copy frontend server and build
COPY --from=frontend-build /app/dist ./frontend/dist
COPY --from=frontend-build /app/package*.json ./frontend/
COPY --from=frontend-build /app/server.cjs ./frontend/

# Install frontend production dependencies
WORKDIR /app/frontend
RUN yarn install --production
WORKDIR /app

# Environment variables
ENV HF_HOME=/app/.cache \
    HF_DATASETS_CACHE=/app/.cache \
    INTERNAL_API_PORT=7861 \
    PORT=7860 \
    NODE_ENV=production

# Note: HF_TOKEN should be provided at runtime, not build time
USER user
EXPOSE 7860

# Start both servers with wait-for
CMD ["sh", "-c", "uvicorn app.asgi:app --host 0.0.0.0 --port 7861 & while ! nc -z localhost 7861; do sleep 1; done && cd frontend && node server.cjs"]