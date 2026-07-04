# backend/routes/medical_report_routes.py
# or backend/reports/routes.py — choose one path and keep it consistent

from datetime import datetime
import json
import os
import sys

from bson import ObjectId
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename

from config import Config

# Ensure project root is in sys.path
BASE_DIR = os.path.dirname(__file__)
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Import service AFTER sys.path update
from services import ReportAnalysisService  # adjust to your actual path if needed


reports_bp = Blueprint("reports", __name__)

# This will be assigned in your app factory
report_service = None


def set_report_service(service):
    """
    Set report service instance from app factory.
    Example in app.py:
        from services.report_analysis_service import ReportAnalysisService
        report_service_instance = ReportAnalysisService(db)
        set_report_service(report_service_instance)
    """
    global report_service
    report_service = service


@reports_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_report():
    """Upload and analyze medical report (PDF / image / etc.)."""
    try:
        user_id = get_jwt_identity()

        if not report_service:
            return jsonify({"error": "Report analysis service not initialized"}), 500

        # Check if file is present
        if "file" not in request.files:
            return jsonify({"error": "No file provided"}), 400

        file = request.files["file"]
        report_type = request.form.get("report_type", "Other")

        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # Validate file type
        allowed_extensions = getattr(Config, "ALLOWED_EXTENSIONS", {"pdf", "png", "jpg", "jpeg"})
        if not ("." in file.filename and file.filename.rsplit(".", 1)[1].lower() in allowed_extensions):
            return (
                jsonify(
                    {
                        "error": f"File type not allowed. Allowed: {', '.join(sorted(allowed_extensions))}"
                    }
                ),
                400,
            )

        # Create upload folder if doesn't exist
        upload_folder = getattr(Config, "UPLOAD_FOLDER", "uploads/reports")
        os.makedirs(upload_folder, exist_ok=True)

        # Save file with user and timestamp for uniqueness
        safe_original = secure_filename(file.filename)
        filename = secure_filename(f"{user_id}_{datetime.utcnow().timestamp()}_{safe_original}")
        file_path = os.path.join(upload_folder, filename)
        file.save(file_path)

        # Get file type (extension)
        file_type = file.filename.rsplit(".", 1)[1].lower()

        # Analyze report
        try:
            analysis_result = report_service.analyze_report(
                file_path,
                file_type,
                report_type,
            )

            # Persist report + analysis in DB via service
            report_id = report_service.save_report(
                user_id=user_id,
                file_path=file_path,
                original_filename=file.filename,
                file_type=file_type,
                analysis_result=analysis_result,
                report_type=report_type,
            )

            return (
                jsonify(
                    {
                        "status": "success",
                        "message": "Report uploaded and analyzed successfully",
                        "report_id": report_id,
                        "analysis": {
                            "parameters_found": len(analysis_result.get("parameters", {})),
                            "abnormal_values": analysis_result.get("abnormal_values", []),
                            "detected_conditions": analysis_result.get("detected_conditions", []),
                        },
                    }
                ),
                201,
            )

        except Exception as e:
            # Delete file if analysis failed
            if os.path.exists(file_path):
                os.remove(file_path)
            raise

    except Exception as e:
        # Log in BaseService logger from report_service if available
        if report_service:
            report_service.log_error(e, "upload_report")
        return jsonify({"error": str(e)}), 500


@reports_bp.route("/<report_id>", methods=["GET"])
@jwt_required()
def get_report(report_id):
    """Get full report details by ID for the current user."""
    try:
        user_id = get_jwt_identity()

        if not report_service:
            return jsonify({"error": "Report analysis service not initialized"}), 500

        # Get from database
        report = report_service.db["medical_reports"].find_one(
            {
                "_id": ObjectId(report_id),
                "user_id": ObjectId(user_id),
            }
        )

        if not report:
            return jsonify({"error": "Report not found"}), 404

        # Convert ObjectIds and datetimes for JSON
        report["_id"] = str(report["_id"])
        report["user_id"] = str(report["user_id"])

        if "report_date" in report and isinstance(report["report_date"], datetime):
            report["report_date"] = report["report_date"].isoformat()

        if "analyzed_at" in report and isinstance(report.get("analyzed_at"), datetime):
            report["analyzed_at"] = report["analyzed_at"].isoformat()

        if "created_at" in report and isinstance(report["created_at"], datetime):
            report["created_at"] = report["created_at"].isoformat()

        if "updated_at" in report and isinstance(report["updated_at"], datetime):
            report["updated_at"] = report["updated_at"].isoformat()

        return jsonify(report), 200

    except Exception as e:
        if report_service:
            report_service.log_error(e, "get_report")
        return jsonify({"error": str(e)}), 500


@reports_bp.route("/history", methods=["GET"])
@jwt_required()
def get_reports_history():
    """Compatibility endpoint for frontend: GET /api/reports/history.

    Frontend expects `api.get('/reports/history')` to return an array as `res.data`.
    """
    try:
        user_id = get_jwt_identity()
        limit = request.args.get("limit", 50, type=int)

        if not report_service:
            return jsonify({"error": "Report analysis service not initialized"}), 500

        # Prefer service helper if it exists
        if hasattr(report_service, "get_user_reports"):
            reports = report_service.get_user_reports(user_id, limit=limit)
        else:
            reports = []

        return jsonify(reports), 200

    except Exception as e:
        if report_service:
            report_service.log_error(e, "get_reports_history")
        return jsonify({"error": str(e)}), 500


@reports_bp.route("/user-reports", methods=["GET"])
@jwt_required()
def get_user_reports():
    """Get all reports for logged-in user (with optional limit)."""
    try:
        user_id = get_jwt_identity()
        limit = request.args.get("limit", 20, type=int)

        if not report_service:
            return jsonify({"error": "Report analysis service not initialized"}), 500

        reports = report_service.get_user_reports(user_id, limit=limit)

        return (
            jsonify(
                {
                    "status": "success",
                    "count": len(reports),
                    "reports": reports,
                }
            ),
            200,
        )

    except Exception as e:
        if report_service:
            report_service.log_error(e, "get_user_reports")
        return jsonify({"error": str(e)}), 500



@reports_bp.route("/<report_id>/delete", methods=["DELETE"])
@jwt_required()
def delete_report(report_id):
    """Delete a report for the current user."""
    try:
        user_id = get_jwt_identity()

        if not report_service:
            return jsonify({"error": "Report analysis service not initialized"}), 500

        # Verify ownership and delete
        result = report_service.db["medical_reports"].delete_one(
            {
                "_id": ObjectId(report_id),
                "user_id": ObjectId(user_id),
            }
        )

        if result.deleted_count == 0:
            return jsonify({"error": "Report not found"}), 404

        return jsonify({"status": "success", "message": "Report deleted"}), 200

    except Exception as e:
        if report_service:
            report_service.log_error(e, "delete_report")
        return jsonify({"error": str(e)}), 500


@reports_bp.route("/<report_id>/generate-summary", methods=["POST"])
@jwt_required()
def generate_report_summary(report_id):
    """Regenerate AI summary for a report."""
    try:
        user_id = get_jwt_identity()

        if not report_service:
            return jsonify({"error": "Report analysis service not initialized"}), 500

        # Verify ownership
        report = report_service.db["medical_reports"].find_one(
            {
                "_id": ObjectId(report_id),
                "user_id": ObjectId(user_id),
            }
        )
        if not report:
            return jsonify({"error": "Report not found"}), 404

        new_summary = report_service.regenerate_report_summary(report_id)

        return jsonify({"status": "success", "message": "Summary generated", "summary": new_summary}), 200

    except Exception as e:
        if report_service:
            report_service.log_error(e, "generate_report_summary")
        return jsonify({"error": str(e)}), 500

