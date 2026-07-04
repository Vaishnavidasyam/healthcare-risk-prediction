# backend/services/recommendations_service.py

from datetime import datetime
from bson import ObjectId
from .base_service import BaseService


class RecommendationsService(BaseService):
    """
    Service for generating personalized health recommendations
    based on disease risks, health scores, and medical reports.
    """

    # Recommendation templates by condition
    RECOMMENDATIONS_DATABASE = {
        "heart": {
            "high_risk": [
                {
                    "category": "Specialist Consultation",
                    "priority": "Critical",
                    "title": "Urgent Cardiology Consultation",
                    "description": (
                        "Your heart disease risk is high. You need immediate consultation "
                        "with a cardiologist for proper evaluation and treatment planning."
                    ),
                    "action_items": [
                        "Schedule cardiology appointment immediately",
                        "Bring all recent test results and medical history",
                        "Discuss stress test or ECG if not recently done",
                    ],
                    "duration_days": 1,
                    "resources": [],
                },
                {
                    "category": "Medication",
                    "priority": "High",
                    "title": "Blood Pressure Management",
                    "description": (
                        "Start or adjust blood pressure medication as advised by your doctor. "
                        "Target: <120/80 mmHg."
                    ),
                    "action_items": [
                        "Take medications as prescribed daily",
                        "Monitor blood pressure daily if possible",
                        "Report any side effects to your doctor",
                    ],
                    "duration_days": 90,
                    "resources": [],
                },
                {
                    "category": "Diet",
                    "priority": "High",
                    "title": "Heart-Healthy Diet",
                    "description": (
                        "Adopt a Mediterranean or DASH diet to reduce cardiovascular risk."
                    ),
                    "action_items": [
                        "Reduce sodium intake to <2300mg/day",
                        "Increase fruits and vegetables (5+ servings/day)",
                        "Switch to lean proteins and whole grains",
                        "Limit saturated fats and trans fats",
                        "Avoid processed foods and sugary drinks",
                    ],
                    "duration_days": 365,
                    "resources": [
                        "https://www.heart.org/",
                        "https://www.eatrightpro.org/",
                    ],
                },
                {
                    "category": "Exercise",
                    "priority": "High",
                    "title": "Cardiac Exercise Program",
                    "description": (
                        "Gradually increase physical activity under medical supervision."
                    ),
                    "action_items": [
                        "Start with low-impact activities (walking, swimming)",
                        "Aim for 150 minutes of moderate activity per week",
                        "Do strength training 2 days per week",
                        "Monitor heart rate during exercise",
                        "Consult doctor before increasing intensity",
                    ],
                    "duration_days": 365,
                    "resources": [],
                },
                {
                    "category": "Stress Management",
                    "priority": "Medium",
                    "title": "Stress Reduction Techniques",
                    "description": (
                        "Implement stress management to reduce heart disease risk."
                    ),
                    "action_items": [
                        "Practice meditation or mindfulness (15-20 min daily)",
                        "Try deep breathing exercises",
                        "Join a stress management group",
                        "Maintain work-life balance",
                        "Get adequate sleep (7-9 hours)",
                    ],
                    "duration_days": 365,
                    "resources": [],
                },
            ],
            "moderate_risk": [
                {
                    "category": "Monitoring",
                    "priority": "Medium",
                    "title": "Regular Health Monitoring",
                    "description": (
                        "Monitor your health regularly with routine check-ups and tests."
                    ),
                    "action_items": [
                        "Schedule annual cardiology check-up",
                        "Check blood pressure monthly",
                        "Get lipid panel annually",
                        "Track exercise and diet habits",
                    ],
                    "duration_days": 365,
                    "resources": [],
                },
                {
                    "category": "Diet",
                    "priority": "Medium",
                    "title": "Healthy Eating Habits",
                    "description": (
                        "Maintain a heart-healthy diet with balanced nutrition."
                    ),
                    "action_items": [
                        "Eat heart-healthy foods regularly",
                        "Maintain healthy weight",
                        "Limit salt and sugar",
                        "Stay hydrated",
                    ],
                    "duration_days": 365,
                    "resources": [],
                },
            ],
        },
        "diabetes": {
            "high_risk": [
                {
                    "category": "Specialist Consultation",
                    "priority": "Critical",
                    "title": "Urgent Endocrinology Consultation",
                    "description": (
                        "Your diabetes risk is high. Consult an endocrinologist "
                        "for screening and prevention strategies."
                    ),
                    "action_items": [
                        "Schedule endocrinologist appointment",
                        "Get fasting glucose and HbA1c tests",
                        "Discuss diabetes prevention program",
                        "Review family diabetes history",
                    ],
                    "duration_days": 1,
                    "resources": [],
                },
                {
                    "category": "Diet",
                    "priority": "High",
                    "title": "Diabetes-Prevention Diet",
                    "description": (
                        "Adopt a low-glycemic diet to prevent diabetes."
                    ),
                    "action_items": [
                        "Reduce refined carbohydrates and sugar",
                        "Increase fiber intake (25-35g/day)",
                        "Control portion sizes",
                        "Choose whole grains over refined grains",
                        "Eat lean proteins and healthy fats",
                    ],
                    "duration_days": 365,
                    "resources": [],
                },
                {
                    "category": "Exercise",
                    "priority": "High",
                    "title": "Weight Loss and Exercise Program",
                    "description": (
                        "Weight loss of 5-10% can significantly reduce diabetes risk."
                    ),
                    "action_items": [
                        "Aim for 150 minutes of moderate activity weekly",
                        "Include resistance training 2-3 times weekly",
                        "Set weight loss goal (5-10% of body weight)",
                        "Track progress monthly",
                    ],
                    "duration_days": 365,
                    "resources": [],
                },
            ]
        },
        "kidney": {
            "high_risk": [
                {
                    "category": "Specialist Consultation",
                    "priority": "Critical",
                    "title": "Urgent Nephrology Consultation",
                    "description": (
                        "Your kidney disease risk is high. See a nephrologist immediately "
                        "for evaluation and management."
                    ),
                    "action_items": [
                        "Schedule nephrologist appointment urgently",
                        "Get comprehensive metabolic panel and kidney function tests",
                        "Discuss treatment options",
                        "Plan follow-up monitoring",
                    ],
                    "duration_days": 1,
                    "resources": [],
                },
                {
                    "category": "Diet",
                    "priority": "High",
                    "title": "Kidney-Friendly Diet",
                    "description": (
                        "Follow a kidney-protective diet to slow disease progression."
                    ),
                    "action_items": [
                        "Limit sodium to <2300mg/day",
                        "Control protein intake as advised",
                        "Limit phosphorus-rich foods if advised",
                        "Manage potassium intake",
                        "Stay well hydrated",
                    ],
                    "duration_days": 365,
                    "resources": [],
                },
                {
                    "category": "Monitoring",
                    "priority": "High",
                    "title": "Kidney Function Monitoring",
                    "description": (
                        "Regular monitoring of kidney function is essential."
                    ),
                    "action_items": [
                        "Get creatinine and BUN levels checked quarterly",
                        "Monitor blood pressure regularly",
                        "Track urine output and color",
                        "Report any swelling or changes in urination",
                    ],
                    "duration_days": 90,
                    "resources": [],
                },
            ]
        },
    }

    def generate_recommendations(
        self,
        user_id,
        predictions,
        health_score,
        health_record,
        detected_conditions=None,
    ):
        """
        Generate personalized recommendations based on health data.

        Args:
            user_id: User ID (string or ObjectId)
            predictions: Dict with disease risks, e.g. {'heart_risk': 0.8, 'diabetes_risk': 0.6}
            health_score: HealthScore object or dict (reserved for future use)
            health_record: HealthRecord object/dict (reserved for future use)
            detected_conditions: List of conditions detected from reports (e.g. ['anemia'])

        Returns:
            List of recommendation dicts.
        """
        try:
            recommendations = []

            diseases = ["heart", "diabetes", "kidney"]

            for disease in diseases:
                disease_risk = float(predictions.get(f"{disease}_risk", 0.5))

                if disease_risk >= 0.75:
                    risk_level_key = "high_risk"
                elif disease_risk >= 0.50:
                    risk_level_key = "moderate_risk"
                else:
                    risk_level_key = "low_risk"

                # Get recommendations from database
                disease_db = self.RECOMMENDATIONS_DATABASE.get(disease, {})
                if risk_level_key in disease_db:
                    templates = disease_db[risk_level_key]

                    for template in templates:
                        rec = {
                            "user_id": user_id,
                            "category": template["category"],
                            "priority": template["priority"],
                            "title": template["title"],
                            "description": template["description"],
                            "action_items": template["action_items"],
                            "related_condition": disease,
                            "start_date": datetime.utcnow(),
                            "duration_days": template["duration_days"],
                            "resources": template.get("resources", []),
                            "status": "Active",
                            "reason": (
                                f"Based on your {disease.lower()} disease risk "
                                f"({disease_risk * 100:.1f}%)"
                            ),
                        }
                        recommendations.append(rec)

            # Add recommendations for detected conditions from reports
            if detected_conditions:
                for condition in detected_conditions:
                    condition_db = self.RECOMMENDATIONS_DATABASE.get(condition)
                    if condition_db and "high_risk" in condition_db:
                        rec = {
                            "user_id": user_id,
                            "category": "Medical Test",
                            "priority": "High",
                            "title": f"Follow-up for {condition.title()}",
                            "description": (
                                f"{condition.title()} was detected in your medical report. "
                                "Follow-up testing is recommended."
                            ),
                            "action_items": [
                                "Consult with your doctor about the findings",
                                "Schedule follow-up tests as recommended",
                            ],
                            "related_condition": condition,
                            "start_date": datetime.utcnow(),
                            "duration_days": 30,
                            "resources": [],
                            "status": "Active",
                            "reason": "Detected in your medical report analysis",
                        }
                        recommendations.append(rec)

            return recommendations

        except Exception as e:
            self.log_error(e, "generate_recommendations")
            raise

    def save_recommendations(self, recommendations):
        """
        Save recommendations to database.

        Returns:
            List of inserted recommendation IDs (as strings).
        """
        try:
            collection = self.get_collection("recommendations")

            ids = []
            for rec in recommendations:
                now = datetime.utcnow()
                rec["created_at"] = now
                rec["updated_at"] = now

                if isinstance(rec.get("user_id"), str):
                    rec["user_id"] = ObjectId(rec["user_id"])

                result = collection.insert_one(rec)
                ids.append(str(result.inserted_id))

            return ids

        except Exception as e:
            self.log_error(e, "save_recommendations")
            raise

    def get_user_recommendations(self, user_id, status="Active", limit=20):
        """
        Get user's recommendations.

        Args:
            user_id: User ID (string or ObjectId)
            status: Filter by status (e.g. 'Active') or None for all
            limit: Max number of recommendations

        Returns:
            List of recommendation dicts (ObjectIds converted to strings).
        """
        try:
            collection = self.get_collection("recommendations")

            query = {
                "user_id": ObjectId(user_id)
                if isinstance(user_id, str)
                else user_id
            }
            if status:
                query["status"] = status

            recs = list(collection.find(query).limit(limit))

            # Convert ObjectIds for JSON
            for rec in recs:
                rec["_id"] = str(rec["_id"])
                rec["user_id"] = str(rec["user_id"])

            return recs

        except Exception as e:
            self.log_error(e, "get_user_recommendations")
            return []

    def update_recommendation_status(
        self, recommendation_id, status, completion_percentage=None
    ):
        """
        Update recommendation status.
        status: 'Active', 'Completed', 'Dismissed', 'Expired'
        """
        try:
            collection = self.get_collection("recommendations")

            update_data = {
                "status": status,
                "updated_at": datetime.utcnow(),
            }
            if completion_percentage is not None:
                update_data["completion_percentage"] = completion_percentage

            collection.update_one(
                {
                    "_id": ObjectId(recommendation_id)
                    if isinstance(recommendation_id, str)
                    else recommendation_id
                },
                {"$set": update_data},
            )

        except Exception as e:
            self.log_error(e, "update_recommendation_status")
            raise