---
title: Leaderboard LLM FR
emoji: 🏆🇫🇷
colorFrom: blue
colorTo: red
sdk: docker
hf_oauth: true
pinned: true
license: apache-2.0
duplicated_from: open-llm-leaderboard/open_llm_leaderboard
tags:
- leaderboard
short_description: Track, rank and evaluate open LLMs and chatbots in French
---

# Leaderboard LLM FR

Modern React interface for comparing Large Language Models (LLMs) in an open and reproducible way.

## Features

- 📊 Interactive table with advanced sorting and filtering
- 🔍 Semantic model search
- 📌 Pin models for comparison
- 📱 Responsive and modern interface
- 🎨 Dark/Light mode
- ⚡️ Optimized performance with virtualization

## Architecture

The project is split into two main parts:

### Frontend (React)

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Application pages
│   ├── hooks/         # Custom React hooks
│   ├── context/       # React contexts
│   └── constants/     # Constants and configurations
├── public/            # Static assets
└── server.js          # Express server for production
```

### Backend (FastAPI)

```
backend/
├── app/
│   ├── api/           # API router and endpoints
│   │   └── endpoints/ # Specific API endpoints
│   ├── core/          # Core functionality
│   ├── config/        # Configuration
│   └── services/      # Business logic services
│       ├── leaderboard.py
│       ├── models.py
│       ├── votes.py
│       └── hf_service.py
└── utils/             # Utility functions
```

## Technologies

### Frontend

- React
- Material-UI
- TanStack Table & Virtual
- Express.js

### Backend

- FastAPI
- Hugging Face API
- Docker

## Development

The repositories from which to operate can be parametrized through environment variables:

```bash
export HF_ORGANIZATION="fr-gouv-coordination-ia"
export REQUESTS_REPO="requests-dev"
export RESULTS_REPO="results-dev"
```

The appropriate token to read and write from these repos should also be set appropriately:

``` bash
export HF_TOKEN="mytoken"
```

The application is containerized using Docker and can be run using:

```bash
docker-compose up
```
