# SalesPulse AI - AI-powered Sales Analytics Platform

This is the monorepo for SalesPulse AI, an enterprise-grade AI-powered Sales Analytics Platform.

## Architecture & Technology Stack
- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, Apache ECharts, Leaflet
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL, JWT Auth, Pandas, NumPy, scikit-learn
- **Background Jobs**: Celery, Redis
- **Reverse Proxy**: Nginx
- **Containerization**: Docker, Docker Compose
- **Testing**: Pytest (backend), Playwright (frontend)

## Directory Structure
- `backend/`: FastAPI application code and migrations
- `frontend/`: Next.js frontend code and E2E tests
- `docker/`: Shared infrastructure configurations (Nginx, Redis)
- `docs/`: Technical specifications and system architecture documentation
- `.github/`: CI/CD workflows for validation and deployments

## Quick Start (Local Development)
1. Copy environments:
   - `cp backend/.env.example backend/.env`
   - `cp frontend/.env.example frontend/.env.local`
2. Start the local containers:
   - `docker compose up --build`
3. Access the services:
   - Frontend: [http://localhost](http://localhost) (Proxied via Nginx)
   - API Docs: [http://localhost/api/v1/docs](http://localhost/api/v1/docs)
