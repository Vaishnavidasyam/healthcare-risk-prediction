from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pymongo import MongoClient
from datetime import datetime
import pandas as pd

from config import Config
from ml.loaders import load_pipeline

prediction_bp = Blueprint("prediction", __name__)

client = MongoClient(Config.MONGO_URI)

db = client["healthcare_db"]

predictions_col = db["predictions"]


# =========================
# RISK LEVEL HELPER
# =========================

def compute_risk_level(prob: float):

    percentage = prob * 100

    # =====================================
    # LOW RISK
    # =====================================

    if percentage < 40:
        return "Low"

    # =====================================
    # MEDIUM RISK
    # =====================================

    elif percentage < 70:
        return "Medium"

    # =====================================
    # HIGH RISK
    # =====================================

    else:
        return "High"


# =========================
# PREDICT DISEASE
# =========================

@prediction_bp.route("/predict/<disease>", methods=["POST"])
@jwt_required()
def predict_disease(disease):

    user_id = get_jwt_identity()

    data = request.get_json()

    print("\n=== Incoming prediction request ===")
    print("Disease:", disease)
    print("Raw JSON data:", data)

    if disease not in [
        "heart",
        "diabetes",
        "kidney",
    ]:
        return jsonify({
            "message": "Invalid disease type"
        }), 400

    # =========================
    # LOAD MODEL
    # =========================

    try:

        pipeline = load_pipeline(disease)

    except Exception as e:

        print("Model load error:", e)

        return jsonify({
            "message": f"Model load error: {e}"
        }), 500

    # =========================
    # PREDICT
    # =========================

    try:

        df = pd.DataFrame([data])

        print("DataFrame columns:")
        print(df.columns.tolist())

        print("DataFrame dtypes:")
        print(df.dtypes)

        print("DataFrame values:")
        print(df.head())

        prob = float(
            pipeline.predict_proba(df)[0][1]
        )

        pred = int(
            pipeline.predict(df)[0]
        )

        print(
            "Model prediction:",
            pred,
            "probability:",
            prob,
        )

    except Exception as e:

        print("Prediction error:", e)

        return jsonify({
            "message": f"Prediction error: {e}"
        }), 400

    # =========================
    # RISK LEVEL
    # =========================

    risk_level = compute_risk_level(prob)

    # =========================
    # SAVE TO MONGODB
    # =========================

    doc = {

        "user_id": user_id,

        "disease": disease,

        "input_data": data,

        "prediction": pred,

        "probability": prob,

        "risk_level": risk_level,

        "created_at": datetime.utcnow(),
    }

    predictions_col.insert_one(doc)

    # =========================
    # RESPONSE
    # =========================

    return jsonify({

        "prediction": pred,

        "probability": prob,

        "risk_percentage": round(
            prob * 100,
            2,
        ),

        "risk_level": risk_level,

    }), 200


# =========================
# PREDICTION HISTORY
# =========================

@prediction_bp.route("/history", methods=["GET"])
@jwt_required()
def get_prediction_history():

    user_id = get_jwt_identity()

    predictions = list(

        predictions_col.find({
            "user_id": user_id
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

            "risk_percentage": round(
                p["probability"] * 100,
                2,
            ),

            "created_at": p["created_at"],

        })

    return jsonify(result), 200


# =========================
# ANALYTICS
# =========================

@prediction_bp.route("/analytics", methods=["GET"])
@jwt_required()
def analytics():

    user_id = get_jwt_identity()

    predictions = list(
        predictions_col.find({
            "user_id": user_id
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