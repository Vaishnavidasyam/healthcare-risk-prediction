# backend/routes/health_routes.py

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

from services import (
    HealthScoreService,
    RecommendationsService,
)


health_bp = Blueprint("health", __name__)

# Initialize services (will be set in app factory)
health_score_service = None
recommendations_service = None


def set_health_services(score_service, rec_service):
    """Set service instances."""
    global health_score_service, recommendations_service
    health_score_service = score_service
    recommendations_service = rec_service


@health_bp.route("/score/latest", methods=["GET"])
@jwt_required()
def get_latest_health_score():
    """Get latest health score for user."""
    try:
        user_id = get_jwt_identity()

        if not health_score_service:
            return jsonify({"error": "Health score service not initialized"}), 500

        score = health_score_service.get_latest_health_score(user_id)

        if not score:
            return jsonify({"error": "No health score found"}), 404

        # Convert for JSON
        score["_id"] = str(score["_id"])
        score["user_id"] = str(score["user_id"])
        score["score_date"] = score["score_date"].isoformat()
        score["created_at"] = score["created_at"].isoformat()
        score["updated_at"] = score["updated_at"].isoformat()

        return jsonify(score), 200

    except Exception as e:
        if health_score_service:
            health_score_service.log_error(e, "get_latest_health_score")
        return jsonify({"error": str(e)}), 500


@health_bp.route("/score/history", methods=["GET"])
@jwt_required()
def get_health_score_history():
    """Get health score history."""
    try:
        user_id = get_jwt_identity()
        days = request.args.get("days", 30, type=int)

        if not health_score_service:
            return jsonify({"error": "Health score service not initialized"}), 500

        scores = health_score_service.get_health_score_history(user_id, days=days)

        # Convert for JSON
        for score in scores:
            score["_id"] = str(score["_id"])
            score["user_id"] = str(score["user_id"])
            score["score_date"] = score["score_date"].isoformat()
            score["created_at"] = score["created_at"].isoformat()
            score["updated_at"] = score["updated_at"].isoformat()

        return (
            jsonify(
                {
                    "status": "success",
                    "count": len(scores),
                    "period_days": days,
                    "scores": scores,
                }
            ),
            200,
        )

    except Exception as e:
        if health_score_service:
            health_score_service.log_error(e, "get_health_score_history")
        return jsonify({"error": str(e)}), 500


@health_bp.route("/recommendations", methods=["GET"])
@jwt_required()
def get_recommendations():
    """Get personalized recommendations."""
    try:
        user_id = get_jwt_identity()
        status = request.args.get("status", "Active")
        limit = request.args.get("limit", 20, type=int)

        if not recommendations_service:
            return jsonify({"error": "Recommendations service not initialized"}), 500

        recommendations = recommendations_service.get_user_recommendations(
            user_id, status=status, limit=limit
        )

        return (
            jsonify(
                {
                    "status": "success",
                    "count": len(recommendations),
                    "recommendations": recommendations,
                }
            ),
            200,
        )

    except Exception as e:
        if recommendations_service:
            recommendations_service.log_error(e, "get_recommendations")
        return jsonify({"error": str(e)}), 500


@health_bp.route("/recommendations/<rec_id>/update", methods=["PUT"])
@jwt_required()
def update_recommendation(rec_id):
    """Update recommendation status."""
    try:
        user_id = get_jwt_identity()
        data = request.json

        if not recommendations_service:
            return jsonify({"error": "Recommendations service not initialized"}), 500

        status = data.get("status")
        completion_percentage = data.get("completion_percentage")

        if not status:
            return jsonify({"error": "Status required"}), 400

        recommendations_service.update_recommendation_status(
            rec_id, status, completion_percentage
        )

        return (
            jsonify({"status": "success", "message": "Recommendation updated"}),
            200,
        )

    except Exception as e:
        if recommendations_service:
            recommendations_service.log_error(e, "update_recommendation")
        return jsonify({"error": str(e)}), 500


@health_bp.route("/timeline", methods=["GET"])
@jwt_required()
def get_health_timeline():
    """Get health timeline events."""
    try:
        user_id = get_jwt_identity()
        limit = request.args.get("limit", 50, type=int)

        if not health_score_service:
            return jsonify({"error": "Health score service not initialized"}), 500

        collection = health_score_service.get_collection("health_timeline")
        events = list(
            collection.find({"user_id": ObjectId(user_id)})
            .sort("event_date", -1)
            .limit(limit)
        )

        # Convert for JSON
        for event in events:
            event["_id"] = str(event["_id"])
            event["user_id"] = str(event["user_id"])

            if event.get("related_report_id"):
                event["related_report_id"] = str(event["related_report_id"])

            if event.get("related_prediction_id"):
                event["related_prediction_id"] = str(
                    event["related_prediction_id"]
                )

            if event.get("related_health_record_id"):
                event["related_health_record_id"] = str(
                    event["related_health_record_id"]
                )

            if isinstance(event.get("event_date"), datetime):
                event["event_date"] = event["event_date"].isoformat()
            if isinstance(event.get("created_at"), datetime):
                event["created_at"] = event["created_at"].isoformat()
            if isinstance(event.get("updated_at"), datetime):
                event["updated_at"] = event["updated_at"].isoformat()

        return (
            jsonify(
                {
                    "status": "success",
                    "count": len(events),
                    "timeline": events,
                }
            ),
            200,
        )

    except Exception as e:
        if health_score_service:
            health_score_service.log_error(e, "get_health_timeline")
        return jsonify({"error": str(e)}), 500


@health_bp.route("/dashboard-summary", methods=["GET"])
@jwt_required()
def get_dashboard_summary():
    """
    Get comprehensive dashboard summary.
    Includes: health score, recent recommendations, timeline events, counts.
    """
    try:
        user_id = get_jwt_identity()
        user_id_obj = ObjectId(user_id)

        if not health_score_service or not recommendations_service:
            return jsonify({"error": "Health services not initialized"}), 500

        # Get or calculate latest health score
        latest_score = health_score_service.get_or_create_latest_score(user_id)
        if latest_score:
            latest_score["_id"] = str(latest_score["_id"])
            latest_score["user_id"] = str(latest_score["user_id"])
            latest_score["score_date"] = latest_score["score_date"].isoformat()
            if isinstance(latest_score.get("created_at"), datetime):
                latest_score["created_at"] = latest_score["created_at"].isoformat()
            if isinstance(latest_score.get("updated_at"), datetime):
                latest_score["updated_at"] = latest_score["updated_at"].isoformat()

        # Get system counts
        reports_count = health_score_service.get_collection("reports").count_documents(
            {"user_id": user_id_obj}
        )
        predictions_count = health_score_service.get_collection("predictions").count_documents(
            {"user_id": user_id_obj}
        )

        # Get recent active recommendations
        recommendations = recommendations_service.get_user_recommendations(
            user_id, status="Active", limit=5
        )

        # Get recent timeline events
        collection = health_score_service.get_collection("health_timeline")
        events = list(
            collection.find({"user_id": user_id_obj})
            .sort("event_date", -1)
            .limit(10)
        )

        for event in events:
            event["_id"] = str(event["_id"])
            event["user_id"] = str(event["user_id"])
            if isinstance(event.get("event_date"), datetime):
                event["event_date"] = event["event_date"].isoformat()

        return (
            jsonify(
                {
                    "status": "success",
                    "health_score": latest_score,
                    "reports_count": reports_count,
                    "predictions_count": predictions_count,
                    "active_recommendations_count": len(recommendations),
                    "top_recommendations": recommendations[:5],
                    "recent_events_count": len(events),
                    "recent_events": events[:5],
                }
            ),
            200,
        )

    except Exception as e:
        if health_score_service:
            health_score_service.log_error(e, "get_dashboard_summary")
        return jsonify({"error": str(e)}), 500