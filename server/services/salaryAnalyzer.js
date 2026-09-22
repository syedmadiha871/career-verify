/**
 * CareerVerify AI Salary Anomaly & Realism Analyzer
 */

function analyzeSalaryRealism({ jobTitle, payAmount, payPeriod, experienceLevel }) {
  const titleLower = (jobTitle || "").toLowerCase();
  const period = (payPeriod || "year").toLowerCase();
  const amount = Number(payAmount) || 0;

  let isDataEntryOrSimple = titleLower.includes("data entry") || titleLower.includes("typing") || titleLower.includes("wfh") || titleLower.includes("form filling");
  let isTechOrExecutive = titleLower.includes("engineer") || titleLower.includes("developer") || titleLower.includes("manager") || titleLower.includes("doctor") || titleLower.includes("architect");

  let normalizedAnnualPay = amount;
  if (period === "hour") normalizedAnnualPay = amount * 2080;
  if (period === "day") normalizedAnnualPay = amount * 260;
  if (period === "month") normalizedAnnualPay = amount * 12;

  let risk = "Normal";
  let multiplier = 1.0;
  const warnings = [];

  if (isDataEntryOrSimple) {
    // Normal entry level data entry is around $15-$25/hr ($30k - $50k/yr)
    if (normalizedAnnualPay > 120000) {
      risk = "Extreme Pay Scam Signal";
      multiplier = Math.round((normalizedAnnualPay / 35000) * 10) / 10;
      warnings.push(`Offered pay (~$${Math.round(normalizedAnnualPay).toLocaleString()}/yr) is ${multiplier}x higher than standard market rate for simple data entry tasks.`);
      warnings.push("Unrealistic high payout for entry-level tasks is a classic scam trap used to lure victims into paying registration fees.");
    }
  }

  if (period === "day" && amount >= 400 && isDataEntryOrSimple) {
    risk = "High Scam Risk";
    warnings.push(`Daily payout claim ($${amount}/day) is highly suspicious for non-technical remote work.`);
  }

  if (amount <= 0) {
    return {
      annualPay: 0,
      realismScore: 50,
      risk: "Unspecified",
      warnings: ["No pay details provided."],
    };
  }

  const realismScore = risk === "Extreme Pay Scam Signal" ? 15 : risk === "High Scam Risk" ? 35 : 95;

  return {
    normalizedAnnualPay: Math.round(normalizedAnnualPay),
    realismScore,
    risk,
    warnings,
    multiplier,
  };
}

module.exports = { analyzeSalaryRealism };
