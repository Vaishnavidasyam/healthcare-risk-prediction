
import os
import pandas as pd
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
DATASETS_DIR = os.path.join(PROJECT_ROOT, "datasets")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

def test_heart_positive():
    df = pd.read_csv(os.path.join(DATASETS_DIR, "heart.csv"))
    df.columns = df.columns.str.strip()
    pos = df[df["target"] == 1].iloc[0]
    print("\nHEART POSITIVE SAMPLE:\n", pos)

    X = df.drop(columns=["target"])
    heart_model = joblib.load(os.path.join(MODELS_DIR, "heart_pipeline.pkl"))

    # Wrap the positive sample as a 1-row DataFrame with same columns
    X_pos = pd.DataFrame([pos.drop(labels=["target"]).to_dict()])

    prob = heart_model.predict_proba(X_pos)[0][1]
    pred = heart_model.predict(X_pos)[0]
    print("Model prediction:", pred, "probability:", prob)

def test_diabetes_positive():
    df = pd.read_csv(os.path.join(DATASETS_DIR, "diabetes.csv"))
    df.columns = df.columns.str.strip()
    pos = df[df["Outcome"] == 1].iloc[0]
    print("\nDIABETES POSITIVE SAMPLE:\n", pos)

    X = df.drop(columns=["Outcome"])
    diabetes_model = joblib.load(os.path.join(MODELS_DIR, "diabetes_pipeline.pkl"))

    X_pos = pd.DataFrame([pos.drop(labels=["Outcome"]).to_dict()])

    prob = diabetes_model.predict_proba(X_pos)[0][1]
    pred = diabetes_model.predict(X_pos)[0]
    print("Model prediction:", pred, "probability:", prob)

if __name__ == "__main__":
    test_heart_positive()
    test_diabetes_positive()