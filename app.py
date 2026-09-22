from flask import Flask, render_template, request, send_file
import joblib
import sqlite3
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle
)

from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import inch

app = Flask(__name__)

# Load trained model and vectorizer
model = joblib.load("ml/model.pkl")
vectorizer = joblib.load("ml/vectorizer.pkl")

# Store latest prediction (used later for PDF download)
latest_result = {}


# ============================================
# Prediction Function
# ============================================

def predict_job(job_text):

    # Convert text to TF-IDF vector
    vector = vectorizer.transform([job_text])

    # Prediction
    prediction = model.predict(vector)[0]

    # Probability
    probability = model.predict_proba(vector)[0]
    confidence = round(max(probability) * 100, 2)
    fraud_score = round(probability[1] * 100, 2)

    # Risk Level
    if prediction == 0:
        risk = "Low"
    elif confidence > 85:
        risk = "High"
    else:
        risk = "Medium"

    # Convert text to lowercase
    text = job_text.lower()

    fake_keywords = [
        "registration fee",
        "earn money",
        "work from home",
        "whatsapp",
        "telegram",
        "bank",
        "guaranteed",
        "instant",
        "no experience",
        "aadhaar",
        "pan card",
        "processing fee",
        "investment"
    ]

    real_keywords = [
        "python",
        "java",
        "sql",
        "degree",
        "health insurance",
        "team",
        "benefits",
        "experience",
        "company",
        "software",
        "communication",
        "development",
        "employee"
    ]

    reasons = []

    if prediction == 1:
        result = "Fake Job"

        for word in fake_keywords:
            if word in text:
                reasons.append(word)

    else:
        result = "Real Job"

        for word in real_keywords:
            if word in text:
                reasons.append(word)

    return result, confidence, risk, reasons, fraud_score
@app.route("/history")
def history():

    conn = sqlite3.connect("database.db")
    conn.row_factory = sqlite3.Row

    cursor = conn.cursor()

    cursor.execute("""
        SELECT *
        FROM history
        ORDER BY created_at DESC
    """)

    records = cursor.fetchall()

    conn.close()

    return render_template(
        "history.html",
        records=records
    )


# ============================================
# Save Prediction History
# ============================================

def save_history(job_text, result, confidence, fraud_score, risk):

    # Extract first line as job title
    lines = job_text.strip().split("\n")

    if len(lines) > 0:
        job_title = lines[0][:100]
    else:
        job_title = "Unknown Job"

    conn = sqlite3.connect("database.db")

    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO history
        (job_title, prediction, confidence, fraud_score, risk, job_description)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        job_title,
        result,
        confidence,
        fraud_score,
        risk,
        job_text
    ))

    conn.commit()
    conn.close()


# ============================================
# Home Page
# ============================================

@app.route("/")
def home():
    return render_template("index.html")


# ============================================
# Prediction Page
# ============================================

@app.route("/predict", methods=["POST"])
def predict():

    global latest_result

    job_text = request.form["job_description"]

    result, confidence, risk, reasons, fraud_score = predict_job(job_text)

    save_history(
        job_text,
        result,
        confidence,
        fraud_score,
        risk
    )

    latest_result = {
        "prediction": result,
        "confidence": confidence,
        "fraud_score": fraud_score,
        "risk": risk,
        "reasons": reasons,
        "job_text": job_text
    }

    return render_template(
        "result.html",
        prediction=result,
        confidence=confidence,
        fraud_score=fraud_score,
        risk=risk,
        reasons=reasons,
        job_text=job_text
    )
@app.route("/download_report")
def download_report():

    if not latest_result:
        return "No report available."

    filename = "CareerVerify_Report.pdf"

    doc = SimpleDocTemplate(filename)

    styles = getSampleStyleSheet()
    story = []

    

    # ---------------- Title ----------------

    title = Paragraph(
        "<font size=22><b>Career Verify AI Report</b></font>",
        styles["Title"]
    )

    story.append(title)
    story.append(Spacer(1, 0.3 * inch))

    # ---------------- Summary Table ----------------

    data = [
        ["Prediction", latest_result["prediction"]],
        ["Confidence", f"{latest_result['confidence']}%"],
        ["Fraud Score", f"{latest_result['fraud_score']}/100"],
        ["Risk Level", latest_result["risk"]]
    ]

    table = Table(data, colWidths=[2.2 * inch, 3.3 * inch])

    table.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.darkblue),
        ("TEXTCOLOR", (0,0), (-1,0), colors.white),

        ("BACKGROUND", (0,1), (0,-1), colors.lightgrey),

        ("GRID", (0,0), (-1,-1), 1, colors.black),

        ("FONTNAME", (0,0), (-1,-1), "Helvetica-Bold"),

        ("BOTTOMPADDING", (0,0), (-1,-1), 8),

        ("ALIGN", (0,0), (-1,-1), "CENTER")
    ]))

    story.append(table)
    story.append(Spacer(1, 0.4 * inch))

    # ---------------- Keywords ----------------

    story.append(
        Paragraph(
            "<b>Detected Keywords</b>",
            styles["Heading2"]
        )
    )

    if latest_result["reasons"]:

        keyword_text = ", ".join(latest_result["reasons"])

    else:

        keyword_text = "No significant keywords detected."

    story.append(
        Paragraph(keyword_text, styles["BodyText"])
    )

    story.append(Spacer(1, 0.3 * inch))

    # ---------------- Job Description ----------------

    story.append(
        Paragraph(
            "<b>Job Description</b>",
            styles["Heading2"]
        )
    )

    story.append(
        Paragraph(
            latest_result["job_text"],
            styles["BodyText"]
        )
    )

    story.append(Spacer(1, 0.3 * inch))

    # ---------------- Footer ----------------

    story.append(
        Paragraph(
            "<font color='grey'>Generated by Career Verify AI</font>",
            styles["Italic"]
        )
    )

    doc.build(story)

    return send_file(filename, as_attachment=True)


@app.route("/company")
def company():
    return render_template("company.html")
@app.route("/verify_company", methods=["POST"])
def verify_company_route():

    company_name = request.form["company_name"]
    website = request.form["website"]
    email = request.form["email"]

    score, status, reasons = verify_company(
        company_name,
        website,
        email
    )

    return render_template(
        "company_result.html",
        company_name=company_name,
        website=website,
        email=email,
        score=score,
        status=status,
        reasons=reasons
    )
def verify_company(name, website, email):

    score = 100
    reasons = []

    if not website.startswith("https://"):
        score -= 30
        reasons.append("Website is not secure")

    if "gmail.com" in email or "yahoo.com" in email:
        score -= 25
        reasons.append("Recruiter uses a personal email")

    if ".xyz" in website:
        score -= 20
        reasons.append("Suspicious domain")

    if score >= 80:
        status = "Verified"

    elif score >= 50:
        status = "Needs Manual Review"

    else:
        status = "Suspicious"

    return score, status, reasons
# ============================================
# Run Flask
# ============================================
print(app.url_map)
if __name__ == "__main__":
    app.run(debug=True)