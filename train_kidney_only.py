import pandas as pd
import numpy as np
import joblib
import os

from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report


# ==========================================
# STEP 1: LOAD AND CLEAN KIDNEY DATA
# ==========================================
def load_and_clean_kidney(data_path: str):
    # Load CSV
    df = pd.read_csv(data_path)

    # Strip column names
    df.columns = df.columns.str.strip()

    # Drop exact duplicate rows
    df = df.drop_duplicates()

    # Standardize missing markers in object columns
    for col in df.columns:
        if df[col].dtype == "object":
            df[col] = (
                df[col].astype(str)
                .str.replace(r"\t", "", regex=True)
                .str.replace(r"\n", "", regex=True)
                .str.strip()
            )
            df[col] = df[col].replace(["?", "", "nan", "None"], pd.NA)

    # Drop ID column if present
    if "id" in df.columns:
        df = df.drop(columns=["id"])

    # Handle target
    target_col = "classification"

    df[target_col] = (
        df[target_col]
        .astype(str)
        .str.replace(r"\t", "", regex=True)
        .str.replace(r"\n", "", regex=True)
        .str.strip()
    )

    df[target_col] = df[target_col].replace({"ckd": 1, "notckd": 0})

    df = df[df[target_col].isin([0, 1])]
    df[target_col] = df[target_col].astype(int)

    # Drop rows with missing target
    df = df.dropna(subset=[target_col])

    # Basic info for you to see
    print("\nKIDNEY DATA SHAPE:", df.shape)
    print("\nTARGET DISTRIBUTION:")
    print(df[target_col].value_counts())

    print("\nMISSING VALUES PER COLUMN:")
    print(df.isna().sum())

    # Split X, y
    X = df.drop(columns=[target_col])
    y = df[target_col]

    return X, y


# ==========================================
# STEP 2: BUILD PIPELINE
# ==========================================
def build_kidney_pipeline(X: pd.DataFrame):
    # Identify numeric and categorical columns
    numeric_cols = X.select_dtypes(include=[np.number]).columns.tolist()
    categorical_cols = X.select_dtypes(exclude=[np.number]).columns.tolist()

    print("\nNUMERIC COLUMNS:", numeric_cols)
    print("CATEGORICAL COLUMNS:", categorical_cols)

    # Numeric transformer
    numeric_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="median"))
        ]
    )

    # Categorical transformer
    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore"))
        ]
    )

    # ColumnTransformer
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_cols),
            ("cat", categorical_transformer, categorical_cols),
        ]
    )

    # Model
    model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced"
    )

    # Full pipeline
    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )

    return pipeline


# ==========================================
# STEP 3: TRAIN AND EVALUATE
# ==========================================
def train_kidney_model(data_path: str):
    # Load and clean
    X, y = load_and_clean_kidney(data_path)

    # Train-test split (stratified)
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # Build pipeline
    pipeline = build_kidney_pipeline(X_train)

    # Fit
    print("\n=== TRAINING KIDNEY PIPELINE ===")
    pipeline.fit(X_train, y_train)

    # Predict
    y_pred = pipeline.predict(X_test)

    # Probabilities (for AUC)
    try:
        y_prob = pipeline.predict_proba(X_test)[:, 1]
        auc = roc_auc_score(y_test, y_prob)
    except Exception as e:
        print("AUC error:", e)
        auc = "N/A"

    # Metrics
    acc = accuracy_score(y_test, y_pred)

    print("\nKIDNEY TEST ACCURACY:", acc)
    print("KIDNEY TEST AUC:", auc)
    print("\nCLASSIFICATION REPORT:")
    print(classification_report(y_test, y_pred))

    # Cross-validation
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(pipeline, X, y, cv=cv, scoring="accuracy")
    print("\n5-FOLD CV ACCURACY:", cv_scores.mean(), "+/-", cv_scores.std())

    # Save pipeline
    os.makedirs("models", exist_ok=True)
    joblib.dump(pipeline, "models/kidney_pipeline.pkl")
    print("\nSaved kidney pipeline to models/kidney_pipeline.pkl")


# ==========================================
# MAIN
# ==========================================
if __name__ == "__main__":
    train_kidney_model("data/kidney_disease.csv")