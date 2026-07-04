from datetime import datetime
from bson import ObjectId

class BaseModel:
    """Base model class for all database models"""
    
    def __init__(self, **kwargs):
        self._id = kwargs.get('_id', ObjectId())
        self.created_at = kwargs.get('created_at', datetime.utcnow())
        self.updated_at = kwargs.get('updated_at', datetime.utcnow())
    
    def to_dict(self):
        """Convert model to dictionary"""
        raise NotImplementedError
    
    @classmethod
    def from_dict(cls, data):
        """Create model from dictionary"""
        raise NotImplementedError
    
    def save(self, db):
        """Save model to database"""
        raise NotImplementedError
    
    @classmethod
    def find_by_id(cls, db, id):
        """Find model by ID"""
        raise NotImplementedError
