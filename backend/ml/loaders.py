import joblib
import os

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")


def load_pipeline(model_name: str):
    models_dir_abs = os.path.abspath(MODELS_DIR)
    file_name = f"{model_name}_pipeline.pkl"
    path = os.path.join(models_dir_abs, file_name)

    if not os.path.exists(path):
        raise FileNotFoundError(f"Model file not found: {path}")

    pipeline = joblib.load(path)
    return pipeline