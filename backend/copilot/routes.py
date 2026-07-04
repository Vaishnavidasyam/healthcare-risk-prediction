# backend/routes/copilot_routes.py

from datetime import datetime
import os
import sys

from bson import ObjectId
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

# Ensure project root is in sys.path
BASE_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from services import HealthcareCopilotService  # adjust import path if needed


copilot_bp = Blueprint("copilot", __name__)

# Initialize service (will be set in app factory)
copilot_service = None


def set_copilot_service(service):
    """Set copilot service instance from app factory."""
    global copilot_service
    copilot_service = service


@copilot_bp.route("/chat/new", methods=["POST"])
@jwt_required()
def start_new_chat():
    """Start a new chat session."""
    try:
        user_id = get_jwt_identity()

        if not copilot_service:
            return jsonify({"error": "Copilot service not initialized"}), 500

        session_id = copilot_service.start_chat_session(user_id)

        return (
            jsonify(
                {
                    "status": "success",
                    "session_id": session_id,
                    "message": "Chat session started. What would you like to know about your health?",
                }
            ),
            201,
        )

    except Exception as e:
        if copilot_service:
            copilot_service.log_error(e, "start_new_chat")
        return jsonify({"error": str(e)}), 500


@copilot_bp.route("/chat/<session_id>/message", methods=["POST"])
@jwt_required()
def send_message(session_id):
    """Send message to copilot."""
    try:
        user_id = get_jwt_identity()
        data = request.json

        if not copilot_service:
            return jsonify({"error": "Copilot service not initialized"}), 500

        if not data or "message" not in data:
            return jsonify({"error": "Message required"}), 400

        user_message = data["message"]

        # Optional: Include user health context
        user_health_context = data.get("health_context")

        # Send message and get response
        response = copilot_service.send_message(
            session_id, user_message, user_health_context
        )

        return jsonify(response), 200

    except Exception as e:
        if copilot_service:
            copilot_service.log_error(e, "send_message_route")
        return jsonify({"error": str(e)}), 500


@copilot_bp.route("/chat/<session_id>/history", methods=["GET"])
@jwt_required()
def get_chat_history(session_id):
    """Get chat history for a session."""
    try:
        user_id = get_jwt_identity()
        limit = request.args.get("limit", 50, type=int)

        if not copilot_service:
            return jsonify({"error": "Copilot service not initialized"}), 500

        messages = copilot_service.get_chat_history(session_id, limit=limit)

        return (
            jsonify(
                {
                    "status": "success",
                    "session_id": session_id,
                    "message_count": len(messages),
                    "messages": messages,
                }
            ),
            200,
        )

    except Exception as e:
        if copilot_service:
            copilot_service.log_error(e, "get_chat_history_route")
        return jsonify({"error": str(e)}), 500


@copilot_bp.route("/chat/sessions", methods=["GET"])
@jwt_required()
def get_user_sessions():
    """Get all chat sessions for current user."""
    try:
        user_id = get_jwt_identity()
        limit = request.args.get("limit", 10, type=int)

        if not copilot_service:
            return jsonify({"error": "Copilot service not initialized"}), 500

        sessions = copilot_service.get_user_chat_sessions(user_id, limit=limit)

        return (
            jsonify(
                {
                    "status": "success",
                    "count": len(sessions),
                    "sessions": sessions,
                }
            ),
            200,
        )

    except Exception as e:
        if copilot_service:
            copilot_service.log_error(e, "get_user_sessions")
        return jsonify({"error": str(e)}), 500


@copilot_bp.route("/chat/<session_id>/end", methods=["POST"])
@jwt_required()
def end_chat_session(session_id):
    """End a chat session."""
    try:
        user_id = get_jwt_identity()

        if not copilot_service:
            return jsonify({"error": "Copilot service not initialized"}), 500

        copilot_service.end_chat_session(session_id)

        return (
            jsonify(
                {"status": "success", "message": "Chat session ended"}
            ),
            200,
        )

    except Exception as e:
        if copilot_service:
            copilot_service.log_error(e, "end_chat_session_route")
        return jsonify({"error": str(e)}), 500


@copilot_bp.route("/chat/<session_id>", methods=["DELETE"])
@jwt_required()
def delete_chat_session(session_id):
    """Delete a chat session."""
    try:
        user_id = get_jwt_identity()

        if not copilot_service:
            return jsonify({"error": "Copilot service not initialized"}), 500

        success = copilot_service.delete_chat_session(session_id, user_id)

        if success:
            return jsonify({"status": "success", "message": "Chat session deleted"}), 200
        else:
            return jsonify({"error": "Session not found or unauthorized"}), 404

    except Exception as e:
        if copilot_service:
            copilot_service.log_error(e, "delete_chat_session_route")
        return jsonify({"error": str(e)}), 500


@copilot_bp.route("/explain-prediction", methods=["POST"])
@jwt_required()
def explain_prediction():
    """
    Ask the copilot to explain a specific disease prediction.
    This creates a new short chat session and returns the explanation.
    """
    try:
        user_id = get_jwt_identity()
        data = request.json

        if not copilot_service:
            return jsonify({"error": "Copilot service not initialized"}), 500

        if not data or "prediction_type" not in data:
            return jsonify({"error": "Prediction type required"}), 400

        prediction_type = data["prediction_type"]  # 'heart', 'diabetes', 'kidney'
        risk_score = float(data.get("risk_score", 0.5))

        message = (
            f"Please explain my {prediction_type} disease risk which is at "
            f"{risk_score * 100:.1f}%."
        )

        # Optionally include structured context
        user_health_context = data.get("health_context")

        # Create new session for this explanation
        session_id = copilot_service.start_chat_session(user_id)

        response = copilot_service.send_message(
            session_id, message, user_health_context
        )

        return (
            jsonify(
                {
                    "status": "success",
                    "session_id": session_id,
                    "explanation": response.get("message"),
                }
            ),
            200,
        )

    except Exception as e:
        if copilot_service:
            copilot_service.log_error(e, "explain_prediction")
        return jsonify({"error": str(e)}), 500