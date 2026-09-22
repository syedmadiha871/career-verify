import os
import joblib
import sys
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

MODEL_PATH = os.path.join(BASE_DIR, "ml", "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "ml", "vectorizer.pkl")

model = joblib.load(MODEL_PATH)
vectorizer = joblib.load(VECTORIZER_PATH)

# Read job description
job_text = sys.argv[1]

# Transform text
X = vectorizer.transform([job_text])

# Predict
prediction = model.predict(X)[0]
probability = model.predict_proba(X)[0]

confidence = round(max(probability) * 100, 2)

if prediction == 0:
    result = "Real Job"
    fraud_score = round((1 - probability[0]) * 100, 2)
    risk = "Low"
else:
    result = "Fake Job"
    fraud_score = round(probability[1] * 100, 2)

    if fraud_score >= 70:
        risk = "High"
    elif fraud_score >= 40:
        risk = "Medium"
    else:
        risk = "Low"

output = {
    "prediction": result,
    "confidence": confidence,
    "fraud_score": fraud_score,
    "risk": risk,
    "reasons": []
}

print(json.dumps(output))