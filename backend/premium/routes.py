"""
Premium Features API Routes - Phase 4
"""

from flask import Blueprint, request, jsonify, send_file
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime
import io

premium_bp = Blueprint('premium', __name__, url_prefix='/api/premium')

pdf_service = None
diet_service = None
doctor_service = None

def set_premium_services(pdf_gen, diet_planner, doctor_rec):
    global pdf_service, diet_service, doctor_service
    pdf_service = pdf_gen
    diet_service = diet_planner
    doctor_service = doctor_rec


# ===== PDF Report Generation =====

@premium_bp.route('/report/generate', methods=['POST'])
@jwt_required()
def generate_health_report():
    """Generate comprehensive PDF health report"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        health_score = data.get('health_score', {})
        predictions = data.get('predictions', {})
        recommendations = data.get('recommendations', [])
        
        pdf_bytes = pdf_service.generate_health_report(
            user_id,
            health_score,
            predictions,
            recommendations
        )
        
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=f'health_report_{datetime.now().strftime("%Y%m%d")}.pdf'
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ===== Diet Planning =====

@premium_bp.route('/diet/plan', methods=['POST'])
@jwt_required()
def generate_diet_plan():
    """Generate personalized diet plan"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        disease_type = data.get('disease_type', 'heart')
        risk_level = data.get('risk_level', 'Low')
        preferences = data.get('preferences', None)
        
        meal_plan = diet_service.generate_weekly_meal_plan(
            disease_type,
            risk_level,
            preferences
        )
        
        # Save to database
        diet_coll = diet_service.get_collection('diet_plans')
        meal_plan['user_id'] = ObjectId(user_id)
        meal_plan['created_at'] = datetime.utcnow()
        result = diet_coll.insert_one(meal_plan)
        
        return jsonify({
            'status': 'success',
            'data': {
                'plan_id': str(result.inserted_id),
                'plan': meal_plan
            }
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@premium_bp.route('/diet/plans', methods=['GET'])
@jwt_required()
def get_diet_plans():
    """Get user's diet plans"""
    try:
        user_id = get_jwt_identity()
        diet_coll = diet_service.get_collection('diet_plans')
        
        plans = list(diet_coll.find(
            {'user_id': ObjectId(user_id)}
        ).sort('created_at', -1).limit(10))
        
        for plan in plans:
            plan['_id'] = str(plan['_id'])
            plan['user_id'] = str(plan['user_id'])
        
        return jsonify({
            'status': 'success',
            'data': plans
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ===== Doctor Recommendations =====

@premium_bp.route('/doctors/recommendations', methods=['POST'])
@jwt_required()
def get_doctor_recommendations():
    """Get specialist recommendations"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        conditions = data.get('conditions', [])
        health_score = data.get('health_score', 75)
        
        recommendations = doctor_service.get_specialist_recommendations(
            conditions,
            health_score
        )
        
        return jsonify({
            'status': 'success',
            'data': recommendations
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@premium_bp.route('/doctors/appointment', methods=['POST'])
@jwt_required()
def book_appointment():
    """Book specialist appointment"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        specialist = data.get('specialist')
        appointment_date = datetime.fromisoformat(data.get('appointment_date'))
        notes = data.get('notes')
        
        appointment_id = doctor_service.save_specialist_appointment(
            user_id,
            specialist,
            appointment_date,
            notes
        )
        
        return jsonify({
            'status': 'success',
            'appointment_id': appointment_id,
            'message': 'Appointment scheduled successfully'
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@premium_bp.route('/doctors/appointments', methods=['GET'])
@jwt_required()
def get_appointments():
    """Get user's specialist appointments"""
    try:
        user_id = get_jwt_identity()
        appt_coll = doctor_service.get_collection('specialist_appointments')
        
        appointments = list(appt_coll.find(
            {'user_id': ObjectId(user_id)}
        ).sort('appointment_date', 1))
        
        for appt in appointments:
            appt['_id'] = str(appt['_id'])
            appt['user_id'] = str(appt['user_id'])
        
        return jsonify({
            'status': 'success',
            'data': appointments
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ===== Emergency Alert System =====

@premium_bp.route('/alerts/critical', methods=['GET'])
@jwt_required()
def get_critical_alerts():
    """Get critical health alerts"""
    try:
        user_id = get_jwt_identity()
        scores_coll = doctor_service.get_collection('health_scores')
        
        # Get latest health score
        latest_score = scores_coll.find_one(
            {'user_id': ObjectId(user_id)},
            sort=[('created_at', -1)]
        )
        
        alerts = []
        if latest_score:
            score = latest_score.get('overall_score', 100)
            if score < 50:
                alerts.append({
                    'level': 'CRITICAL',
                    'message': 'Your health score is critically low. Seek immediate medical attention.',
                    'score': score
                })
            elif score < 60:
                alerts.append({
                    'level': 'HIGH',
                    'message': 'Your health score indicates high risk. Consult a healthcare provider.',
                    'score': score
                })
        
        return jsonify({
            'status': 'success',
            'data': alerts
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ===== Voice Assistant (Placeholder) =====

@premium_bp.route('/voice/transcribe', methods=['POST'])
@jwt_required()
def transcribe_voice():
    """Transcribe voice input (placeholder for Phase 4)"""
    try:
        if 'audio' not in request.files:
            return jsonify({'error': 'No audio file provided'}), 400
        
        # TODO: Implement voice transcription with OpenAI Whisper API
        return jsonify({
            'status': 'success',
            'message': 'Voice transcription feature coming soon',
            'text': ''
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


import io
