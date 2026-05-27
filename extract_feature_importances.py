# extract_feature_importances.py

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline


def get_feature_importance(model_name: str):
    pipeline_path = f"models/{model_name}_pipeline.pkl"
    pipe: Pipeline = joblib.load(pipeline_path)

    preprocessor: ColumnTransformer = pipe.named_steps["preprocessor"]
    model = pipe.named_steps["model"]

    feature_names = []

    # preprocessor.transformers_ is a list of tuples:
    # (name, transformer, columns)
    transformers = preprocessor.transformers_

    # Numeric transformer (assume first)
    num_transformer = transformers[0]
    num_cols = num_transformer[2]  # column names
    feature_names.extend(num_cols)

    # Try to get categorical transformer if exists
    cat_cols = []
    try:
        # second transformer as categorical
        cat_transformer = transformers[1]
        cat_cols = cat_transformer[2]

        # If there are no categorical columns, skip
        if cat_cols:
            ohe = cat_transformer[1].named_steps["onehot"]
            ohe_feature_names = ohe.get_feature_names_out(cat_cols)
            feature_names.extend(ohe_feature_names.tolist())
    except Exception:
        # No categorical transformer or no OHE fitted
        cat_cols = []

    importances = model.feature_importances_

    # Safety: make lengths match
    if len(feature_names) != len(importances):
        # Fallback: create generic names
        feature_names = [f"feature_{i}" for i in range(len(importances))]

    df_imp = pd.DataFrame({
        "feature": feature_names,
        "importance": importances
    }).sort_values("importance", ascending=False)

    out_path = f"models/{model_name}_feature_importance.csv"
    df_imp.to_csv(out_path, index=False)
    print(f"Saved feature importance for {model_name} -> {out_path}")


if __name__ == "__main__":
    for name in ["heart", "diabetes", "kidney"]:
        try:
            get_feature_importance(name)
        except Exception as e:
            print(f"Error processing {name}: {e}")