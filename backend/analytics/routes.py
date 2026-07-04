"""
Analytics API Routes
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
from services.analytics_service import AnalyticsService

analytics_bp = Blueprint('analytics', __name__, url_prefix='/api/analytics')

analytics_service = None

def set_analytics_service(service):
    global analytics_service
    analytics_service = service


@analytics_bp.route('/metrics', methods=['GET'])
def get_metrics():
    """Get platform metrics"""
    try:
        metrics = analytics_service.get_platform_metrics()
        return jsonify({
            'status': 'success',
            'data': metrics
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/disease-distribution', methods=['GET'])
def get_disease_distribution():
    """Get disease distribution"""
    try:
        distribution = analytics_service.get_disease_distribution()
        return jsonify({
            'status': 'success',
            'data': distribution
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/health-score-distribution', methods=['GET'])
def get_health_score_distribution():
    """Get health score distribution"""
    try:
        distribution = analytics_service.get_health_score_distribution()
        return jsonify({
            'status': 'success',
            'data': distribution
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/prediction-trends', methods=['GET'])
def get_prediction_trends():
    """Get prediction trends"""
    try:
        days = request.args.get('days', 30, type=int)
        trends = analytics_service.get_prediction_trends(days)
        return jsonify({
            'status': 'success',
            'data': trends
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/top-risk-patients', methods=['GET'])
def get_top_risk_patients():
    """Get high-risk patients"""
    try:
        limit = request.args.get('limit', 10, type=int)
        patients = analytics_service.get_top_risk_patients(limit)
        return jsonify({
            'status': 'success',
            'data': patients
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/report-analytics', methods=['GET'])
def get_report_analytics():
    """Get report analytics"""
    try:
        analytics = analytics_service.get_report_analytics()
        return jsonify({
            'status': 'success',
            'data': analytics
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analytics_bp.route('/user', methods=['GET'])
@jwt_required()
def get_user_analytics():
    """Get user-specific analytics"""
    try:
        user_id = get_jwt_identity()
        analytics = analytics_service.get_user_analytics(user_id)
        
        # Convert ObjectIds and datetimes for JSON
        for p in analytics.get('prediction_history', []):
            p['_id'] = str(p['_id'])
            p['user_id'] = str(p['user_id'])
            if isinstance(p.get('created_at'), datetime):
                p['created_at'] = p['created_at'].isoformat()
        
        for s in analytics.get('score_history', []):
            s['_id'] = str(s['_id'])
            s['user_id'] = str(s['user_id'])
            if isinstance(s.get('score_date'), datetime):
                s['score_date'] = s['score_date'].isoformat()
        
        for m in analytics.get('metabolic_data', []):
            if isinstance(m.get('date'), datetime):
                m['date'] = m['date'].isoformat()

        return jsonify({
            'status': 'success',
            'data': analytics
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
