from datetime import datetime

def create_prediction_doc(user_id, disease, input_data, prob, risk_level):
    return {
        "user_id": user_id,
        "disease": disease,
        "input_data": input_data,
        "probability": prob,
        "risk_level": risk_level,
        "created_at": datetime.utcnow(),
    }