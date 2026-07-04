import unittest
from ml.loaders import load_pipeline
import os

class TestMLLoader(unittest.TestCase):
    def test_load_non_existent_pipeline(self):
        with self.assertRaises(FileNotFoundError):
            load_pipeline("non_existent_model")

    def test_load_existing_pipeline(self):
        # We know these exist based on the directory structure
        for model_name in ["diabetes", "heart", "kidney"]:
            try:
                pipeline = load_pipeline(model_name)
                self.assertIsNotNone(pipeline)
            except FileNotFoundError:
                self.fail(f"Pipeline {model_name} should exist but was not found.")

if __name__ == '__main__':
    unittest.main()
