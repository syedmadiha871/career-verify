/**
 * CareerVerify Classifier Evaluation & Metric Benchmark Suite
 * Evaluates the Common-Sense Job Classifier across 30 ground-truth scenarios.
 * Computes: Precision, Recall, F1-Score, 4x4 Confusion Matrix, and Per-Class Metrics.
 */

const { classifyJobPosting } = require("../services/commonSenseClassifier");

const EVALUATION_DATASET = [
  // =========================================================================
  // 1. OBVIOUS POSITIVES (Ground Truth: GENUINE)
  // =========================================================================
  {
    id: 1,
    groundTruth: "GENUINE",
    description: "Verified tech company job posting with official domain",
    text: `Senior Software Engineer at Stripe (https://stripe.com/jobs)
San Francisco, CA (Hybrid)
Compensation: $165,000 - $195,000 + Equity.
Requirements: 5+ years experience with React, Node.js, distributed systems, and PostgreSQL. Bachelor degree required.
Benefits: Comprehensive health insurance, 401k matching, paid time off.
Contact: careers@stripe.com`
  },
  {
    id: 2,
    groundTruth: "GENUINE",
    description: "Registered Nurse position at hospital with official domain",
    text: `Registered Nurse (ICU) - Cleveland Clinic
Cleveland, OH | Full-time
Salary: $82,000 - $95,000 annually.
Qualifications: 2+ years ICU nursing experience, BSN degree, active RN license.
Responsibilities: Patient care, clinical documentation, collaboration with medical staff.
Contact: nursing-recruitment@clevelandclinic.org | Job ID: CC-RN-992`
  },
  {
    id: 3,
    groundTruth: "GENUINE",
    description: "Graphic Designer posting with explicit fee disclaimer",
    text: `Lead Graphic Designer at Creative Media Inc.
New York, NY (Remote)
Salary: $75,000 - $90,000 per year.
Requirements: 4+ years experience with Figma, Adobe Creative Suite, UI/UX, and brand identity.
Note: Creative Media Inc. NEVER asks candidates for any registration fee, application deposit, or equipment payments under any circumstances.
Apply at: careers@creativemediainc.com`
  },
  {
    id: 4,
    groundTruth: "GENUINE",
    description: "Financial Analyst position with standard corporate benefits",
    text: `Senior Financial Analyst - Deloitte (https://www2.deloitte.com/careers)
Chicago, IL | Full-time
Compensation: $110,000 - $130,000 annually.
Qualifications: 4+ years in financial modeling, auditing, accounting, and tax compliance. CPA or Master degree preferred.
Benefits: Health, dental, 401k, PTO.
Contact: uscareers@deloitte.com`
  },
  {
    id: 5,
    groundTruth: "GENUINE",
    description: "High-paying legitimate executive role with high experience requirement",
    text: `VP of Infrastructure Engineering at Cloudflare
Austin, TX (Remote)
Compensation: $240,000 - $310,000 annually + Equity.
Requirements: 12+ years of software engineering leadership, cloud infrastructure, Kubernetes, and Golang.
Official Careers Link: https://www.cloudflare.com/careers/job-4882
Contact: executive-recruiting@cloudflare.com`
  },
  {
    id: 6,
    groundTruth: "GENUINE",
    description: "Legal Counsel position at corporate office",
    text: `Corporate Legal Counsel - Microsoft Corporation
Redmond, WA | Full-time
Qualifications: JD from accredited law school, 6+ years in corporate law, IP compliance, and contract negotiation.
Compensation: $185,000 - $220,000 + bonus.
Contact: legal-careers@microsoft.com`
  },
  {
    id: 7,
    groundTruth: "GENUINE",
    description: "Content Marketing Specialist position",
    text: `Content Marketing Manager - HubSpot
Boston, MA (Remote)
Salary: $95,000 - $115,000.
Requirements: 3+ years in SEO, content marketing, copywriting, and B2B lead generation.
Official Portal: https://www.hubspot.com/careers`
  },
  {
    id: 8,
    groundTruth: "GENUINE",
    description: "Human Resources Specialist position",
    text: `HR Business Partner - Target Corporation
Minneapolis, MN | Full-time
Salary: $88,000 - $105,000.
Requirements: 4+ years talent acquisition, payroll management, and employee relations.
Contact: target-careers@target.com`
  },

  // =========================================================================
  // 2. OBVIOUS NEGATIVES (Ground Truth: FAKE)
  // =========================================================================
  {
    id: 9,
    groundTruth: "FAKE",
    description: "Registration fee extortion scam",
    text: `URGENT WORK FROM HOME DATA ENTRY! Earn $1000 daily no experience needed! Immediate hiring. Must pay a small refundable registration fee of $150 to activate employee portal. Contact HR on Telegram @scam_jobs_fast.`
  },
  {
    id: 10,
    groundTruth: "FAKE",
    description: "Fake check equipment vendor scheme",
    text: `Remote Data Entry Specialist at Apex Logistics. We will send a cashier check of $2,500 for home office equipment. Candidate must deposit check and wire money back to our designated equipment vendor.`
  },
  {
    id: 11,
    groundTruth: "FAKE",
    description: "Crypto task wallet recharge scheme",
    text: `Crypto Task Assistant! Earn $500 daily. Guaranteed income. Deposit USDT into task wallet to reach VIP tier and unlock daily payout.`
  },
  {
    id: 12,
    groundTruth: "FAKE",
    description: "Net banking password & credential harvesting",
    text: `Selection Without Interview! Congratulations, your profile was selected for Data Analyst. Send Aadhaar card, PAN card, and Net Banking login credentials to hr_recruiter99@gmail.com for instant onboarding.`
  },
  {
    id: 13,
    groundTruth: "FAKE",
    description: "Spoofed email domain (.example) + compensation anomaly",
    text: `Senior Quantum Blockchain Engineer
QuantumRiver Technologies | Bengaluru, India
Compensation: ₹1.4 crore annually for 2+ years experience.
Contact: recruitment@quantumriver-careers.example`
  },
  {
    id: 14,
    groundTruth: "FAKE",
    description: "Hyped buzzword trap with software payment demand",
    text: `Senior Web5 Quantum Consensus Architect. Salary: $200,000. Candidate must pay for software license before starting work.`
  },
  {
    id: 15,
    groundTruth: "FAKE",
    description: "Spoofed company careers domain with upfront deposit",
    text: `Remote Operations Assistant at Apple (App1e-careers.xyz). Immediate selection. Pay ₹2,500 laptop delivery insurance fee via UPI to @apple_hr_pay.`
  },
  {
    id: 16,
    groundTruth: "FAKE",
    description: "Telegram-only text interview with immediate fee requirement",
    text: `Virtual Assistant Job. Salary $50/hr. No resume needed. Interview conducted via Telegram chat @hr_fast_hire. Mandatory training deposit required.`
  },

  // =========================================================================
  // 3. AMBIGUOUS / SPARSE / GENERIC CASES (Ground Truth: INSUFFICIENT_EVIDENCE)
  // =========================================================================
  {
    id: 17,
    groundTruth: "INSUFFICIENT_EVIDENCE",
    description: "Short 2-line generic posting without contact or company details",
    text: `Looking for a hardworking remote virtual assistant to manage schedules and email correspondence. Flexible hours.`
  },
  {
    id: 18,
    groundTruth: "INSUFFICIENT_EVIDENCE",
    description: "Generic AI boilerplate text lacking specific company facts",
    text: `We are seeking a dynamic professional to revolutionize our paradigm shift and join an innovative team for unprecedented growth. Passionate individuals with strong communication skills are invited to apply.`
  },
  {
    id: 19,
    groundTruth: "INSUFFICIENT_EVIDENCE",
    description: "Unfamiliar small business listing with no website or email",
    text: `Part-time Bookkeeper needed for local retail store in Dallas, TX. Flexible weekend hours. Experience with QuickBooks required.`
  },
  {
    id: 20,
    groundTruth: "INSUFFICIENT_EVIDENCE",
    description: "Short social media post snippet",
    text: `Hiring Python Developer for freelance project. DM for details.`
  },
  {
    id: 21,
    groundTruth: "INSUFFICIENT_EVIDENCE",
    description: "Ambiguous polished job text without verifiable company source",
    text: `Frontend React Developer wanted. 2+ years experience. Competitive compensation offered. Great work culture.`
  },
  {
    id: 22,
    groundTruth: "INSUFFICIENT_EVIDENCE",
    description: "Vague data entry posting without payment demands or company links",
    text: `Remote Data Entry Clerk. Typing speed 50 WPM. Basic Excel knowledge required. Flexible timing.`
  },
  {
    id: 23,
    groundTruth: "INSUFFICIENT_EVIDENCE",
    description: "Short flyer text snippet",
    text: `Walk-in interview for Customer Support Executives on Saturday 10 AM. Bring updated resume.`
  },
  {
    id: 24,
    groundTruth: "INSUFFICIENT_EVIDENCE",
    description: "Generic marketing posting without links or recruiter contact",
    text: `Social Media Intern needed for growing startup. Assist with Instagram and TikTok content creation.`
  },

  // =========================================================================
  // 4. WARNING SIGN CASES (Ground Truth: SUSPICIOUS)
  // =========================================================================
  {
    id: 25,
    groundTruth: "SUSPICIOUS",
    description: "Claimed major enterprise role listing generic @gmail address",
    text: `Senior Cloud Architect at IBM. Salary: $150,000. Requirements: AWS, Docker, Kubernetes. Send resume to ibm_hr_recruiter_john@gmail.com.`
  },
  {
    id: 26,
    groundTruth: "SUSPICIOUS",
    description: "Text-only Telegram interview demand without payment fee",
    text: `Remote Operations Manager at Global Trade LLC. Salary $45/hr. Contact HR manager exclusively via Telegram chat ID @global_trade_hr.`
  },
  {
    id: 27,
    groundTruth: "SUSPICIOUS",
    description: "Claimed Google hiring via WhatsApp message broadcast",
    text: `Google HR is hiring remote Data Entry Specialists. High daily payout. Contact us on WhatsApp to receive task details.`
  },
  {
    id: 28,
    groundTruth: "SUSPICIOUS",
    description: "Unusually high compensation for entry-level work without official domain",
    text: `Junior Copywriter at Unknown Agency. Salary: $120,000 per year. No experience required. Apply to recruiter@agency-jobs.xyz`
  },
  {
    id: 29,
    groundTruth: "SUSPICIOUS",
    description: "No interview selection claim on generic email",
    text: `Congratulations! Your resume was selected for Junior Web Developer. No interview needed. Contact hr@webdev-hiring.xyz to accept offer.`
  },
  {
    id: 30,
    groundTruth: "SUSPICIOUS",
    description: "Claimed Amazon recruiter using @yahoo email",
    text: `Amazon Fulfillment Logistics is hiring Customer Support Lead. Send resume to amazon_recruiter_dept@yahoo.com`
  }
];

function runEvaluation() {
  const LABELS = ["GENUINE", "SUSPICIOUS", "FAKE", "INSUFFICIENT_EVIDENCE"];

  // 4x4 Confusion Matrix Initialization
  const confusionMatrix = {};
  LABELS.forEach(actual => {
    confusionMatrix[actual] = {};
    LABELS.forEach(pred => {
      confusionMatrix[actual][pred] = 0;
    });
  });

  let correctCount = 0;

  EVALUATION_DATASET.forEach(item => {
    const res = classifyJobPosting(item.text);
    const predicted = res.label;
    const actual = item.groundTruth;

    confusionMatrix[actual][predicted] += 1;
    if (actual === predicted) {
      correctCount += 1;
    }
  });

  const total = EVALUATION_DATASET.length;
  const overallAccuracy = (correctCount / total) * 100;

  // Calculate Per-Class Precision, Recall, F1-Score
  const perClassMetrics = {};

  LABELS.forEach(label => {
    let tp = confusionMatrix[label][label];
    let fp = 0;
    let fn = 0;

    LABELS.forEach(other => {
      if (other !== label) {
        fp += confusionMatrix[other][label];
        fn += confusionMatrix[label][other];
      }
    });

    const precision = tp + fp > 0 ? (tp / (tp + fp)) * 100 : 0;
    const recall = tp + fn > 0 ? (tp / (tp + fn)) * 100 : 0;
    const f1 = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    perClassMetrics[label] = {
      tp, fp, fn,
      precision: Math.round(precision * 10) / 10,
      recall: Math.round(recall * 10) / 10,
      f1: Math.round(f1 * 10) / 10
    };
  });

  return {
    totalScenarios: total,
    correctCount,
    overallAccuracy: Math.round(overallAccuracy * 10) / 10,
    confusionMatrix,
    perClassMetrics
  };
}

// Execute and print evaluation report when run directly
if (require.main === module) {
  console.log("=========================================================================");
  console.log("      CAREERVERIFY COMMON-SENSE CLASSIFIER EVALUATION REPORT             ");
  console.log("=========================================================================\n");

  const results = runEvaluation();

  console.log(`Total Evaluation Scenarios: ${results.totalScenarios}`);
  console.log(`Overall Accuracy: ${results.overallAccuracy}% (${results.correctCount}/${results.totalScenarios} Correct)\n`);

  console.log("--- 4x4 CONFUSION MATRIX ---");
  console.log("Actual \\ Predicted       | GENUINE | SUSPICIOUS | FAKE | INSUFFICIENT_EVIDENCE");
  console.log("-------------------------+---------+------------+------+----------------------");
  Object.keys(results.confusionMatrix).forEach(actual => {
    const row = results.confusionMatrix[actual];
    const padAct = actual.padEnd(23);
    const padGen = String(row["GENUINE"]).padStart(7);
    const padSus = String(row["SUSPICIOUS"]).padStart(10);
    const padFak = String(row["FAKE"]).padStart(4);
    const padIns = String(row["INSUFFICIENT_EVIDENCE"]).padStart(20);
    console.log(`${padAct} | ${padGen} | ${padSus} | ${padFak} | ${padIns}`);
  });

  console.log("\n--- PER-CLASS METRICS ---");
  Object.keys(results.perClassMetrics).forEach(label => {
    const m = results.perClassMetrics[label];
    console.log(`Label: ${label.padEnd(22)} -> Precision: ${String(m.precision + '%').padStart(6)} | Recall: ${String(m.recall + '%').padStart(6)} | F1-Score: ${String(m.f1 + '%').padStart(6)}`);
  });
  console.log("\n=========================================================================");
}

module.exports = { runEvaluation, EVALUATION_DATASET };
