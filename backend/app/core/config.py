from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import AnyHttpUrl

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    API_V1_STR: str = "/v1"
    SECRET_KEY: str = "supersecretkeyneedsreplacementinprod"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # DB Connections
    DATABASE_URL: str = "postgresql://postgres:supersecretpassword@db:5432/salespulse_db"
    
    # Redis & Workers
    REDIS_URL: str = "redis://:strongredispassword@redis:6379/0"
    
    # CORS
    CORS_ORIGINS: List[str] = ["*"]

settings = Settings()
