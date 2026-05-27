# backend/admin/routes.py (new file)
from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
from config import Config

admin_bp = Blueprint("admin", __name__)

client = MongoClient(Config.MONGO_URI)
db = client["healthcare_db"]
users_col = db["users"]            # adjust to your actual users collection name
predictions_col = db["predictions"]

def is_admin(user):
  # Adjust this based on how you store user roles
  return user.get("role") == "admin"

@admin_bp.route("/admin/stats", methods=["GET"])
@jwt_required()
def get_admin_stats():
    user_id = get_jwt_identity()

    # TODO: fetch user info from DB if you need to check admin role
    # user_doc = users_col.find_one({"_id": ObjectId(user_id)})
    # if not user_doc or not is_admin(user_doc):
    #     return jsonify({"message": "Admin access only"}), 403

    total_users = users_col.count_documents({})
    total_predictions = predictions_col.count_documents({})

    heart_predictions = predictions_col.count_documents({"disease": "heart"})
    diabetes_predictions = predictions_col.count_documents({"disease": "diabetes"})
    kidney_predictions = predictions_col.count_documents({"disease": "kidney"})

    recent = list(
        predictions_col.find()
        .sort("created_at", -1)
        .limit(10)
    )

    recent_list = []
    for doc in recent:
        recent_list.append(
            {
                "id": str(doc.get("_id")),
                "user_id": doc.get("user_id"),
                "disease": doc.get("disease"),
                "risk_level": doc.get("risk_level"),
                "risk_percentage": round(float(doc.get("probability", 0) * 100), 2),
                "created_at": doc.get("created_at").isoformat() if doc.get("created_at") else None,
            }
        )

    return jsonify(
        {
            "total_users": total_users,
            "total_predictions": total_predictions,
            "heart_predictions": heart_predictions,
            "diabetes_predictions": diabetes_predictions,
            "kidney_predictions": kidney_predictions,
            "recent_predictions": recent_list,
        }
    ), 200