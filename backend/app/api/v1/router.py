from fastapi import APIRouter
from app.api.v1.endpoints import auth, sales, analytics

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Auth"])
api_router.include_router(sales.router, prefix="/sales", tags=["Sales"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["Analytics"])
