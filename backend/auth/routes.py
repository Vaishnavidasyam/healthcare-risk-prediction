from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
from datetime import datetime
from config import Config

auth_bp = Blueprint("auth", __name__)

client = MongoClient(Config.MONGO_URI)
db = client["healthcare_db"]
users_col = db["users"]

def user_to_dict(user_doc):
    return {
        "id": str(user_doc.get("_id")),
        "email": user_doc.get("email"),
        "role": user_doc.get("role", "patient"),
        "created_at": user_doc.get("created_at").isoformat()
        if user_doc.get("created_at")
        else None,
    }

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "patient")

    if not email or not password:
        return jsonify({"message": "Email and password required"}), 400

    existing = users_col.find_one({"email": email})
    if existing:
        return jsonify({"message": "User already exists"}), 400

    password_hash = generate_password_hash(password)
    user_doc = {
        "email": email,
        "password_hash": password_hash,
        "role": role,
        "created_at": datetime.utcnow(),
    }
    users_col.insert_one(user_doc)

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    user = users_col.find_one({"email": email})
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"message": "Invalid credentials"}), 401

    # identity MUST be a string (user id)
    user_id = str(user["_id"])
    access_token = create_access_token(identity=user_id)

    # Send user info separately for frontend
    return jsonify({"access_token": access_token, "user": user_to_dict(user)}), 200