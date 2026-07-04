"""
Health Score Service - Calculates comprehensive health scoring system
"""

from datetime import datetime
from bson import ObjectId
from .base_service import BaseService
from models.report_models import HealthScore

class HealthScoreService(BaseService):
    """
    Service for calculating health scores based on:
    - Disease risks (Heart, Diabetes, Kidney)
    - BMI
    - Blood Pressure
    - Lifestyle factors
    - Age
    """
    
    HEALTH_SCORE_WEIGHTS = {
        "heart_risk": 0.25,
        "diabetes_risk": 0.25,
        "kidney_risk": 0.20,
        "bmi": 0.10,
        "blood_pressure": 0.10,
        "age": 0.05,
        "lifestyle": 0.05
    }
    
    SCORE_CATEGORIES = {
        (85, 100): "Excellent",
        (70, 84): "Good",
        (50, 69): "Moderate",
        (0, 49): "High Risk"
    }
    
    def calculate_health_score(self, user_id, predictions, health_record):
        """
        Calculate comprehensive health score
        
        Args:
            user_id: User ID
            predictions: Dict with heart_risk, diabetes_risk, kidney_risk (0-1 scale)
            health_record: HealthRecord object
            
        Returns:
            HealthScore object
        """
        try:
            # Individual component scores (convert 0-1 to 0-100, inverted where higher is better)
            heart_score = self._calculate_risk_score(predictions.get('heart_risk', 0.5))
            diabetes_score = self._calculate_risk_score(predictions.get('diabetes_risk', 0.5))
            kidney_score = self._calculate_risk_score(predictions.get('kidney_risk', 0.5))
            
            bmi_score = self._calculate_bmi_score(health_record.bmi) if health_record.bmi else 75
            bp_score = self._calculate_bp_score(
                health_record.blood_pressure_systolic,
                health_record.blood_pressure_diastolic
            ) if health_record.blood_pressure_systolic else 75
            
            age_score = self._calculate_age_score(health_record.age if hasattr(health_record, 'age') else None)
            lifestyle_score = self._calculate_lifestyle_score(health_record)
            
            # Calculate weighted overall score
            overall_score = (
                heart_score * self.HEALTH_SCORE_WEIGHTS["heart_risk"] +
                diabetes_score * self.HEALTH_SCORE_WEIGHTS["diabetes_risk"] +
                kidney_score * self.HEALTH_SCORE_WEIGHTS["kidney_risk"] +
                bmi_score * self.HEALTH_SCORE_WEIGHTS["bmi"] +
                bp_score * self.HEALTH_SCORE_WEIGHTS["blood_pressure"] +
                age_score * self.HEALTH_SCORE_WEIGHTS["age"] +
                lifestyle_score * self.HEALTH_SCORE_WEIGHTS["lifestyle"]
            )
            
            overall_score = round(overall_score, 2)
            category = self._get_score_category(overall_score)
            
            # Get top risk factors
            top_risk_factors = self._get_top_risk_factors(
                heart_score, diabetes_score, kidney_score,
                bmi_score, bp_score, lifestyle_score
            )
            
            # Create health score object
            health_score = HealthScore(
                user_id=user_id,
                overall_score=overall_score,
                overall_category=category,
                heart_risk_score=heart_score,
                diabetes_risk_score=diabetes_score,
                kidney_risk_score=kidney_score,
                bmi_score=bmi_score,
                blood_pressure_score=bp_score,
                age_risk_score=age_score,
                lifestyle_score=lifestyle_score,
                top_risk_factors=top_risk_factors
            )
            
            return health_score
            
        except Exception as e:
            self.log_error(e, "calculate_health_score")
            raise
    
    def _calculate_risk_score(self, risk_probability):
        """
        Convert risk probability (0-1) to score (0-100)
        Higher score = lower risk
        """
        # Convert from 0-1 to 0-100, then invert (0 risk = 100 score)
        return round((1 - risk_probability) * 100, 2)
    
    def _calculate_bmi_score(self, bmi):
        """Calculate BMI score (18.5-24.9 is ideal)"""
        if bmi is None:
            return 75
        
        if 18.5 <= bmi <= 24.9:
            return 100
        elif 16 <= bmi < 18.5 or 25 <= bmi < 30:
            return 80
        elif 14 <= bmi < 16 or 30 <= bmi < 35:
            return 60
        else:
            return 40
    
    def _calculate_bp_score(self, systolic, diastolic):
        """Calculate blood pressure score (120/80 is optimal)"""
        if systolic is None or diastolic is None:
            return 75
        
        # Optimal: <120/<80
        if systolic < 120 and diastolic < 80:
            return 100
        # Elevated: 120-129/<80
        elif systolic < 130 and diastolic < 80:
            return 85
        # Stage 1: 130-139/80-89
        elif systolic < 140 and diastolic < 90:
            return 70
        # Stage 2: ≥140/≥90
        else:
            return 50
    
    def _calculate_age_score(self, age):
        """Calculate age risk score"""
        if age is None:
            return 75
        
        if age < 30:
            return 90
        elif age < 40:
            return 85
        elif age < 50:
            return 75
        elif age < 60:
            return 65
        elif age < 70:
            return 55
        else:
            return 45
    
    def _calculate_lifestyle_score(self, health_record):
        """Calculate lifestyle score based on exercise, diet, sleep, stress"""
        score = 75
        
        # Exercise: ideal is 150+ min/week of moderate activity
        if hasattr(health_record, 'exercise_frequency'):
            if health_record.exercise_frequency and health_record.exercise_frequency >= 5:
                score += 15
            elif health_record.exercise_frequency and health_record.exercise_frequency >= 3:
                score += 10
            elif health_record.exercise_frequency == 0:
                score -= 15
        
        # Smoking
        if hasattr(health_record, 'smoking_status'):
            if health_record.smoking_status == 'None':
                score += 10
            elif health_record.smoking_status == 'Former':
                score += 5
            elif health_record.smoking_status == 'Current':
                score -= 15
        
        # Sleep: ideal is 7-9 hours
        if hasattr(health_record, 'sleep_hours'):
            if health_record.sleep_hours and 7 <= health_record.sleep_hours <= 9:
                score += 10
            elif health_record.sleep_hours and (health_record.sleep_hours < 5 or health_record.sleep_hours > 10):
                score -= 10
        
        # Stress: lower is better
        if hasattr(health_record, 'stress_level'):
            if health_record.stress_level and health_record.stress_level <= 4:
                score += 10
            elif health_record.stress_level and health_record.stress_level >= 7:
                score -= 10
        
        return min(max(score, 0), 100)
    
    def _get_score_category(self, score):
        """Get category name from score"""
        for (lower, upper), category in self.SCORE_CATEGORIES.items():
            if lower <= score <= upper:
                return category
        return "Unknown"
    
    def _get_top_risk_factors(self, *scores):
        """
        Get top 5 risk factors (lowest scores = highest risks)
        """
        factors = [
            ("Heart Risk", 100 - scores[0]),
            ("Diabetes Risk", 100 - scores[1]),
            ("Kidney Risk", 100 - scores[2]),
            ("BMI", 100 - scores[3]),
            ("Blood Pressure", 100 - scores[4]),
            ("Lifestyle", 100 - scores[6]),
        ]
        
        # Sort by risk (highest first) and get top 5
        top_factors = sorted(factors, key=lambda x: x[1], reverse=True)[:5]
        
        return [
            {
                "name": factor[0],
                "contribution": round(factor[1], 2)
            }
            for factor in top_factors
        ]
    
    def save_health_score(self, health_score):
        """Save health score to database"""
        try:
            collection = self.get_collection('health_scores')
            result = collection.insert_one({
                'user_id': ObjectId(health_score.user_id) if isinstance(health_score.user_id, str) else health_score.user_id,
                'overall_score': health_score.overall_score,
                'overall_category': health_score.overall_category,
                'heart_risk_score': health_score.heart_risk_score,
                'diabetes_risk_score': health_score.diabetes_risk_score,
                'kidney_risk_score': health_score.kidney_risk_score,
                'bmi_score': health_score.bmi_score,
                'blood_pressure_score': health_score.blood_pressure_score,
                'age_risk_score': health_score.age_risk_score,
                'lifestyle_score': health_score.lifestyle_score,
                'top_risk_factors': health_score.top_risk_factors,
                'score_date': datetime.utcnow(),
                'created_at': datetime.utcnow(),
                'updated_at': datetime.utcnow()
            })
            return str(result.inserted_id)
        except Exception as e:
            self.log_error(e, "save_health_score")
            raise
    
    def get_latest_health_score(self, user_id):
        """Get latest health score for user"""
        try:
            collection = self.get_collection('health_scores')
            score = collection.find_one(
                {'user_id': ObjectId(user_id) if isinstance(user_id, str) else user_id},
                sort=[('score_date', -1)]
            )
            return score
        except Exception as e:
            self.log_error(e, "get_latest_health_score")
            return None

    def get_or_create_latest_score(self, user_id):
        """Get latest score or calculate a fresh one if missing but data exists."""
        try:
            latest = self.get_latest_health_score(user_id)
            if latest:
                return latest
            
            # If no score found, try to calculate one on the fly
            # This handles the case where trigger_health_score_update might have failed or not run yet
            user_id_obj = ObjectId(user_id) if isinstance(user_id, str) else user_id
            
            # 1. Get predictions
            diseases = ["heart", "diabetes", "kidney"]
            latest_probs = {}
            has_data = False
            for d in diseases:
                p = self.get_collection("predictions").find_one(
                    {"user_id": user_id_obj, "disease": d},
                    sort=[("created_at", -1)]
                )
                if p:
                    latest_probs[f"{d}_risk"] = p.get("probability", 0.5)
                    has_data = True
                else:
                    latest_probs[f"{d}_risk"] = 0.5
            
            if not has_data:
                return None
                
            # 2. Get health record
            from models.health_models import HealthRecord
            record_doc = self.get_collection("health_records").find_one(
                {"user_id": user_id_obj},
                sort=[("record_date", -1)]
            )
            
            if record_doc:
                health_record = HealthRecord.from_dict(record_doc)
            else:
                health_record = HealthRecord(user_id=user_id)
                # Try to get age/bmi from predictions if possible
                latest_p = self.get_collection("predictions").find_one({"user_id": user_id_obj}, sort=[("created_at", -1)])
                if latest_p and "input_data" in latest_p:
                    inp = latest_p["input_data"]
                    health_record.age = inp.get("age") or inp.get("Age")
                    health_record.bmi = inp.get("BMI")
            
            # 3. Calculate and save
            new_score_obj = self.calculate_health_score(user_id, latest_probs, health_record)
            self.save_health_score(new_score_obj)
            
            # 4. Return as dict for consistency with find_one
            return self.get_latest_health_score(user_id)
            
        except Exception as e:
            self.log_error(e, "get_or_create_latest_score")
            return None
    
    def get_health_score_history(self, user_id, days=30):
        """Get health score history for last N days"""
        try:
            from datetime import timedelta
            collection = self.get_collection('health_scores')
            cutoff_date = datetime.utcnow() - timedelta(days=days)
            
            scores = list(collection.find({
                'user_id': ObjectId(user_id) if isinstance(user_id, str) else user_id,
                'score_date': {'$gte': cutoff_date}
            }).sort('score_date', 1))
            
            return scores
        except Exception as e:
            self.log_error(e, "get_health_score_history")
            return []
