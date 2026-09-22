/**
 * CareerVerify Company Trust & Domain Verification Engine
 */

function verifyCompany(companyName, website, email) {
  let score = 100;
  const reasons = [];

  const nameStr = (companyName || "").trim();
  let websiteStr = (website || "").trim();
  const emailStr = (email || "").trim().toLowerCase();

  // Ensure website has protocol prefix if missing for domain extraction
  if (!websiteStr.startsWith("http://") && !websiteStr.startsWith("https://")) {
    websiteStr = "https://" + websiteStr;
  }

  // 1. Check HTTPS Security
  if (!websiteStr.startsWith("https://")) {
    score -= 25;
    reasons.push("Website is not using secure HTTPS protocol.");
  } else {
    reasons.push("Website utilizes secure HTTPS connection.");
  }

  // 2. Free Email Provider Check
  const freeEmailDomains = [
    "gmail.com",
    "yahoo.com",
    "hotmail.com",
    "outlook.com",
    "icloud.com",
    "aol.com",
    "mail.com",
    "protonmail.com",
    "yandex.com"
  ];

  const emailParts = emailStr.split("@");
  const emailDomain = emailParts.length > 1 ? emailParts[1] : "";

  if (freeEmailDomains.includes(emailDomain)) {
    score -= 25;
    reasons.push(`Recruiter uses personal/free email provider (@${emailDomain}).`);
  }

  // 3. Domain Matching Check
  let websiteDomain = websiteStr
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0];

  if (emailDomain && websiteDomain) {
    if (!emailDomain.endsWith(websiteDomain) && !websiteDomain.endsWith(emailDomain)) {
      score -= 25;
      reasons.push(`Email domain (@${emailDomain}) does not match company domain (${websiteDomain}).`);
    } else {
      reasons.push(`Email domain matches company domain (${websiteDomain}).`);
    }
  }

  // 4. Suspicious TLD Check
  const suspiciousTlds = [".xyz", ".top", ".click", ".site", ".online", ".vip", ".work", ".info", ".gq", ".tk", ".ml"];
  if (suspiciousTlds.some((tld) => websiteDomain.endsWith(tld))) {
    score -= 20;
    reasons.push(`Domain suffix (${websiteDomain.substring(websiteDomain.lastIndexOf("."))}) carries high risk factor.`);
  }

  // 5. Company Name Validity
  if (nameStr.length < 3) {
    score -= 10;
    reasons.push("Company name is unusually short or ambiguous.");
  }

  // Normalize score
  score = Math.max(0, Math.min(100, score));

  // Determine Status
  let status = "Verified";
  if (score >= 80) {
    status = "Verified";
  } else if (score >= 50) {
    status = "Needs Manual Review";
  } else {
    status = "Suspicious";
  }

  return {
    score,
    status,
    reasons,
    companyName: nameStr,
    website: websiteStr,
    email: emailStr,
    websiteDomain,
    emailDomain
  };
}

module.exports = { verifyCompany };
