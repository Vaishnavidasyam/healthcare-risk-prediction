"""
Base Service Class - All services inherit from this
"""

class BaseService:
    """Base service class with common functionality"""
    
    def __init__(self, db):
        self.db = db
    
    def get_collection(self, collection_name):
        """Get a MongoDB collection"""
        return self.db[collection_name]
    
    def log_error(self, error, context=""):
        """Log errors for debugging"""
        print(f"ERROR [{context}]: {str(error)}")
