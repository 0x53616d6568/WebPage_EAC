import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Base configuration"""
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))
    FLASK_DEBUG = os.getenv('FLASK_DEBUG', False)
    
    # Hugging Face Configuration
    HF_API_TOKEN = os.getenv('HF_API_TOKEN', '')
    HF_MODEL_NAME = os.getenv('HF_MODEL_NAME', 'face-detection-model')
    
    # Face Database
    FACE_DB_PATH = os.getenv('FACE_DB_PATH', './face_database/embeddings.db')
    
    # Model Configuration
    CONFIDENCE_THRESHOLD = float(os.getenv('CONFIDENCE_THRESHOLD', 0.65))
    MAX_IMAGE_SIZE_MB = int(os.getenv('MAX_IMAGE_SIZE_MB', 5))
    
    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    
    # Service URLs
    BACKEND_API_URL = os.getenv('BACKEND_API_URL', 'http://localhost:3000/api')

class DevelopmentConfig(Config):
    """Development configuration"""
    FLASK_DEBUG = True
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(Config):
    """Production configuration"""
    FLASK_DEBUG = False
    LOG_LEVEL = 'INFO'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    LOG_LEVEL = 'DEBUG'

# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}
