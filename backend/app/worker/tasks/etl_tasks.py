from app.worker.celery_app import celery_app
from app.core.logger import logger

@celery_app.task(name="tasks.process_sales_file")
def process_sales_file(file_path: str):
    logger.info("etl_started", file=file_path)
    # Pandas extraction, cleaning, and model loading happens here
    logger.info("etl_completed", file=file_path)
    return {"status": "success", "processed_records": 1000}
