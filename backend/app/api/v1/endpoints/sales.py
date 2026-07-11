from fastapi import APIRouter, UploadFile, Depends
from app.api.v1.dependencies import get_current_user

router = APIRouter()

@router.post("/upload")
async def upload_sales_file(file: UploadFile, current_user=Depends(get_current_user)):
    return {"filename": file.filename, "status": "processing", "taskId": "celery-task-id-mock"}
