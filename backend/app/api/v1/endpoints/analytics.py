from fastapi import APIRouter, Depends
from app.api.v1.dependencies import get_current_user

router = APIRouter()

@router.get("/kpis")
async def get_kpis(current_user=Depends(get_current_user)):
    return {
        "mrr": 125000.0,
        "growth": 12.5,
        "churn": 2.1,
        "cac": 120.0
    }
