/**
 * CareerVerify Dedicated Master ML Job Verification Reasoning & Calibration Engine
 * Complies with the Master ML Training Specification (v2.5.0-calibrated).
 * 
 * Output Labels:
 * - GENUINE (fake_probability < 0.30)
 * - UNCERTAIN (0.30 <= fake_probability < 0.70)
 * - FAKE (fake_probability >= 0.70)
 */

const { extractJobFeatures } = require("./featureExtractor");

function classifyJobPosting(jobText, metadata = {}) {
  const features = extractJobFeatures(jobText, metadata);
  const cleanText = (jobText || "").toLowerCase().trim();
  const signals = features.stage1Signals || {};

  const evidence_for_fake = [];
  const evidence_for_genuine = [];
  const missing_information = [];

  let rawFraudWeight = 0.05; // baseline prior probability

  // --------------------------------------------------------------------------
  // Tier 1: Very Strong Fraud Signals (High Weight: +0.65 to +0.80 each)
  // --------------------------------------------------------------------------
  if (signals.candidate_payment_required || features.sensitiveRequests.includes("UPFRONT_FEE_DEMAND")) {
    evidence_for_fake.push("Mandatory candidate fee required (application, registration, onboarding, or training deposit)");
    rawFraudWeight += 0.75;
  }
  if (features.sensitiveRequests.includes("EQUIPMENT_CHECK_SCHEME")) {
    evidence_for_fake.push("Demands receiving cashier check or wiring funds back to equipment vendor");
    rawFraudWeight += 0.75;
  }
  if (signals.personal_bank_account_required || features.sensitiveRequests.includes("PERSONAL_BANK_ACCOUNT_MULE")) {
    evidence_for_fake.push("Requires employee to use personal bank account, Zelle, or Venmo for employer transactions");
    rawFraudWeight += 0.80;
  }
  if (signals.package_reshipping || features.sensitiveRequests.includes("PACKAGE_RESHIPPING_SCHEME")) {
    evidence_for_fake.push("Job involves package reshipping or forwarding mail from home");
    rawFraudWeight += 0.80;
  }
  if (signals.crypto_required || features.sensitiveRequests.includes("CRYPTO_TASK_SCHEME")) {
    evidence_for_fake.push("Requires depositing cryptocurrency (USDT) or purchasing task wallet recharges");
    rawFraudWeight += 0.75;
  }
  if (features.sensitiveRequests.includes("PASSWORD_HARVESTING")) {
    evidence_for_fake.push("Demands confidential net banking passwords, PINs, or OTPs");
    rawFraudWeight += 0.80;
  }
  if (features.sensitiveRequests.includes("REMOTE_CONTROL_APP")) {
    evidence_for_fake.push("Instructs installing remote desktop control applications (AnyDesk, TeamViewer, RustDesk)");
    rawFraudWeight += 0.75;
  }
  if (features.sensitiveRequests.includes("GOVERNMENT_ID_HARVESTING")) {
    evidence_for_fake.push("Demands identity card scans (Aadhaar/PAN/SSN/Passport) prior to formal interview or offer");
    rawFraudWeight += 0.40;
  }

  // --------------------------------------------------------------------------
  // Tier 2: Strong Signals (+0.25 to +0.35 each)
  // --------------------------------------------------------------------------
  if (features.domainStatus === "SPOOFED_OR_MOCK") {
    evidence_for_fake.push(`Contact email address '${features.contactEmail}' uses a suspicious or spoofed domain (${features.contactDomain})`);
    rawFraudWeight += 0.50;
  } else if (features.domainStatus === "FREE_PROVIDER" && !features.hasOfficialCareersLink) {
    evidence_for_fake.push(`Claimed enterprise posting lists generic free email (${features.contactEmail}) without official corporate domain`);
    rawFraudWeight += 0.30;
  }

  if (signals.salary_plausibility === "SUSPICIOUS_UNREALISTIC") {
    evidence_for_fake.push(`Compensation of ${features.claimedCompensation} is disproportionately high for ${features.requiredExperienceYears ?? 0} years required experience`);
    rawFraudWeight += 0.35;
  }

  if (signals.job_requirement_consistency === "INCONSISTENT") {
    evidence_for_fake.push("Inconsistent experience and compensation specifications");
    rawFraudWeight += 0.25;
  }

  // --------------------------------------------------------------------------
  // Tier 3: Moderate Signals (+0.10 to +0.20 each)
  // --------------------------------------------------------------------------
  if (signals.communication_risk === "HIGH" || features.hasTelegram || features.hasWhatsApp) {
    if (!features.hasOfficialCareersLink && features.domainStatus !== "CORPORATE_DOMAIN") {
      evidence_for_fake.push("Primary application or interview conducted via informal messaging app (Telegram/WhatsApp)");
      rawFraudWeight += 0.20;
    }
  }

  if (signals.urgency === "HIGH" || cleanText.includes("no interview needed") || cleanText.includes("selected without interview")) {
    evidence_for_fake.push("Employs extreme hiring urgency ('selected without interview', 'act within 24h')");
    rawFraudWeight += 0.15;
  }

  if (features.isGenericAiFiller) {
    evidence_for_fake.push("Job text contains generic AI filler language without verifiable company facts");
    rawFraudWeight += 0.15;
  }

  // --------------------------------------------------------------------------
  // Tier 4: Legitimacy & Hard-Negative Signals (-0.20 to -0.40 each)
  // --------------------------------------------------------------------------
  if (features.domainStatus === "CORPORATE_DOMAIN") {
    evidence_for_genuine.push(`Official corporate email domain verified (@${features.contactDomain})`);
    rawFraudWeight -= 0.35;
  }
  if (features.hasOfficialCareersLink || metadata.isVerifiedDomain) {
    evidence_for_genuine.push("Job posting contains verifiable corporate careers link or job ID");
    rawFraudWeight -= 0.35;
  }
  if (features.hasNegatedFeePolicy) {
    evidence_for_genuine.push("Explicit company policy prohibiting candidate application or registration fees");
    rawFraudWeight -= 0.30;
  }
  if (features.hasCorporateReg) {
    evidence_for_genuine.push("Contains verified Corporate Tax / Registration Identification (CIN, GSTIN, EIN)");
    rawFraudWeight -= 0.25;
  }
  if (features.hasEnterpriseBenefits) {
    evidence_for_genuine.push("Outlines standard enterprise benefits & equal opportunity employer (EOE) statement");
    rawFraudWeight -= 0.20;
  }
  if (features.hasStructuredInterview) {
    evidence_for_genuine.push("References structured technical or managerial interview process");
    rawFraudWeight -= 0.20;
  }
  if (features.hasNda) {
    evidence_for_genuine.push("Confidential client project protected under standard Non-Disclosure Agreement (NDA)");
    rawFraudWeight -= 0.20;
  }
  if (features.hasBackgroundCheck) {
    evidence_for_genuine.push("Standard post-offer employment background check / work authorization requirement");
    rawFraudWeight -= 0.15;
  }
  if (features.companyName && features.companyName.length > 2) {
    evidence_for_genuine.push(`Identified hiring organization: '${features.companyName}'`);
    rawFraudWeight -= 0.10;
  }

  // --------------------------------------------------------------------------
  // Missing Information Inspection
  // --------------------------------------------------------------------------
  if (!features.companyName) {
    missing_information.push("Employer identity cannot be independently established from supplied text.");
  }
  if (features.domainStatus === "NO_EMAIL" && !features.hasOfficialCareersLink) {
    missing_information.push("No corporate email domain or official careers portal URL supplied.");
  }
  if (features.claimedCompensation === null) {
    missing_information.push("No compensation structure or salary range specified.");
  }

  // --------------------------------------------------------------------------
  // Calibrated Probability Calculation & Decision Thresholds
  // --------------------------------------------------------------------------
  // Apply Sigmoid-like Calibration Mapping
  const fake_probability = Math.max(0.01, Math.min(0.99, Math.round((1 / (1 + Math.exp(-4.5 * (rawFraudWeight - 0.38)))) * 100) / 100));
  const genuine_probability = Math.round((1 - fake_probability) * 100) / 100;

  // Master Decision Threshold Matrix (Section 10):
  // fake_probability < 0.30 => GENUINE
  // 0.30 <= fake_probability < 0.70 => UNCERTAIN
  // fake_probability >= 0.70 => FAKE
  let label = "UNCERTAIN";
  let risk_level = "MEDIUM";
  let confidence = 50.0;

  if (fake_probability >= 0.70) {
    label = "FAKE";
    risk_level = fake_probability >= 0.88 ? "CRITICAL" : "HIGH";
    confidence = Math.round(fake_probability * 1000) / 10;
  } else if (fake_probability < 0.30) {
    label = "GENUINE";
    risk_level = fake_probability <= 0.10 ? "LOW" : "MEDIUM";
    confidence = Math.round(genuine_probability * 1000) / 10;
  } else {
    label = "UNCERTAIN";
    risk_level = fake_probability >= 0.50 ? "HIGH" : "MEDIUM";
    confidence = Math.round((1 - Math.abs(fake_probability - 0.5) * 2) * 1000) / 10;
  }

  // --------------------------------------------------------------------------
  // Reasoning Summary Synthesis
  // --------------------------------------------------------------------------
  let reasoning_summary = "";
  if (label === "FAKE") {
    reasoning_summary = `High-confidence recruitment fraud detected (Calibrated Fake Probability: ${Math.round(fake_probability * 100)}%). Primary fraud indicators: ${evidence_for_fake.slice(0, 2).join("; ")}.`;
  } else if (label === "UNCERTAIN") {
    reasoning_summary = `Borderline evidence detected (Calibrated Fake Probability: ${Math.round(fake_probability * 100)}%). The posting exhibits mixed signals (${evidence_for_fake[0] || 'Unverified contact domain'}) alongside missing corporate verification details.`;
  } else {
    reasoning_summary = `Authentic employment signals confirmed (Calibrated Genuine Probability: ${Math.round(genuine_probability * 100)}%). Key authenticity factors: ${evidence_for_genuine.slice(0, 2).join("; ") || "Standard hiring terms and zero fraud demands"}.`;
  }

  return {
    // Exact Output Schema (Section 2)
    label,
    fake_probability,
    genuine_probability,
    confidence,
    risk_level,
    evidence_for_fake,
    evidence_for_genuine,
    missing_information,
    reasoning_summary,
    model_version: "v2.6.0-calibrated",
    
    // Internal Evidence Details
    riskScore: Math.round(fake_probability * 100),
    explanation: reasoning_summary,
    justifications: [
      ...evidence_for_fake.map(e => `[CRITICAL FRAUD SIGNAL] ${e}`),
      ...evidence_for_genuine.map(e => `[VERIFIED AUTHENTIC SIGNAL] ${e}`)
    ],
    evidence: {
      strongestRedFlags: evidence_for_fake,
      strongestGreenFlags: evidence_for_genuine,
      extractedFeatures: features
    }
  };
}

module.exports = { classifyJobPosting };
