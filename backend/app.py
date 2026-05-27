import os
import sys
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from admin.routes import admin_bp

BASE_DIR = os.path.dirname(__file__)  # backend/
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from auth.routes import auth_bp
from prediction.routes import prediction_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(prediction_bp, url_prefix="/api")
    app.register_blueprint(admin_bp, url_prefix="/api")

    @app.route("/")
    def index():
        return "Healthcare Risk Prediction API is running."

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)