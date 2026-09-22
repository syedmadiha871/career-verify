/**
 * CareerVerify Feature Extraction Engine
 * Extracts structured properties from raw job description text and metadata.
 */

const NEGATION_REGEX = /\b(no|never|not|without|free of|don't|do not|does not|neither|zero|prohibited|no requirement)\b/i;

function isNegated(text, word) {
  const lowerText = text.toLowerCase();
  const lowerWord = word.toLowerCase();
  const index = lowerText.indexOf(lowerWord);
  if (index === -1) return false;

  const rawSnippet = lowerText.slice(Math.max(0, index - 45), index);
  // Restrict negation checking to the current sentence/clause
  const clauseIndex = Math.max(
    rawSnippet.lastIndexOf("."),
    rawSnippet.lastIndexOf("!"),
    rawSnippet.lastIndexOf("?"),
    rawSnippet.lastIndexOf("\n")
  );
  const snippetBefore = clauseIndex !== -1 ? rawSnippet.slice(clauseIndex + 1) : rawSnippet;
  return NEGATION_REGEX.test(snippetBefore);
}

function extractJobFeatures(jobText, metadata = {}) {
  const text = (jobText || "").trim();
  const clean = text.toLowerCase();

  // 1. Extract Company Name
  let companyName = metadata.companyName || null;
  if (!companyName) {
    const compMatch = text.match(/(?:at|company|employer|organization|hirer):\s*([A-Z0-9\s&.,'-]{2,40})/i) ||
                      text.match(/([A-Z0-9\s&.,'-]{3,35})\s+(?:is seeking|is hiring|looking for|invites applications)/i) ||
                      text.match(/^([A-Z0-9\s&.,'-]{3,30})\s*\|\s*/);
    if (compMatch && compMatch[1]) {
      companyName = compMatch[1].trim();
    }
  }

  // 2. Extract Job Title
  let jobTitle = metadata.jobTitle || null;
  if (!jobTitle) {
    const titleMatch = text.match(/(?:position|role|title|hiring for):\s*([A-Z0-9\s&/'-]{3,40})/i) ||
                       text.match(/^([A-Z0-9\s&/'-]{3,40})\n/i);
    if (titleMatch && titleMatch[1]) {
      jobTitle = titleMatch[1].trim();
    }
  }

  // 3. Extract Location & Remote Status
  const isRemote = clean.includes("remote") || clean.includes("work from home") || clean.includes("wfh");
  const locMatch = text.match(/(?:location|city|country|based in):\s*([A-Z0-9\s,.-]{2,35})/i);
  const location = locMatch ? locMatch[1].trim() : (isRemote ? "Remote" : "Unspecified");

  // 4. Extract Claimed Compensation & Currency
  let claimedCompensation = null;
  let numericSalaryMax = 0;
  const salMatch = text.match(/(?:salary|compensation|pay|rate):\s*([^\n.,]{3,40})/i) ||
                   text.match(/(\$\s*\d+[\d,]*|\b\d+[\d,]*\s*(?:usd|lakh|crore|k|eur|gbp|inr))\b/i) ||
                   text.match(/(₹\s*[\d.]+\s*(?:lakh|crore)|₹\s*[\d,]+)/i);

  if (salMatch) {
    claimedCompensation = salMatch[0].trim();
    if (clean.includes("crore")) {
      const cr = parseFloat(clean.match(/([\d.]+)\s*crore/)?.[1] || "0");
      numericSalaryMax = cr * 120000;
    } else if (clean.includes("lakh")) {
      const lk = parseFloat(clean.match(/([\d.]+)\s*lakh/)?.[1] || "0");
      numericSalaryMax = lk * 1200;
    } else if (clean.includes("$")) {
      const usd = parseFloat(clean.match(/\$\s*([\d,]+)/)?.[1]?.replace(/,/g, "") || "0");
      numericSalaryMax = usd;
    }
  }

  // 5. Extract Required Experience (Years)
  let requiredExperienceYears = null;
  const expMatch = clean.match(/(\d+)\s*\+?\s*(?:-\s*\d+\s*)?(?:years?|yrs?)(?:\s+of\s+experience)?/) ||
                   clean.match(/(?:experience|required):\s*(\d+)\s*\+?\s*(?:years?|yrs?)/);
  if (expMatch) {
    requiredExperienceYears = parseInt(expMatch[1], 10);
  } else if (clean.includes("no experience") || clean.includes("fresher") || clean.includes("entry level")) {
    requiredExperienceYears = 0;
  }

  // 6. Extract Contact Channels & Email Domains
  const emails = text.match(/[\w.-]+@[\w.-]+\.[a-zA-Z]{2,}/g) || [];
  const contactEmail = emails[0] || null;
  let contactDomain = null;
  let domainStatus = "NO_EMAIL";

  if (contactEmail) {
    contactDomain = contactEmail.split("@")[1]?.toLowerCase() || "";
    if (/\.(example|test|invalid|xyz|top|click|tk|ml|site|online|vip)$/.test(contactDomain) || /-careers\./.test(contactDomain) || /-jobs\./.test(contactDomain) || /-hiring\./.test(contactDomain)) {
      domainStatus = "SPOOFED_OR_MOCK";
    } else if (["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "aol.com"].includes(contactDomain)) {
      domainStatus = "FREE_PROVIDER";
    } else {
      domainStatus = "CORPORATE_DOMAIN";
    }
  }

  // Telegram & WhatsApp detection (Fix false positive on standard email @ symbol)
  const hasTelegram = clean.includes("telegram") || clean.includes("t.me/") || clean.includes("telegram.me/") || /\b@\w*_?(hr|recruiter|jobs?|careers?)\b/i.test(text);
  const hasWhatsApp = clean.includes("whatsapp") || clean.includes("wa.me/");

  // 7. Extract Sensitive Requests & Red Flag Operations (With Proximity Regex & Negation Check!)
  const sensitiveRequests = [];
  
  // Upfront Fee Trap (Flexible regex matching words inserted between registration/application and fee/deposit)
  const feeRegex = /\b(registration|processing|application|training|portal|setup|badge|onboarding|verification|security)\b[\w\s]{0,35}\b(fee|charge|deposit|payment|cost)\b/i;
  const feeKeywords = ["registration fee", "processing fee", "application fee", "training fee", "portal charge", "security deposit", "courier charge", "software setup fee", "id badge fee", "onboarding fee", "refundable deposit"];
  const hasFee = feeRegex.test(clean) || feeKeywords.some(kw => clean.includes(kw));
  if (hasFee && !isNegated(text, "fee") && !isNegated(text, "charge") && !isNegated(text, "payment") && !isNegated(text, "deposit")) {
    sensitiveRequests.push("UPFRONT_FEE_DEMAND");
  }

  // Fake Check / Equipment Wire Loop
  const checkKeywords = ["cashier check", "cashier's check", "buy equipment from vendor", "wire money back", "send a check", "vendor check", "paper check"];
  const hasCheck = checkKeywords.some(kw => clean.includes(kw));
  if (hasCheck && !checkKeywords.some(kw => isNegated(text, kw))) {
    sensitiveRequests.push("EQUIPMENT_CHECK_SCHEME");
  }

  // Crypto / Task Wallet Scheme
  const cryptoKeywords = ["crypto wallet", "usdt", "task recharge", "deposit crypto", "task portal wallet", "vip tier deposit"];
  const hasCrypto = cryptoKeywords.some(kw => clean.includes(kw));
  if (hasCrypto && !cryptoKeywords.some(kw => isNegated(text, kw))) {
    sensitiveRequests.push("CRYPTO_TASK_SCHEME");
  }

  // Password / OTP Harvesting
  const pwdKeywords = ["net banking password", "share otp", "share pin", "banking password", "cvv number"];
  const hasPwd = pwdKeywords.some(kw => clean.includes(kw));
  if (hasPwd && !pwdKeywords.some(kw => isNegated(text, kw))) {
    sensitiveRequests.push("PASSWORD_HARVESTING");
  }

  // Remote Control Desktop App (AnyDesk, TeamViewer, RustDesk)
  const remoteKeywords = ["anydesk", "teamviewer", "rustdesk", "quicksupport"];
  const hasRemoteApp = remoteKeywords.some(kw => clean.includes(kw));
  if (hasRemoteApp && !remoteKeywords.some(kw => isNegated(text, kw))) {
    sensitiveRequests.push("REMOTE_CONTROL_APP");
  }

  // Identity Theft / Government ID Scan Demands
  const idKeywords = ["send aadhaar", "send pan card", "send ssn", "upload passport scan", "front and back of aadhaar"];
  const hasIdReq = idKeywords.some(kw => clean.includes(kw));
  if (hasIdReq && !idKeywords.some(kw => isNegated(text, kw))) {
    sensitiveRequests.push("GOVERNMENT_ID_HARVESTING");
  }

  // Personal Bank Account / Zelle / Venmo / Money Mule Operations
  const bankMuleRegex = /\b(personal|your own)\b[\w\s]{0,35}\b(bank account|zelle|venmo|cash app|paypal|account)\b/i;
  const bankMuleKeywords = ["personal bank account", "receive money on behalf", "use your bank account", "transaction verification using personal", "process payments on your personal account", "cash forwarding", "personal zelle", "personal venmo"];
  const hasBankMule = bankMuleRegex.test(clean) || bankMuleKeywords.some(kw => clean.includes(kw));
  if (hasBankMule && !bankMuleKeywords.some(kw => isNegated(text, kw))) {
    sensitiveRequests.push("PERSONAL_BANK_ACCOUNT_MULE");
  }

  // Reshipping Packages / Mail Mule Scheme
  const reshippingRegex = /\b(repackag|reship|package|parcel|courier)\b[\w\s]{0,35}\b(forward|dispatch|international|inspect|ship|courier)\b/i;
  const reshippingKeywords = ["reshipping packages", "receive and forward packages", "package forwarding", "shipping agent at home", "forward parcels", "repackage items"];
  const hasReshipping = reshippingRegex.test(clean) || reshippingKeywords.some(kw => clean.includes(kw));
  if (hasReshipping && !reshippingKeywords.some(kw => isNegated(text, kw))) {
    sensitiveRequests.push("PACKAGE_RESHIPPING_SCHEME");
  }

  // Negated Fee Policy Disclaimer Signal
  const hasNegatedFeePolicy = (clean.includes("registration fee") || clean.includes("application fee") || clean.includes("deposit") || clean.includes("no fees")) && 
                              (isNegated(text, "registration fee") || isNegated(text, "application fee") || isNegated(text, "fee") || isNegated(text, "deposit") || clean.includes("never charge") || clean.includes("no fee required"));

  // Hard Negative Context Indicators (NDA, Background Check after Offer)
  const hasNda = clean.includes("nda") || clean.includes("non-disclosure agreement") || clean.includes("confidential client");
  const hasBackgroundCheck = clean.includes("background check") || clean.includes("work authorization") || clean.includes("reference check");

  // 8. Official Source / Careers Link Verification
  const urlMatch = text.match(/https?:\/\/[\w.-]+\.[a-zA-Z]{2,}\S*/g) || [];
  const hasOfficialCareersLink = urlMatch.some(u => !u.includes("telegram") && !u.includes("whatsapp") && !u.includes("bit.ly") && !u.includes("t.me")) ||
                                 Boolean(metadata.sourceUrl) ||
                                 clean.includes("official careers portal") ||
                                 clean.includes("job id:");

  // 9. Enterprise Legitimacy Indicators
  const hasCorporateReg = clean.includes("cin:") || clean.includes("gstin:") || clean.includes("ein:") || clean.includes("cik:") || clean.includes("tax registration");
  const hasEnterpriseBenefits = clean.includes("401(k)") || clean.includes("401k") || clean.includes("health insurance") || clean.includes("medical insurance") || clean.includes("paid time off") || clean.includes("equal opportunity employer") || clean.includes("eoe");
  const hasStructuredInterview = clean.includes("technical interview") || clean.includes("system design") || clean.includes("code review") || clean.includes("hiring manager") || clean.includes("panel interview");

  // 10. Generic AI Filler / Vagueness Score
  const genericAiPhrases = [
    "dynamic professional", "revolutionize", "paradigm shift", "synergy",
    "unprecedented growth", "passionate individual", "exciting opportunity to join"
  ];
  let aiPhraseCount = 0;
  genericAiPhrases.forEach(p => { if (clean.includes(p)) aiPhraseCount++; });
  const isGenericAiFiller = aiPhraseCount >= 2 && !companyName && !hasOfficialCareersLink;

  // 11. 10 Structured Risk Extraction Signals (Stage 1 Output)
  const candidate_payment_required = sensitiveRequests.includes("UPFRONT_FEE_DEMAND") || sensitiveRequests.includes("EQUIPMENT_CHECK_SCHEME");
  const personal_bank_account_required = sensitiveRequests.includes("PERSONAL_BANK_ACCOUNT_MULE");
  const crypto_required = sensitiveRequests.includes("CRYPTO_TASK_SCHEME");
  const package_reshipping = sensitiveRequests.includes("PACKAGE_RESHIPPING_SCHEME");
  const premature_id_request = sensitiveRequests.includes("PASSWORD_HARVESTING") || sensitiveRequests.includes("REMOTE_CONTROL_APP") || sensitiveRequests.includes("GOVERNMENT_ID_HARVESTING");
  const employer_identified = Boolean(companyName || domainStatus === "CORPORATE_DOMAIN" || hasOfficialCareersLink);
  const salary_plausibility = (numericSalaryMax > 120000 && requiredExperienceYears !== null && requiredExperienceYears <= 2 && !employer_identified) ? "SUSPICIOUS_UNREALISTIC" : "NORMAL";
  const urgency = (clean.includes("24 hours") || clean.includes("selected today") || clean.includes("start tomorrow") || clean.includes("act now")) ? "HIGH" : "LOW";
  const communication_risk = (hasTelegram || hasWhatsApp) && !hasOfficialCareersLink && domainStatus !== "CORPORATE_DOMAIN" ? "HIGH" : "LOW";
  const job_requirement_consistency = (numericSalaryMax > 150000 && requiredExperienceYears === 0) ? "INCONSISTENT" : "HIGH";

  return {
    companyName,
    jobTitle,
    location,
    isRemote,
    claimedCompensation,
    numericSalaryMax,
    requiredExperienceYears,
    contactEmail,
    contactDomain,
    domainStatus,
    hasTelegram,
    hasWhatsApp,
    sensitiveRequests,
    hasNegatedFeePolicy,
    hasOfficialCareersLink,
    hasCorporateReg,
    hasEnterpriseBenefits,
    hasStructuredInterview,
    hasNda,
    hasBackgroundCheck,
    isGenericAiFiller,
    textLength: text.length,
    // Stage 1 Extracted Risk Signals
    stage1Signals: {
      candidate_payment_required,
      personal_bank_account_required,
      crypto_required,
      package_reshipping,
      premature_id_request,
      employer_identified,
      salary_plausibility,
      urgency,
      communication_risk,
      job_requirement_consistency
    }
  };
}

module.exports = { extractJobFeatures };
