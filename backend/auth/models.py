from datetime import datetime
from bson import ObjectId

def user_to_dict(user_doc):
    return {
        "id": str(user_doc.get("_id")),
        "email": user_doc.get("email"),
        "role": user_doc.get("role", "patient"),
        "created_at": user_doc.get("created_at").isoformat() if user_doc.get("created_at") else None,
    }