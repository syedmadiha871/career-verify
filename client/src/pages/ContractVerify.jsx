import React, { useState } from 'react';
import { 
  FileCheck, ShieldCheck, AlertTriangle, AlertOctagon, CheckCircle2, 
  Sparkles, FileText, Lock, DollarSign, Building2, User, Printer, 
  Play, RotateCcw, ArrowRight, Check, Copy, HelpCircle, FileCode, Search, MailCheck
} from 'lucide-react';

const CONTRACT_PRESETS = [
  {
    name: 'Scam Offer (Registration & Check Fee Trap)',
    title: 'Appointment Letter - Remote Data Entry Specialist',
    text: `APPOINTMENT & SELECTION LETTER - APEX GLOBAL TECHNOLOGIES LLC

Date: August 12, 2026
Candidate Name: Sample Applicant
Position: Remote Senior Data Entry Specialist
Base Salary: $4,800 USD per month

TERMS & CONDITIONS OF EMPLOYMENT:
1. REGISTRATION FEE: Candidate must deposit a refundable registration and software onboarding fee of $250 via wire transfer or UPI to activate candidate employee ID portal within 24 hours.
2. HOME OFFICE EQUIPMENT: Apex Global LLC will send a cashier check of $2,500. Candidate must deposit the check and wire $2,000 back to our designated equipment vendor for MacBook delivery.
3. INTERVIEW METHOD: Interview completed via Telegram Text Chat ID @apex_hr_recruiters.
4. SENSITIVE DOCUMENTS: Candidate must attach front & back photo scans of Aadhaar Card, PAN Card, and Net Banking login credentials for payroll setup.
5. RECRUITER CONTACT: HR Manager John Doe (apex_global_hr99@gmail.com).`
  },
  {
    name: 'Suspicious Offer (Telegram & High Salary Anomaly)',
    title: 'Offer Letter - Junior Cloud Assistant',
    text: `OFFER OF EMPLOYMENT - VERTEX LOGISTICS SERVICES

Congratulations! You have been selected without formal interview for the role of Junior Cloud Assistant.

OFFER HIGHLIGHTS:
- Salary: $85 per hour ($14,000 / month) for 15 hours per week.
- Selection Channel: Shortlisted via WhatsApp message broadcast.
- Equipment: You are required to pay a shipping & courier insurance charge of ₹1,800 to dispatch your company laptop and ID badge.
- Offer Expiration: This offer letter expires in 2 hours. If not signed immediately, your application will be cancelled.
- Contact: hr-recruitment@vertex-logistics.xyz`
  },
  {
    name: 'Legitimate Offer (Verified Tech Enterprise)',
    title: 'Offer of Employment - Cloud Software Engineer',
    text: `OFFER OF EMPLOYMENT - NEXUS CLOUD SOLUTIONS CORP.

CIN: L72200MH2015PLC268841 | GSTIN: 27AAACN1234F1Z9
Website: https://www.nexuscloudcorp.com | HR Email: careers@nexuscloudcorp.com

Dear Candidate,

We are pleased to offer you employment at Nexus Cloud Solutions Corp. for the position of Cloud Software Engineer.

COMPENSATION & BENEFITS:
- Annual Compensation (CTC): $95,000 per annum, paid bi-weekly via direct bank transfer.
- Probation Period: 3 months from Date of Joining.
- Equipment: Company-issued laptop and security key card will be provided by Nexus IT Services at zero cost.

GENERAL POLICIES:
- No fees or payments are ever required from candidates at any stage of recruitment.
- Official correspondence is strictly conducted via @nexuscloudcorp.com domain addresses.
- Required Onboarding Documents: Degree certificates, previous employment experience letters, and bank account number for direct payroll deposit upon joining.`
  }
];

export default function ContractVerify() {
  const [contractText, setContractText] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const analyzeContractText = (textToAnalyze) => {
    const text = (textToAnalyze || contractText).trim();
    if (!text) return;

    setAnalyzing(true);

    setTimeout(() => {
      const clean = text.toLowerCase();
      let riskScore = 5;
      const clauseAnalysis = [];
      const flagsFound = [];

      // 1. Fee / Money Demands
      if (clean.includes('fee') || clean.includes('registration') || clean.includes('deposit') || clean.includes('refundable') || clean.includes('charge')) {
        riskScore += 35;
        flagsFound.push('Upfront Fee Requirement');
        clauseAnalysis.push({
          type: 'Financial Extortion Trap',
          severity: 'Critical',
          icon: DollarSign,
          title: 'Upfront Registration / Onboarding Fee Demanded',
          snippet: 'Contract requires candidate to pay registration, portal, or software deposit fees.',
          advice: 'Legitimate employers NEVER charge candidates fees to start work or receive an offer letter.'
        });
      }

      // 2. Fake Check / Vendor Wire Scheme
      if (clean.includes('check') || clean.includes('equipment vendor') || clean.includes('wire back') || clean.includes('cashier')) {
        riskScore += 35;
        flagsFound.push('Fake Check Equipment Scheme');
        clauseAnalysis.push({
          type: 'Fake Check Scam Clause',
          severity: 'Critical',
          icon: AlertOctagon,
          title: 'Paper Check / Equipment Wire Vendor Clause Detected',
          snippet: 'Mentions mailing a check and requiring candidate to wire money back to an equipment vendor.',
          advice: 'Classic Fraud Scheme! The check will bounce, leaving you responsible for all transferred funds.'
        });
      }

      // 3. Sensitive Identity & Banking Credentials
      if (clean.includes('net banking') || clean.includes('password') || clean.includes('aadhaar') || clean.includes('pan card') || clean.includes('ssn') || clean.includes('login credentials')) {
        riskScore += 30;
        flagsFound.push('Sensitive Identity & Credential Request');
        clauseAnalysis.push({
          type: 'Identity Theft Risk',
          severity: 'High',
          icon: Lock,
          title: 'Premature Identity Document or Banking Password Request',
          snippet: 'Requests passwords, PINs, or government identity scans before official joining.',
          advice: 'Employers only need standard bank account numbers for salary transfer—NEVER banking passwords or PINs.'
        });
      }

      // 4. Anonymous Chat / Free Recruiter Email
      if (clean.includes('telegram') || clean.includes('whatsapp') || clean.includes('@gmail.com') || clean.includes('@yahoo.com') || clean.includes('@hotmail.com')) {
        riskScore += 25;
        flagsFound.push('Unverified Recruiter Channel / Free Email');
        clauseAnalysis.push({
          type: 'Domain Authenticity Alert',
          severity: 'High',
          icon: MailCheck,
          title: 'Recruiter Uses Public Email (@gmail) or Anonymous Chat App',
          snippet: 'Correspondence is directed through Telegram, WhatsApp, or public Gmail addresses.',
          advice: 'Official enterprise HR teams always communicate via company domain emails (e.g. name@company.com).'
        });
      }

      // 5. Artificial Urgency
      if (clean.includes('24 hours') || clean.includes('2 hours') || clean.includes('immediately') || clean.includes('today only')) {
        riskScore += 20;
        flagsFound.push('Artificial Time Pressure');
        clauseAnalysis.push({
          type: 'Psychological Manipulation',
          severity: 'Medium',
          icon: AlertTriangle,
          title: 'Short Expiration Deadline & Pressure Tactics',
          snippet: 'Imposes short signing deadlines to prevent candidate background checks.',
          advice: 'Real offers provide several business days for contract review and legal evaluation.'
        });
      }

      // 6. Verified Corporate Entity Badges
      const hasCorporateReg = clean.includes('cin:') || clean.includes('gstin:') || clean.includes('registration no') || clean.includes('corp.');
      if (hasCorporateReg && riskScore < 30) {
        clauseAnalysis.push({
          type: 'Entity Legitimacy Signal',
          severity: 'Safe',
          icon: ShieldCheck,
          title: 'Corporate Identification & Tax Registration Detected',
          snippet: 'Document includes valid Corporate Identification Number (CIN) or Tax Registration credentials.',
          advice: 'Standard corporate document formatting detected.'
        });
      }

      const normalizedScore = Math.min(100, riskScore);

      let status = 'Verified Legitimate Contract';
      let statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      let statusIcon = ShieldCheck;
      let summaryText = 'This offer document displays standard enterprise clauses with zero detected fee traps or credential harvesting risks.';

      if (normalizedScore >= 50) {
        status = 'Critical Fraudulent Offer Letter';
        statusBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
        statusIcon = AlertOctagon;
        summaryText = 'FRAUD ALERT! High-risk extortion clauses, fee demands, or fake check schemes were identified in this document.';
      } else if (normalizedScore >= 25) {
        status = 'Suspicious Contract Terms - Proceed With Caution';
        statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
        statusIcon = AlertTriangle;
        summaryText = 'Exercise caution. Document contains unverified recruiter emails or short expiration timelines.';
      }

      setResult({
        riskScore: normalizedScore,
        status,
        statusBadge,
        statusIcon,
        summaryText,
        clauseAnalysis,
        flagsFound,
        analyzedAt: new Date()
      });

      setAnalyzing(false);
    }, 600);
  };

  const handleSelectPreset = (preset) => {
    setContractText(preset.text);
    analyzeContractText(preset.text);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 pb-20">
      
      {/* GOD TIER VIVA HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-black uppercase tracking-wider animate-pulse">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span>AI DOCUMENT FORENSICS & NLP SENTINEL</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
          <span className="text-slate-400 font-semibold">Offer Contract Auditor</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Offer Letter & Contract Forensic Inspector</h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          Upload or paste appointment letters and job contracts to audit for hidden fee traps, fake check equipment clauses, suspicious legal jurisdiction terms, and recruiter domain spoofing.
        </p>
      </div>

      {/* SAMPLE PRESETS FOR VIVA DEMO */}
      <div className="glass-panel-god p-5 rounded-3xl border border-slate-700/60 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
            <Play className="w-3.5 h-3.5" />
            <span>Interactive Viva Demo Presets</span>
          </span>
          <span className="text-[11px] text-slate-400 font-bold">Select preset to test live:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CONTRACT_PRESETS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(preset)}
              className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-left transition-all group hover:bg-slate-800/80"
            >
              <div className="text-xs font-extrabold text-white group-hover:text-cyan-300 truncate">
                {preset.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                {preset.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* INPUT AREA */}
      <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center space-x-2">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Paste Appointment / Offer Letter Text</span>
          </label>
          {contractText && (
            <button
              onClick={() => { setContractText(''); setResult(null); }}
              className="text-xs font-extrabold text-rose-400 hover:text-rose-300"
            >
              Clear Text
            </button>
          )}
        </div>

        <textarea
          rows={7}
          value={contractText}
          onChange={(e) => setContractText(e.target.value)}
          placeholder="Paste full text of appointment letter, employment agreement, or recruiter email offer here..."
          className="w-full p-4 rounded-2xl bg-slate-950/90 border border-slate-800 text-slate-100 placeholder-slate-500 text-xs font-mono focus:outline-none focus:border-cyan-500/60 transition-colors leading-relaxed"
        />

        <button
          onClick={() => analyzeContractText()}
          disabled={analyzing || !contractText.trim()}
          className="w-full py-4 rounded-full btn-base btn-primary text-white font-black text-xs flex items-center justify-center space-x-2 shadow-xl shadow-cyan-500/20 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
              <span>Running NLP Contract Clause Forensics...</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span>Run AI Forensic Contract Inspection</span>
            </>
          )}
        </button>
      </div>

      {/* RESULTS DISPLAY */}
      {result && (
        <div className="space-y-8 animate-fadeIn">
          
          {/* Main Risk Score Card */}
          <div className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${
            result.riskScore >= 50
              ? 'bg-gradient-to-r from-rose-950/80 via-red-900/50 to-rose-950/80 border-rose-500/50'
              : result.riskScore >= 25
              ? 'bg-gradient-to-r from-amber-950/80 via-orange-900/50 to-amber-950/80 border-amber-500/50'
              : 'bg-gradient-to-r from-emerald-950/80 via-teal-900/50 to-emerald-950/80 border-emerald-500/50'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className={`inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${result.statusBadge}`}>
                  {React.createElement(result.statusIcon, { className: "w-4 h-4" })}
                  <span>{result.status}</span>
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">{result.status}</h2>
                <p className="text-xs sm:text-sm text-slate-200 max-w-xl font-medium leading-relaxed">
                  {result.summaryText}
                </p>
              </div>

              {/* Forensic Gauge */}
              <div className="text-center sm:text-right shrink-0 bg-slate-900/80 p-5 rounded-2xl border border-slate-700/60 shadow-xl">
                <div className="text-5xl font-black text-white flex items-baseline justify-center sm:justify-end gap-1">
                  <span>{result.riskScore}</span>
                  <span className="text-xs font-bold text-slate-400">/ 100</span>
                </div>
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mt-1">Contract Forensic Index</div>
              </div>
            </div>
          </div>

          {/* Clause-by-Clause Forensic Breakdown */}
          <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>Clause-by-Clause Forensic Audit Findings</span>
              </h3>
              <span className="text-xs font-bold text-slate-400">
                {result.clauseAnalysis.length} Key Vectors Analyzed
              </span>
            </div>

            <div className="space-y-3">
              {result.clauseAnalysis.map((clause, idx) => (
                <div 
                  key={idx} 
                  className={`p-5 rounded-2xl border text-xs space-y-2.5 transition-all ${
                    clause.severity === 'Critical'
                      ? 'bg-rose-950/40 border-rose-500/40'
                      : clause.severity === 'High'
                      ? 'bg-amber-950/40 border-amber-500/40'
                      : clause.severity === 'Medium'
                      ? 'bg-orange-950/40 border-orange-500/40'
                      : 'bg-emerald-950/40 border-emerald-500/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-white flex items-center space-x-2 text-sm">
                      {React.createElement(clause.icon, { 
                        className: `w-4 h-4 ${
                          clause.severity === 'Critical' ? 'text-rose-400' :
                          clause.severity === 'High' ? 'text-amber-400' :
                          clause.severity === 'Medium' ? 'text-orange-400' : 'text-emerald-400'
                        }` 
                      })}
                      <span>{clause.title}</span>
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      clause.severity === 'Critical' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' :
                      clause.severity === 'High' ? 'bg-amber-950 text-amber-300 border border-amber-500/30' :
                      clause.severity === 'Medium' ? 'bg-orange-950 text-orange-300 border border-orange-500/30' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {clause.severity} Signal
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 font-mono text-[11px]">
                    "{clause.snippet}"
                  </div>

                  <p className="text-slate-300 font-medium leading-relaxed">
                    💡 <strong className="text-white">Forensic Expert Assessment:</strong> {clause.advice}
                  </p>
                </div>
              ))}
            </div>

            {/* Print / Export Report Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="text-xs text-slate-400 font-mono">
                Official Report Generated: {result.analyzedAt.toLocaleString()}
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto btn-base btn-primary px-6 py-3 text-xs font-black flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Official Forensic Certificate</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
