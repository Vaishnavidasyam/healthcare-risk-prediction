from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
from datetime import datetime
import pandas as pd

from config import Config
from ml.loaders import load_pipeline

prediction_bp = Blueprint("prediction", __name__)

# Shared database instance (will be set in app factory)
db = None
predictions_col = None

# Initialize explainability service (will be set in app factory)
explainability_service = None
health_score_service = None

def set_explainability_service(service):
    """Set explainability service instance from app factory."""
    global explainability_service
    explainability_service = service

def set_health_score_service(service, database=None):
    """Set health score service instance and database."""
    global health_score_service, db, predictions_col
    health_score_service = service
    if database is not None:
        db = database
        predictions_col = db["predictions"]


# =========================
# HELPER: UPDATE HEALTH SCORE
# =========================

def trigger_health_score_update(user_id):
    """Update user's overall health score after a new prediction."""
    if health_score_service is None or db is None:
        print("ERROR: Health services not initialized in prediction routes")
        return

    try:
        from models.health_models import HealthRecord
        from bson import ObjectId

        user_id_obj = ObjectId(user_id) if isinstance(user_id, str) else user_id

        # Get latest predictions for all diseases
        diseases = ["heart", "diabetes", "kidney"]
        latest_probs = {}
        for d in diseases:
            latest = db["predictions"].find_one(
                {"user_id": user_id_obj, "disease": d},
                sort=[("created_at", -1)]
            )
            if latest:
                latest_probs[f"{d}_risk"] = latest.get("probability", 0.5)
            else:
                latest_probs[f"{d}_risk"] = 0.5 # default moderate risk

        # Get latest vital signs/health record
        latest_record_doc = db["health_records"].find_one(
            {"user_id": user_id_obj},
            sort=[("record_date", -1)]
        )
        
        # If no record exists, create one from latest profile or prediction
        if not latest_record_doc:
            health_record = HealthRecord(user_id=user_id)
            latest_any = db["predictions"].find_one({"user_id": user_id_obj}, sort=[("created_at", -1)])
            if latest_any and "input_data" in latest_any:
                inp = latest_any["input_data"]
                health_record.age = inp.get("age") or inp.get("Age")
                health_record.bmi = inp.get("BMI")
                health_record.blood_pressure_systolic = inp.get("trestbps") or inp.get("BloodPressure")
        else:
            health_record = HealthRecord.from_dict(latest_record_doc)

        # Calculate new score
        new_score = health_score_service.calculate_health_score(
            user_id, latest_probs, health_record
        )
        
        # Save to database
        health_score_service.save_health_score(new_score)
        
        # Add timeline event
        db["health_timeline"].insert_one({
            "user_id": user_id_obj,
            "event_type": "Score Change",
            "title": "Health Score Recalculated",
            "description": f"Overall intelligence score updated to {new_score.overall_score}% following latest clinical analysis.",
            "severity": "Info",
            "event_date": datetime.utcnow(),
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        })

    except Exception as e:
        print(f"CRITICAL: Health score update failed for user {user_id}: {e}")



# =========================
# RISK LEVEL HELPER
# =========================

def compute_risk_level(prob: float):
    percentage = prob * 100
    if percentage < 40:
        return "Low"
    elif percentage < 70:
        return "Medium"
    else:
        return "High"


# =========================
# PREDICT DISEASE
# =========================

@prediction_bp.route("/<disease>", methods=["POST"])
@jwt_required()
def predict_disease(disease):
    from bson import ObjectId
    user_id = get_jwt_identity()
    user_id_obj = ObjectId(user_id)
    data = request.get_json()

    if disease not in ["heart", "diabetes", "kidney"]:
        return jsonify({"message": "Invalid disease type"}), 400

    try:
        pipeline = load_pipeline(disease)
    except Exception as e:
        return jsonify({"message": f"Model load error: {e}"}), 500

    try:
        df = pd.DataFrame([data])
        prob = float(pipeline.predict_proba(df)[0][1])
        pred = int(pipeline.predict(df)[0])

        # Get explanation (XAI)
        explanation = {}
        if explainability_service:
            try:
                # Extract the model from the pipeline
                model = pipeline.named_steps['model']
                feature_names = df.columns.tolist()
                explanation = explainability_service.explain_prediction(
                    model=model,
                    features=df,
                    feature_names=feature_names,
                    prediction_value=prob,
                    disease_type=disease
                )
                print(f"Generated Explanation for {disease}: {explanation.keys()}")
            except Exception as e:
                print(f"XAI Error: {e}")

    except Exception as e:
        return jsonify({"message": f"Prediction error: {e}"}), 400

    risk_level = compute_risk_level(prob)
    print(f"DEBUG: Disease={disease}, Prob={prob}, RiskLevel={risk_level}")

    doc = {
        "user_id": user_id_obj,
        "disease": disease,
        "input_data": data,
        "prediction": pred,
        "probability": prob,
        "risk_level": risk_level,
        "explanation": explanation,
        "created_at": datetime.utcnow(),
    }

    predictions_col.insert_one(doc)

    # Trigger health score update
    trigger_health_score_update(user_id)

    print(f"DEBUG: Returning JSON with input_data: {data}")
    return jsonify({
        "prediction": pred,
        "probability": prob,
        "risk_percentage": round(prob * 100, 2),
        "risk_level": risk_level,
        "explanation": explanation,
        "input_data": data
    }), 200


# =========================
# PREDICTION HISTORY
# =========================

@prediction_bp.route("/history", methods=["GET"])
@jwt_required()
def get_prediction_history():
    from bson import ObjectId
    user_id = get_jwt_identity()
    user_id_obj = ObjectId(user_id)

    predictions = list(
        predictions_col.find({
            "user_id": {"$in": [user_id_obj, str(user_id_obj)]}
        }).sort(
            "created_at",
            -1,
        )
    )

    result = []
    for p in predictions:
        result.append({
            "id": str(p["_id"]),
            "disease": p["disease"],
            "risk_level": p["risk_level"],
            "risk_percentage": round(p["probability"] * 100, 2),
            "created_at": p["created_at"],
        })

    return jsonify(result), 200


# =========================
# ANALYTICS
# =========================

@prediction_bp.route("/analytics", methods=["GET"])
@jwt_required()
def analytics():
    from bson import ObjectId
    user_id = get_jwt_identity()
    user_id_obj = ObjectId(user_id)

    predictions = list(
        predictions_col.find({
            "user_id": {"$in": [user_id_obj, str(user_id_obj)]}
        })
    )

    heart = 0
    diabetes = 0
    kidney = 0

    for p in predictions:

        if p["disease"] == "heart":
            heart += 1

        elif p["disease"] == "diabetes":
            diabetes += 1

        elif p["disease"] == "kidney":
            kidney += 1

    return jsonify({

        "heart": heart,

        "diabetes": diabetes,

        "kidney": kidney,

        "total_predictions": len(predictions),

    }), 200
