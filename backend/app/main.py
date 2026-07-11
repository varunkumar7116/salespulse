from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.api.middleware.request_logger import RequestLoggerMiddleware

app = FastAPI(
    title="SalesPulse AI API",
    description="Enterprise-grade AI Sales Analytics Platform backend services.",
    version="1.0.0",
    docs_url="/v1/docs",
    redoc_url="/v1/redoc",
    openapi_url="/v1/openapi.json",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RequestLoggerMiddleware)

# Router
app.include_router(api_router, prefix="/v1")

@app.get("/healthz", tags=["Health"])
async def health_check():
    return {"status": "healthy", "service": "SalesPulse AI API"}
