import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask Configuration
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    DEBUG = os.getenv("FLASK_DEBUG", False)
    
    # JWT Configuration
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "jwt-secret-key")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Database Configuration
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/healthcare_db")
    DATABASE_NAME = "healthcare_db"
    
    # AI/LLM Services
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")
    
    # File Upload Configuration
    MAX_UPLOAD_SIZE = 50 * 1024 * 1024  # 50MB
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "../uploads")
    ALLOWED_EXTENSIONS = {"pdf", "jpg", "jpeg", "png", "gif", "tiff"}
    
    # Report Analysis Configuration
    OCR_ENABLED = os.getenv("OCR_ENABLED", True)
    TESSERACT_PATH = os.getenv("TESSERACT_PATH", "")
    
    # Health Score Configuration
    HEALTH_SCORE_WEIGHTS = {
        "heart_risk": 0.25,
        "diabetes_risk": 0.25,
        "kidney_risk": 0.20,
        "bmi": 0.10,
        "blood_pressure": 0.10,
        "age": 0.05,
        "lifestyle": 0.05
    }
    
    # Thresholds for Alerts
    CRITICAL_RISK_THRESHOLD = 0.75
    HIGH_RISK_THRESHOLD = 0.60
    MODERATE_RISK_THRESHOLD = 0.40
    
    # CORS Configuration
    CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
    
    # Email Configuration (for alerts)
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = os.getenv("MAIL_PORT", 587)
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    
    # Analytics Configuration
    ENABLE_ANALYTICS = os.getenv("ENABLE_ANALYTICS", True)
    
    # Cache Configuration
    CACHE_REDIS_URL = os.getenv("CACHE_REDIS_URL", "redis://localhost:6379/0")
    
    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False

class TestingConfig(Config):
    TESTING = True
    MONGO_URI = "mongodb://localhost:27017/healthcare_db_test"

config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
    "default": DevelopmentConfig
}