import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_pymongo import PyMongo
from config import Config, config
from datetime import datetime
from werkzeug.security import generate_password_hash

BASE_DIR = os.path.dirname(__file__)  # backend/
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from auth.routes import auth_bp
from prediction.routes import prediction_bp, set_explainability_service, set_health_score_service
from admin.routes import admin_bp
from reports.routes import reports_bp, set_report_service
from copilot.routes import copilot_bp, set_copilot_service
from health.routes import health_bp, set_health_services
from analytics.routes import analytics_bp, set_analytics_service
from premium.routes import premium_bp, set_premium_services

from services import (
    HealthScoreService,
    ReportAnalysisService,
    ExplainabilityService,
    HealthcareCopilotService,
    RecommendationsService,
    EnhancedReportAnalysisService,
    AnalyticsService,
    PDFReportGeneratorService,
    DietPlannerService,
    DoctorRecommendationService
)

def create_app(config_name='development'):
    """Application Factory"""
    
    # Create Flask app
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config.get(config_name, Config))
    
    # Initialize extensions
    JWTManager(app)
    mongo = PyMongo(app)
    
    # Global CORS headers - handle preflight and all requests
    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,X-Requested-With'
        response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS,PATCH'
        response.headers['Access-Control-Max-Age'] = '86400'
        return response

    @app.before_request
    def handle_preflight():
        from flask import request, make_response
        if request.method == 'OPTIONS':
            response = make_response()
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Headers'] = 'Content-Type,Authorization,X-Requested-With'
            response.headers['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,OPTIONS,PATCH'
            response.headers['Access-Control-Max-Age'] = '86400'
            return response, 200
            
    @app.errorhandler(422)
    def unprocessable_entity(error):
        return jsonify({
            'error': 'Unprocessable Entity', 
            'message': 'The request was well-formed but was unable to be followed due to semantic errors (often JWT malformed)',
            'details': str(error)
        }), 422
    
    # Initialize services with database connection
    db = mongo.db
    
    # Initialize all services
    health_score_service = HealthScoreService(db)
    report_analysis_service = ReportAnalysisService(db)
    explainability_service = ExplainabilityService(db)
    copilot_service = HealthcareCopilotService(db)
    recommendations_service = RecommendationsService(db)
    enhanced_report_service = EnhancedReportAnalysisService(db)
    analytics_service = AnalyticsService(db)
    pdf_generator = PDFReportGeneratorService(db)
    diet_planner = DietPlannerService(db)
    doctor_recommender = DoctorRecommendationService(db)
    
    # Pass services to route modules
    set_report_service(enhanced_report_service)
    set_copilot_service(copilot_service)
    set_explainability_service(explainability_service)
    set_health_score_service(health_score_service, db)
    set_health_services(health_score_service, recommendations_service)
    set_analytics_service(analytics_service)
    set_premium_services(pdf_generator, diet_planner, doctor_recommender)
    
    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(prediction_bp, url_prefix="/api/predictions")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")
    app.register_blueprint(copilot_bp, url_prefix="/api/copilot")
    app.register_blueprint(health_bp, url_prefix="/api/health")
    app.register_blueprint(analytics_bp)  # url_prefix already in blueprint
    app.register_blueprint(premium_bp)    # url_prefix already in blueprint
    
    # System health check endpoint
    @app.route("/api/status/health", methods=["GET"])
    def health_check():
        return jsonify({
            'status': 'healthy',
            'version': '2.4.0',
            'name': 'SmartMed Analytics - Enterprise AI Healthcare Platform',
            'phase': 'Phase 4 (Complete)',
            'timestamp': __import__('datetime').datetime.utcnow().isoformat()
        }), 200
    
    @app.route("/", methods=["GET"])
    def index():
        return jsonify({
            'message': 'SmartMed Analytics API',
            'version': '2.4.0',
            'phase': 'Phase 4 - Complete Enterprise Platform',
            'endpoints': {
                'auth': '/api/auth',
                'predictions': '/api/predictions',
                'reports': '/api/reports',
                'copilot': '/api/copilot',
                'health': '/api/health',
                'analytics': '/api/analytics',
                'premium': '/api/premium',
                'admin': '/api/admin'
            },
            'features': {
                'Phase1': ['Authentication', 'Predictions', 'Health Scores', 'Basic Reports'],
                'Phase2': ['AI Report Analysis', 'Copilot Chat', 'Explainability', 'Recommendations'],
                'Phase3': ['Platform Analytics', 'Health Timeline', 'Emergency Alerts'],
                'Phase4': ['PDF Reports', 'Diet Planning', 'Doctor Recommendations', 'Voice Assistant']
            }
        }), 200
    
    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        return jsonify({'error': 'Bad request', 'message': str(error)}), 400
    
    @app.errorhandler(401)
    def unauthorized(error):
        return jsonify({'error': 'Unauthorized', 'message': 'Invalid or missing authentication'}), 401
    
    @app.errorhandler(403)
    def forbidden(error):
        return jsonify({'error': 'Forbidden', 'message': 'Access denied'}), 403
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Not found', 'message': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error', 'message': str(error)}), 500
    
    # Seed default users on first successful MongoDB request
    @app.before_request
    def seed_on_first_request():
        if not getattr(app, '_sm_seeded', False):
            app._sm_seeded = True
            try:
                mongo_db = mongo.db
                if mongo_db is not None:
                    users_col = mongo_db["users"]
                    if users_col.count_documents({}) == 0:
                        print("Seeding default users...")
                        default_users = [
                            {"email": "admin@smartmed.ai", "password": "admin123", "role": "admin", "name": "Admin"},
                            {"email": "doctor@smartmed.ai", "password": "doctor123", "role": "doctor", "name": "Dr. Default"},
                            {"email": "patient@smartmed.ai", "password": "patient123", "role": "patient", "name": "Patient"},
                        ]
                        for u in default_users:
                            if not users_col.find_one({"email": u["email"]}):
                                users_col.insert_one({
                                    "email": u["email"],
                                    "password_hash": generate_password_hash(u["password"]),
                                    "role": u["role"],
                                    "name": u["name"],
                                    "created_at": datetime.utcnow(),
                                })
                        print(f"Seeded {users_col.count_documents({})} users")
                    else:
                        print("Users already exist, skipping seed")
            except Exception as e:
                print(f"WARNING: Seed failed on first request: {e}")

    # Train models if missing (runs once at import time)
    models_dir = os.path.join(PROJECT_ROOT, "models")
    os.makedirs(models_dir, exist_ok=True)
    all_present = True
    for model_name in ["heart_pipeline.pkl", "diabetes_pipeline.pkl", "kidney_pipeline.pkl"]:
        if not os.path.exists(os.path.join(models_dir, model_name)):
            all_present = False
            break
    if not all_present:
        print("ML models missing, training on startup...")
        try:
            from ml.train_models import load_dataset, train_model
            dataset_config = [
                (os.path.join(PROJECT_ROOT, "datasets", "heart.csv"), "target", "heart"),
                (os.path.join(PROJECT_ROOT, "datasets", "diabetes.csv"), "Outcome", "diabetes"),
                (os.path.join(PROJECT_ROOT, "datasets", "kidney_disease.csv"), "classification", "kidney"),
            ]
            for path, target, name in dataset_config:
                if os.path.exists(path):
                    print(f"Training {name} model...")
                    X, y, features = load_dataset(path, target)
                    train_model(X, y, name, features)
                else:
                    print(f"Dataset not found: {path}")
            print("Model training complete")
        except Exception as e:
            print(f"Error training models: {e}")
    else:
        print("All ML models present")

    return app

# Add this line so Gunicorn can find the app!
app = create_app(os.getenv('FLASK_ENV', 'production'))

if __name__ == "__main__":
    # On Python 3.14+ (experimental), use_reloader=False prevents socket errors
    app.run(debug=True, threaded=True, use_reloader=False)
