# backend/services/explainability_service.py

import json
import numpy as np
import shap
from .base_service import BaseService


class ExplainabilityService(BaseService):
    """
    Service for explaining AI predictions using SHAP values,
    feature importance, and other explainability techniques.
    """

    def __init__(self, db):
        super().__init__(db)
        self.shap_explainers = {}

    def explain_prediction(
        self,
        model,
        features,
        feature_names,
        prediction_value,
        disease_type="heart",
    ):
        """
        Explain a single prediction using SHAP values.

        Args:
            model: Trained ML model (e.g. RandomForest) with predict/predict_proba.
            features: 2D array-like of shape [1, n_features].
            feature_names: List of feature names.
            prediction_value: Prediction probability (float between 0 and 1).
            disease_type: 'heart', 'diabetes', or 'kidney'.

        Returns:
            Dict with SHAP values, feature importance, contribution percentages, etc.
        """
        try:
            explanation = {
                "disease_type": disease_type,
                "prediction_probability": round(float(prediction_value), 4),
                "risk_level": self._get_risk_level(prediction_value),
                "top_contributing_factors": [],
                "all_factors": [],
                "shap_values": None,
                "base_value": 0.0,
            }

            try:
                explanation = self._analyze_with_shap(
                    model, features, feature_names, explanation
                )
            except Exception as e:
                # Fallback to simple feature importance
                self.log_error(e, f"SHAP analysis failed, using fallback: {str(e)}")
                explanation = self._fallback_feature_importance(
                    features, feature_names, prediction_value, explanation
                )
            
            # Generate dynamic explanation text
            explanation["summary"] = self.generate_explanation_text(explanation, disease_type)

            return explanation

        except Exception as e:
            self.log_error(e, "explain_prediction")
            raise

    def _analyze_with_shap(self, model, features, feature_names, explanation):
        """
        Analyze prediction using SHAP values.
        Works best with tree-based models (RandomForest, XGBoost, etc.).
        """
        try:
            # Create SHAP explainer (cache per model if needed)
            explainer = shap.TreeExplainer(model)
            shap_values = explainer.shap_values(features)

            # Handle different shap_values shapes:
            # - For binary classifiers, shap_values is often a list [class0, class1].
            # - For regression or some classifiers, it's a single array.
            if isinstance(shap_values, list):
                # Use SHAP values for positive class (index 1) if available
                if len(shap_values) > 1:
                    shap_values_arr = np.array(shap_values[1])
                else:
                    shap_values_arr = np.array(shap_values[0])
            else:
                shap_values_arr = np.array(shap_values)

            # Get SHAP values for the single instance (shape [n_features])
            if shap_values_arr.ndim > 1:
                shap_values_instance = shap_values_arr[0]
            else:
                shap_values_instance = shap_values_arr

            shap_values_list = shap_values_instance.tolist()

            # Base value (expected model output)
            if hasattr(explainer, "expected_value"):
                expected = explainer.expected_value
                # expected_value can be a scalar or array
                if isinstance(expected, (list, np.ndarray)):
                    base_value = float(expected[0])
                else:
                    base_value = float(expected)
            else:
                base_value = 0.5

            # Calculate contribution percentages
            total_abs_contribution = float(
                sum(abs(v) for v in shap_values_list)
            )

            factors = []
            for feature, shap_val in zip(feature_names, shap_values_list):
                shap_val_float = float(shap_val)
                # Get the actual value from the input dataframe
                feature_value = float(features[feature].iloc[0])
                
                if total_abs_contribution > 0:
                    contribution_pct = (
                        abs(shap_val_float) / total_abs_contribution * 100.0
                    )
                else:
                    contribution_pct = 0.0

                factors.append(
                    {
                        "feature": feature,
                        "value": round(feature_value, 2),
                        "shap_value": round(shap_val_float, 4),
                        "contribution_percentage": round(contribution_pct, 2),
                        "direction": "increases_risk"
                        if shap_val_float > 0
                        else "decreases_risk",
                    }
                )

            factors_sorted = sorted(
                factors, key=lambda x: abs(x["shap_value"]), reverse=True
            )

            explanation["shap_values"] = shap_values_list
            explanation["base_value"] = base_value
            explanation["top_contributing_factors"] = factors_sorted[:5]
            explanation["all_factors"] = factors_sorted

            return explanation

        except Exception as e:
            self.log_error(e, "_analyze_with_shap")
            raise

    def _fallback_feature_importance(
        self, features, feature_names, prediction_value, explanation
    ):
        """
        Fallback feature importance using a simple value-based heuristic.
        Useful when SHAP is unavailable or fails.
        """
        try:
            features_array = np.array(features).flatten()

            feature_importance = []
            for feature, value in zip(feature_names, features_array):
                v = float(value)
                # Simple heuristic: if in [0,1], measure distance from 0.5,
                # else use absolute value as importance score.
                if 0 <= v <= 1:
                    importance_score = abs(v - 0.5)
                else:
                    importance_score = abs(v)

                feature_importance.append(
                    {
                        "feature": feature,
                        "value": round(v, 4),
                        "importance": round(float(importance_score), 4),
                        "contribution_percentage": 0.0,  # set later
                    }
                )

            total_importance = sum(f["importance"] for f in feature_importance)

            for f in feature_importance:
                if total_importance > 0:
                    f["contribution_percentage"] = round(
                        f["importance"] / total_importance * 100.0, 2
                    )
                else:
                    f["contribution_percentage"] = 0.0

                f["direction"] = (
                    "increases_risk" if f["value"] > 0.5 else "decreases_risk"
                )

            feature_importance_sorted = sorted(
                feature_importance, key=lambda x: x["importance"], reverse=True
            )

            explanation["top_contributing_factors"] = feature_importance_sorted[:5]
            explanation["all_factors"] = feature_importance_sorted

            return explanation

        except Exception as e:
            self.log_error(e, "_fallback_feature_importance")
            raise

    def _get_risk_level(self, probability):
        """
        Convert probability (0-1) to risk level for explanation.
        Aligned with frontend thresholds: High >= 0.70, Medium >= 0.40, Low < 0.40.
        """
        p = float(probability)
        if p >= 0.70:
            return "High"
        elif p >= 0.40:
            return "Medium"
        else:
            return "Low"

    def generate_explanation_text(self, explanation, disease_type="heart"):
        """
        Generate human-readable explanation of a prediction using
        risk level, probability, and top contributing factors.
        """
        try:
            risk_level = explanation["risk_level"]
            probability = float(explanation["prediction_probability"])
            top_factors = explanation.get("top_contributing_factors", [])

            # Disease-specific base messages
            disease_messages = {
                "heart": {
                    "Critical": (
                        f"Your heart disease risk is very high at "
                        f"{probability * 100:.1f}%. Immediate medical consultation is strongly recommended."
                    ),
                    "High": (
                        f"Your heart disease risk is elevated at "
                        f"{probability * 100:.1f}%. Please consult with a cardiologist."
                    ),
                    "Medium": (
                        f"Your heart disease risk is moderate at "
                        f"{probability * 100:.1f}%. Consider lifestyle modifications and regular monitoring."
                    ),
                    "Low": (
                        f"Your heart disease risk is low at "
                        f"{probability * 100:.1f}%. Continue healthy habits."
                    ),
                },
                "diabetes": {
                    "High": (
                        f"Your diabetes risk is elevated at "
                        f"{probability * 100:.1f}%. Please consult an endocrinologist."
                    ),
                    "Medium": (
                        f"Your diabetes risk is moderate at "
                        f"{probability * 100:.1f}%. Focus on diet, exercise, and regular glucose monitoring."
                    ),
                    "Low": (
                        f"Your diabetes risk is low at "
                        f"{probability * 100:.1f}%. Maintain healthy habits."
                    ),
                },
                "kidney": {
                    "High": (
                        f"Your kidney disease risk is elevated at "
                        f"{probability * 100:.1f}%. See a nephrologist soon."
                    ),
                    "Medium": (
                        f"Your kidney disease risk is moderate at "
                        f"{probability * 100:.1f}%. Monitor kidney function and hydration regularly."
                    ),
                    "Low": (
                        f"Your kidney disease risk is low at "
                        f"{probability * 100:.1f}%. Maintain hydration and a healthy diet."
                    ),
                },
            }

            base_message = disease_messages.get(disease_type, {}).get(
                risk_level, ""
            )

            # Compact summary
            factors_summary = ", ".join([f"{f['feature']} ({f['contribution_percentage']:.0f}%)" for f in top_factors[:3]])
            factor_explanation = f"\n\nTop factors: {factors_summary}."

            return base_message + factor_explanation

        except Exception as e:
            self.log_error(e, "generate_explanation_text")
            return "Unable to generate explanation at this time."