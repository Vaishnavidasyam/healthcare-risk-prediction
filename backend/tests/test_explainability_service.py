import unittest
from services.explainability_service import ExplainabilityService

class TestExplainabilityService(unittest.TestCase):
    def setUp(self):
        # Initialize with None as DB is not used in the methods being tested
        self.service = ExplainabilityService(db=None)

    def test_generate_explanation_text(self):
        # Mock explanation object
        explanation = {
            "risk_level": "Low",
            "prediction_probability": 0.0167,
            "top_contributing_factors": [
                {"feature": "Glucose", "contribution_percentage": 29.3},
                {"feature": "Insulin", "contribution_percentage": 26.1},
                {"feature": "BloodPressure", "contribution_percentage": 22.8}
            ]
        }
        
        result = self.service.generate_explanation_text(explanation, "diabetes")
        
        # Verify content
        self.assertIn("Your diabetes risk is low", result)
        self.assertIn("Top factors: Glucose (29%)", result)
        self.assertIn("Insulin (26%)", result)
        self.assertIn("BloodPressure (23%)", result)

if __name__ == '__main__':
    unittest.main()
