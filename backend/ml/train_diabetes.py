import os
import pandas as pd
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report
import joblib

BASE_DIR = os.path.dirname(os.path.dirname(__file__))  # backend/
PROJECT_ROOT = os.path.abspath(os.path.join(BASE_DIR, ".."))
DATASETS_DIR = os.path.join(PROJECT_ROOT, "datasets")
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")

os.makedirs(MODELS_DIR, exist_ok=True)

DIABETES_CSV = os.path.join(DATASETS_DIR, "diabetes.csv")

def load_diabetes_data():
    df = pd.read_csv(DIABETES_CSV)
    df.columns = df.columns.str.strip()

    target_col = "Outcome"  # adjust if different
    X = df.drop(columns=[target_col])
    y = df[target_col]

    print("\nDIABETES DATA SHAPE:", df.shape)
    print("\nTARGET DISTRIBUTION:")
    print(y.value_counts())

    print("\nMISSING VALUES PER COLUMN:")
    print(df.isna().sum())

    return X, y

def build_diabetes_pipeline(X: pd.DataFrame):
    numeric_features = X.columns.tolist()

    numeric_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median")),
            ("scaler", StandardScaler()),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
        ]
    )

    model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced",  # handle imbalance
        n_jobs=-1,
    )

    pipe = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )

    return pipe

def train_diabetes_model(data_path: str):
    X, y = load_diabetes_data()

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    pipeline = build_diabetes_pipeline(X_train)

    print("\n=== TRAINING DIABETES PIPELINE ===")
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)

    try:
        y_prob = pipeline.predict_proba(X_test)[:, 1]
        auc = roc_auc_score(y_test, y_prob)
    except Exception as e:
        print("AUC error:", e)
        auc = "N/A"

    acc = accuracy_score(y_test, y_pred)

    print("\nDIABETES TEST ACCURACY:", acc)
    print("DIABETES TEST AUC:", auc)
    print("\nCLASSIFICATION REPORT:")
    print(classification_report(y_test, y_pred))

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(pipeline, X, y, cv=cv, scoring="accuracy")
    print("\n5-FOLD CV ACCURACY:", cv_scores.mean(), "+/-", cv_scores.std())

    # Check predictions on full dataset
    full_pred = pipeline.predict(X)
    print("\nFULL DATA PREDICTION COUNTS:")
    print(pd.Series(full_pred).value_counts())

    out_path = os.path.join(MODELS_DIR, "diabetes_pipeline.pkl")
    joblib.dump(pipeline, out_path)
    print(f"\nSaved diabetes pipeline to {out_path}")

if __name__ == "__main__":
    train_diabetes_model(DIABETES_CSV)