import matplotlib.pyplot as plt

from sklearn.metrics import (
    ConfusionMatrixDisplay,
    RocCurveDisplay,
    PrecisionRecallDisplay
)
import os
import joblib
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer

print("=" * 60)
print("Career Verify - Model Training")
print("=" * 60)

# ==================================================
# Create Models Folder
# ==================================================

os.makedirs("models", exist_ok=True)

# ==================================================
# Load Processed Dataset
# ==================================================

print("\nLoading processed dataset...")

df = pd.read_csv("dataset/processed_job_postings.csv")

print("Dataset loaded successfully!")

print(f"\nTotal Records : {len(df)}")

# ==================================================
# Features and Target
# ==================================================

X = df["clean_text"]

y = df["fraudulent"]

print("\nFeature column selected : clean_text")

print("Target column selected : fraudulent")

# ==================================================
# Train-Test Split
# ==================================================

print("\nSplitting dataset...")

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

print("Dataset split completed.")

print(f"\nTraining Samples : {len(X_train)}")

print(f"Testing Samples  : {len(X_test)}")

# ==================================================
# TF-IDF Vectorization
# ==================================================

print("\nApplying TF-IDF Vectorization...")

vectorizer = TfidfVectorizer(

    max_features=5000,

    stop_words="english",

    lowercase=True,

    ngram_range=(1, 2),

    min_df=2,

    max_df=0.90

)

X_train_tfidf = vectorizer.fit_transform(X_train)

X_test_tfidf = vectorizer.transform(X_test)

print("TF-IDF completed successfully!")

print(f"\nVocabulary Size : {len(vectorizer.vocabulary_)}")

print(f"Training Matrix : {X_train_tfidf.shape}")

print(f"Testing Matrix  : {X_test_tfidf.shape}")

print("\nTop 20 TF-IDF Features:")

feature_names = vectorizer.get_feature_names_out()

print(feature_names[:20])

print("\n" + "=" * 60)

print("Part 4.1 Completed Successfully")

print("=" * 60)
# ==================================================
# Logistic Regression Model
# ==================================================

from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)

print("\nTraining Logistic Regression Model...")

model = LogisticRegression(
    random_state=42,
    max_iter=1000,
    class_weight="balanced"
)

model.fit(X_train_tfidf, y_train)

print("Model trained successfully!")

# ==================================================
# Predictions
# ==================================================

print("\nMaking predictions...")

y_pred = model.predict(X_test_tfidf)
y_prob = model.predict_proba(X_test_tfidf)[:, 1]

# ==================================================
# Evaluation
# ==================================================

accuracy = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred)
recall = recall_score(y_test, y_pred)
f1 = f1_score(y_test, y_pred)
roc_auc = roc_auc_score(y_test, y_prob)

print("\n" + "=" * 60)
print("MODEL EVALUATION")
print("=" * 60)

print(f"Accuracy : {accuracy:.4f}")
print(f"Precision: {precision:.4f}")
print(f"Recall   : {recall:.4f}")
print(f"F1-Score : {f1:.4f}")
print(f"ROC-AUC  : {roc_auc:.4f}")

print("\nConfusion Matrix")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report")
print(classification_report(y_test, y_pred))

print("\n" + "=" * 60)
print("Part 4.2 Completed Successfully")
print("=" * 60)
# ==================================================
# Create Output Folder
# ==================================================

os.makedirs("output", exist_ok=True)

# ==================================================
# Confusion Matrix Plot
# ==================================================

print("\nGenerating Confusion Matrix...")

disp = ConfusionMatrixDisplay.from_predictions(
    y_test,
    y_pred,
    cmap="Blues"
)

plt.title("Confusion Matrix")
plt.savefig("output/confusion_matrix.png", dpi=300)
plt.close()

print("✓ confusion_matrix.png saved")

# ==================================================
# ROC Curve
# ==================================================

print("Generating ROC Curve...")

RocCurveDisplay.from_predictions(
    y_test,
    y_prob
)

plt.title("ROC Curve")
plt.savefig("output/roc_curve.png", dpi=300)
plt.close()

print("✓ roc_curve.png saved")

# ==================================================
# Precision-Recall Curve
# ==================================================

print("Generating Precision-Recall Curve...")

PrecisionRecallDisplay.from_predictions(
    y_test,
    y_prob
)

plt.title("Precision-Recall Curve")
plt.savefig("output/precision_recall_curve.png", dpi=300)
plt.close()

print("✓ precision_recall_curve.png saved")

print("\n" + "=" * 60)
print("Part 4.3 Completed Successfully")
print("=" * 60)
# ==================================================
# Save Model and Vectorizer
# ==================================================

print("\nSaving model and vectorizer...")

joblib.dump(model, "models/model.pkl")
joblib.dump(vectorizer, "models/vectorizer.pkl")

print("✓ model.pkl saved")
print("✓ vectorizer.pkl saved")

# ==================================================
# Display Important Features
# ==================================================

feature_names = vectorizer.get_feature_names_out()

coefficients = model.coef_[0]

top_fake = coefficients.argsort()[-20:][::-1]
top_real = coefficients.argsort()[:20]

print("\n" + "=" * 60)
print("TOP 20 WORDS INDICATING FAKE JOBS")
print("=" * 60)

for index in top_fake:
    print(f"{feature_names[index]:30} {coefficients[index]:.4f}")

print("\n" + "=" * 60)
print("TOP 20 WORDS INDICATING REAL JOBS")
print("=" * 60)

for index in top_real:
    print(f"{feature_names[index]:30} {coefficients[index]:.4f}")

# ==================================================
# Final Summary
# ==================================================

print("\n" + "=" * 60)
print("TRAINING SUMMARY")
print("=" * 60)

print(f"Dataset Size        : {len(df)}")
print(f"Training Samples    : {len(X_train)}")
print(f"Testing Samples     : {len(X_test)}")
print(f"Vocabulary Size     : {len(feature_names)}")
print(f"Accuracy            : {accuracy:.4f}")
print(f"Precision           : {precision:.4f}")
print(f"Recall              : {recall:.4f}")
print(f"F1 Score            : {f1:.4f}")
print(f"ROC AUC             : {roc_auc:.4f}")

print("\nModel Location:")
print("models/model.pkl")

print("\nVectorizer Location:")
print("models/vectorizer.pkl")

print("\nTraining Completed Successfully!")