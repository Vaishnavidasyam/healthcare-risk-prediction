import os
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, roc_auc_score, classification_report


def load_dataset(data_path, target_col):
    df = pd.read_csv(data_path)
    df.columns = df.columns.str.strip()
    df = df.drop_duplicates()

    for col in df.columns:
        if df[col].dtype == "object":
            df[col] = (
                df[col].astype(str)
                .str.replace(r"\t", "", regex=True)
                .str.replace(r"\n", "", regex=True)
                .str.strip()
            )
            df[col] = df[col].replace(["?", "", "nan", "None"], pd.NA)

    if target_col == "classification":
        df[target_col] = (
            df[target_col].astype(str)
            .str.replace(r"\t", "", regex=True)
            .str.replace(r"\n", "", regex=True)
            .str.strip()
        )
        df[target_col] = df[target_col].replace({"ckd": 1, "notckd": 0})
        df = df[df[target_col].isin([0, 1])]
        df[target_col] = df[target_col].astype(int)

    df = df.dropna(subset=[target_col])

    if "id" in df.columns:
        df = df.drop("id", axis=1)

    X = df.drop(target_col, axis=1)
    y = df[target_col]

    return X, y, X.columns.tolist()


def build_pipeline(X):
    numeric_features = X.select_dtypes(include=[np.number]).columns.tolist()
    categorical_features = X.select_dtypes(exclude=[np.number]).columns.tolist()

    numeric_transformer = Pipeline(
        steps=[("imputer", SimpleImputer(strategy="median"))]
    )

    categorical_transformer = Pipeline(
        steps=[
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("onehot", OneHotEncoder(handle_unknown="ignore"))
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            ("num", numeric_transformer, numeric_features),
            ("cat", categorical_transformer, categorical_features)
        ]
    )

    model = RandomForestClassifier(
        n_estimators=300,
        random_state=42,
        class_weight="balanced"
    )

    return Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model)
        ]
    )


def train_model(X, y, model_name, feature_names):
    print(f"\n========== TRAINING {model_name.upper()} ==========")

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    pipeline = build_pipeline(X_train)
    pipeline.fit(X_train, y_train)

    y_pred = pipeline.predict(X_test)

    try:
        y_prob = pipeline.predict_proba(X_test)[:, 1]
        auc = roc_auc_score(y_test, y_prob)
    except Exception:
        auc = "N/A"

    print("\nAccuracy:", accuracy_score(y_test, y_pred))
    print("AUC:", auc)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))

    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    cv_scores = cross_val_score(pipeline, X, y, cv=cv, scoring="accuracy")
    print("Cross-val Accuracy:", cv_scores.mean(), "+/-", cv_scores.std())

    os.makedirs("models", exist_ok=True)
    joblib.dump(pipeline, f"models/{model_name}_pipeline.pkl")
    joblib.dump(feature_names, f"models/{model_name}_features.pkl")


if __name__ == "__main__":
    datasets = [
        ("data/heart.csv", "target", "heart"),
        ("data/diabetes.csv", "Outcome", "diabetes"),
        ("data/kidney_disease.csv", "classification", "kidney"),
    ]

    for path, target, name in datasets:
        try:
            X, y, features = load_dataset(path, target)
            train_model(X, y, name, features)
        except Exception as e:
            print(f"\nError in {name.upper()} dataset:", e)

    print("\nALL TRAINING COMPLETED")