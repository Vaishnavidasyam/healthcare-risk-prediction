import os
import pandas as pd
import joblib

from sklearn.model_selection import (
    train_test_split,
    StratifiedKFold,
    cross_val_score,
)

from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler

from sklearn.ensemble import RandomForestClassifier

from sklearn.metrics import (
    accuracy_score,
    roc_auc_score,
    classification_report,
)

# ======================================================
# PATHS
# ======================================================

BASE_DIR = os.path.dirname(os.path.dirname(__file__))

PROJECT_ROOT = os.path.abspath(
    os.path.join(BASE_DIR, "..")
)

DATASETS_DIR = os.path.join(
    PROJECT_ROOT,
    "datasets",
)

MODELS_DIR = os.path.join(
    PROJECT_ROOT,
    "models",
)

os.makedirs(MODELS_DIR, exist_ok=True)

HEART_CSV = os.path.join(
    DATASETS_DIR,
    "heart.csv",
)

# ======================================================
# LOAD DATA
# ======================================================

def load_heart_data():

    df = pd.read_csv(HEART_CSV)

    df.columns = df.columns.str.strip()

    print("\n============================")
    print("HEART DATASET LOADED")
    print("============================")

    print(df.head())

    target_col = "target"

    # FEATURES
    X = df.drop(columns=[target_col])

    # ======================================================
    # IMPORTANT FIX
    # ======================================================
    # Some heart datasets use:
    #
    # 1 = NO disease
    # 0 = disease
    #
    # We reverse labels so:
    #
    # 1 = disease
    # 0 = healthy
    #
    # This fixes incorrect predictions
    # ======================================================

    y = 1 - df[target_col]

    print("\nTARGET DISTRIBUTION:")
    print(y.value_counts())

    print("\nMISSING VALUES:")
    print(df.isna().sum())

    return X, y


# ======================================================
# PIPELINE
# ======================================================

def build_heart_pipeline(X):

    numeric_features = X.columns.tolist()

    numeric_transformer = Pipeline(
        steps=[
            (
                "imputer",
                SimpleImputer(strategy="median"),
            ),
            (
                "scaler",
                StandardScaler(),
            ),
        ]
    )

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "num",
                numeric_transformer,
                numeric_features,
            ),
        ]
    )

    model = RandomForestClassifier(

        n_estimators=500,

        max_depth=12,

        min_samples_split=4,

        min_samples_leaf=2,

        random_state=42,

        class_weight="balanced",

        n_jobs=-1,
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )

    return pipeline


# ======================================================
# TRAIN MODEL
# ======================================================

def train_heart_model():

    X, y = load_heart_data()

    X_train, X_test, y_train, y_test = train_test_split(

        X,
        y,

        test_size=0.2,

        random_state=42,

        stratify=y,
    )

    pipeline = build_heart_pipeline(X_train)

    print("\n============================")
    print("TRAINING HEART MODEL")
    print("============================")

    pipeline.fit(X_train, y_train)

    # ======================================================
    # TEST
    # ======================================================

    y_pred = pipeline.predict(X_test)

    y_prob = pipeline.predict_proba(X_test)[:, 1]

    acc = accuracy_score(y_test, y_pred)

    auc = roc_auc_score(y_test, y_prob)

    print("\n============================")
    print("MODEL PERFORMANCE")
    print("============================")

    print(f"Accuracy : {acc:.4f}")

    print(f"AUC Score: {auc:.4f}")

    print("\nClassification Report:\n")

    print(
        classification_report(
            y_test,
            y_pred,
        )
    )

    # ======================================================
    # CROSS VALIDATION
    # ======================================================

    cv = StratifiedKFold(

        n_splits=5,

        shuffle=True,

        random_state=42,
    )

    cv_scores = cross_val_score(

        pipeline,

        X,

        y,

        cv=cv,

        scoring="accuracy",
    )

    print("\n============================")
    print("5 FOLD CV")
    print("============================")

    print(
        "Mean Accuracy:",
        cv_scores.mean(),
    )

    print(
        "Std:",
        cv_scores.std(),
    )

    # ======================================================
    # CHECK PREDICTIONS
    # ======================================================

    full_pred = pipeline.predict(X)

    print("\nFULL DATA PREDICTION COUNTS:")

    print(
        pd.Series(full_pred).value_counts()
    )

    # ======================================================
    # SAVE MODEL
    # ======================================================

    out_path = os.path.join(
        MODELS_DIR,
        "heart_pipeline.pkl",
    )

    joblib.dump(
        pipeline,
        out_path,
    )

    print("\n============================")
    print("MODEL SAVED")
    print("============================")

    print(out_path)


# ======================================================
# MAIN
# ======================================================

if __name__ == "__main__":

    train_heart_model()