from fastapi import APIRouter, Depends, HTTPException, status
from app.core.security import create_access_token, create_refresh_token
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter()

@router.post("/token", response_model=TokenResponse)
async def login(payload: LoginRequest):
    if payload.username == "admin" and payload.password == "admin123":
        access = create_access_token(payload.username)
        refresh = create_refresh_token(payload.username)
        return {"access_token": access, "refresh_token": refresh, "token_type": "bearer"}
    raise HTTPException(status_code=400, detail="Invalid username or password")
