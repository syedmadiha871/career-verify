/**
 * CareerVerify Advanced Multi-Industry NLP & ML Fraud Detection Engine
 * Integrates the Common-Sense Job Verification Reasoning Layer.
 */

const { classifyJobPosting } = require("./commonSenseClassifier");

function analyzeJobDescription(jobText, metadata = {}) {
  const result = classifyJobPosting(jobText, metadata);

  // Map label to backward compatible fields
  let prediction = "Real Job";
  if (result.label === "FAKE") {
    prediction = "Fake Job";
  } else if (result.label === "SUSPICIOUS") {
    prediction = "Suspicious Job";
  }

  let risk = "Low";
  if (result.riskScore >= 70) risk = "High";
  else if (result.riskScore >= 40) risk = "Medium";

  return {
    // Master ML Specification Output Schema (Section 2)
    label: result.label, // 'GENUINE' | 'FAKE' | 'UNCERTAIN'
    fake_probability: result.fake_probability,
    genuine_probability: result.genuine_probability,
    confidence: result.confidence,
    risk_level: result.risk_level,
    evidence_for_fake: result.evidence_for_fake,
    evidence_for_genuine: result.evidence_for_genuine,
    missing_information: result.missing_information,
    reasoning_summary: result.reasoning_summary,
    model_version: result.model_version || "v2.5.0-calibrated",

    // Backward Compatible Layer
    prediction: result.label === "FAKE" ? "Fake Job" : result.label === "UNCERTAIN" ? "Suspicious Job" : "Real Job",
    fraud_score: Math.round(result.fake_probability * 100),
    risk: result.risk_level === "CRITICAL" || result.risk_level === "HIGH" ? "High" : result.risk_level === "MEDIUM" ? "Medium" : "Low",
    explanation: result.reasoning_summary,
    justifications: result.justifications || [],
    reasons: result.evidence_for_fake.length > 0 ? result.evidence_for_fake : result.evidence_for_genuine,
    evidence: result.evidence,
    breakdown: {
      riskScore: Math.round(result.fake_probability * 100),
      extractedFeatures: result.evidence.extractedFeatures
    }
  };
}

module.exports = { analyzeJobDescription, classifyJobPosting };
