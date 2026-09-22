import React, { useState } from 'react';
import { 
  LifeBuoy, ShieldAlert, ShieldCheck, AlertTriangle, ArrowRight, ArrowLeft, 
  RotateCcw, Lock, DollarSign, MessageSquare, KeyRound, Briefcase, 
  CheckCircle2, Sparkles, AlertOctagon, Printer, ExternalLink, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ALL_QUESTIONS = [
  // Category 1: Payment & Fee Traps
  {
    id: 'fee_upfront',
    category: 'Payment & Fee Traps',
    categoryKey: 'payment',
    icon: DollarSign,
    question: 'Were you asked to pay an upfront fee for registration, background check, portal access, or training materials?',
    scenario: 'The recruiter says: "To proceed with onboarding, please pay a refundable ₹1,500 security deposit for your software license."',
    weight: 35,
    advice: 'Legitimate employers NEVER ask job seekers to pay registration, application, portal, or training fees under any circumstances.',
    severity: 'High'
  },
  {
    id: 'equipment_check',
    category: 'Payment & Fee Traps',
    categoryKey: 'payment',
    icon: DollarSign,
    question: 'Did the recruiter offer to mail you a paper check to purchase home office laptops/equipment from their preferred vendor?',
    scenario: 'HR sends a digital check for $2,500 and asks you to deposit it, buy equipment from a specific vendor, and wire back the remaining balance.',
    weight: 35,
    advice: 'Classic Fake Check Scam! The check will bounce after a few days, leaving you personally responsible for all wired money.',
    severity: 'High'
  },
  {
    id: 'crypto_deposit',
    category: 'Payment & Fee Traps',
    categoryKey: 'payment',
    icon: DollarSign,
    question: 'Were you requested to complete tasks using cryptocurrency wallets or recharge funds into an online portal to unlock salary payouts?',
    scenario: 'Task-based portal requires you to deposit $50 USDT to reach "VIP tier" and cash out your daily earnings.',
    weight: 40,
    advice: 'Task/Pig-Butchering Scam trap! Once you deposit crypto or money, withdrawals are permanently blocked with demands for higher fees.',
    severity: 'Critical'
  },
  {
    id: 'processing_charge',
    category: 'Payment & Fee Traps',
    categoryKey: 'payment',
    icon: DollarSign,
    question: 'Is there a requirement to pay shipping or courier costs for receiving your offer letter, laptop, or ID badge?',
    scenario: 'Employer claims your MacBook Pro is ready for delivery but you must pay ₹850 dispatch fees via UPI.',
    weight: 25,
    advice: 'Real companies cover all shipping and hardware logistics. Demanding courier charges is a red flag extortion tactic.',
    severity: 'Medium'
  },

  // Category 2: Communication & Screening Channels
  {
    id: 'chat_interview',
    category: 'Communication & Screening',
    categoryKey: 'communication',
    icon: MessageSquare,
    question: 'Was your entire interview conducted exclusively via anonymous text chat (Telegram, WhatsApp, Signal, or Skype text)?',
    scenario: 'You received a text message from "HR Manager" asking to download Telegram for a 15-minute text Q&A interview.',
    weight: 30,
    advice: 'Legitimate corporate interviews occur via official video calls (Zoom, Google Meet, Teams) or face-to-face meetings, not text apps.',
    severity: 'High'
  },
  {
    id: 'generic_email',
    category: 'Communication & Screening',
    categoryKey: 'communication',
    icon: MessageSquare,
    question: 'Is the recruiter contacting you from a generic email domain (@gmail.com, @yahoo.com, @hotmail.com) instead of an official company domain?',
    scenario: 'Email signed by "Global Talent HR" sent from google_careers_recruitment99@gmail.com.',
    weight: 25,
    advice: 'Official corporate recruiters use company-owned web domains (e.g., name@company.com), never free public email addresses.',
    severity: 'Medium'
  },
  {
    id: 'no_video_call',
    category: 'Communication & Screening',
    categoryKey: 'communication',
    icon: MessageSquare,
    question: 'Does the recruiter or interviewer refuse live video calls or phone conversations citing "technical issues" or "busy schedules"?',
    scenario: 'When asked for a video call, the interviewer responds: "Our interviewing policy is strictly text-based due to security protocols."',
    weight: 25,
    advice: 'Scammers avoid video cameras to hide their identity, location, and voice attributes.',
    severity: 'Medium'
  },
  {
    id: 'unsolicited_outreach',
    category: 'Communication & Screening',
    categoryKey: 'communication',
    icon: MessageSquare,
    question: 'Did you receive an instant job offer for a role you never applied for or interviewed for?',
    scenario: 'Unsolicited WhatsApp message: "Congratulations! Your profile was shortlisted for Data Entry Specialist, salary ₹45,000/month. Reply YES to start."',
    weight: 30,
    advice: 'Unsolicited instant offers without screening are mass phishing broadcasts aimed at harvesting fees or personal identity data.',
    severity: 'High'
  },

  // Category 3: Identity & Financial Security
  {
    id: 'early_id_docs',
    category: 'Identity & Financial Security',
    categoryKey: 'identity',
    icon: KeyRound,
    question: 'Were you asked to submit sensitive government identity documents (PAN card, Aadhaar, SSN, Passport photo) before receiving a formal offer?',
    scenario: 'Recruiter requires clear scans of front & back of Aadhaar/PAN before scheduling an initial screening conversation.',
    weight: 30,
    advice: 'Sharing identity documents prematurely exposes you to identity theft, fraudulent loan applications, and SIM-swap scams.',
    severity: 'High'
  },
  {
    id: 'bank_login_credentials',
    category: 'Identity & Financial Security',
    categoryKey: 'identity',
    icon: KeyRound,
    question: 'Did the recruiter ask for online banking credentials, net banking passwords, or debit card PIN numbers for "direct deposit setup"?',
    scenario: 'HR onboarding form requests your net banking username and password to verify direct deposit routing.',
    weight: 50,
    advice: 'ABSOLUTE DANGER! Employers only need standard account numbers and IFSC/routing numbers—NEVER passwords or PINs.',
    severity: 'Critical'
  },
  {
    id: 'remote_access_app',
    category: 'Identity & Financial Security',
    categoryKey: 'identity',
    icon: KeyRound,
    question: 'Were you instructed to install remote desktop control software (AnyDesk, TeamViewer, RustDesk) on your phone or laptop?',
    scenario: 'IT department tells you to download AnyDesk so they can "configure your candidate portal software remotely."',
    weight: 45,
    advice: 'Remote control apps grant scammers total access to your device, banking apps, OTPs, and private files.',
    severity: 'Critical'
  },
  {
    id: 'otp_verification',
    category: 'Identity & Financial Security',
    categoryKey: 'identity',
    icon: KeyRound,
    question: 'Has the recruiter asked you to share SMS OTP codes sent to your phone during the recruitment process?',
    scenario: '"We sent a verification code to your mobile number. Please read back the 6-digit code to complete candidate registration."',
    weight: 45,
    advice: 'Sharing OTPs allows attackers to log into your bank accounts, WhatsApp, or government portals.',
    severity: 'Critical'
  },

  // Category 4: Offer Terms & Work Realism
  {
    id: 'unrealistic_pay',
    category: 'Offer Terms & Work Realism',
    categoryKey: 'terms',
    icon: Briefcase,
    question: 'Is the offered salary excessively high for minimal required skills or part-time hours (e.g., $80/hr for basic data entry)?',
    scenario: 'Offer promises $500 per day working 2 hours daily from home copying and pasting text with zero prior experience needed.',
    weight: 25,
    advice: 'If an offer sounds too good to be true, it is almost certainly a scam lure designed to override your critical thinking.',
    severity: 'Medium'
  },
  {
    id: 'vague_company_info',
    category: 'Offer Terms & Work Realism',
    categoryKey: 'terms',
    icon: Briefcase,
    question: 'Does the company lack a verifiable website, LinkedIn page, Google Maps address, or official registration details?',
    scenario: 'Company name is generic like "Global Apex Solutions LLC" but searching Google yields no website or employee profiles.',
    weight: 25,
    advice: 'Always cross-reference employer registration with official government registries or company verification tools.',
    severity: 'Medium'
  },
  {
    id: 'urgent_deadline',
    category: 'Offer Terms & Work Realism',
    categoryKey: 'terms',
    icon: Briefcase,
    question: 'Is there intense pressure to sign the offer contract within 1–2 hours under threat of immediate offer cancellation?',
    scenario: 'Recruiter states: "This offer expires in 45 minutes. If you do not sign right now, we will assign the role to another applicant."',
    weight: 25,
    advice: 'Artificial time pressure is engineered to stop candidates from performing background checks or consulting advisors.',
    severity: 'Medium'
  }
];

export default function ScamShield() {
  const [quizMode, setQuizMode] = useState('full'); // 'full' | 'quick' | 'category'
  const [selectedCategory, setSelectedCategory] = useState('payment');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Get active question list based on selected mode
  const getActiveQuestions = () => {
    if (quizMode === 'quick') {
      // Pick 5 high-priority questions
      return ALL_QUESTIONS.filter(q => q.severity === 'Critical' || q.severity === 'High').slice(0, 5);
    }
    if (quizMode === 'category') {
      return ALL_QUESTIONS.filter(q => q.categoryKey === selectedCategory);
    }
    return ALL_QUESTIONS;
  };

  const currentQuestions = getActiveQuestions();
  const currentQ = currentQuestions[currentIndex] || currentQuestions[0];

  const handleAnswer = (val) => {
    setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
  };

  const handleModeChange = (mode) => {
    setQuizMode(mode);
    setAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
  };

  // Diagnostic Calculation
  const calculateResult = () => {
    let rawScore = 0;
    let maxPossibleScore = 0;
    const triggeredScenarios = [];
    const categoryScores = { payment: 0, communication: 0, identity: 0, terms: 0 };
    const categoryTotals = { payment: 0, communication: 0, identity: 0, terms: 0 };

    currentQuestions.forEach(q => {
      maxPossibleScore += q.weight;
      categoryTotals[q.categoryKey] += q.weight;
      if (answers[q.id] === true) {
        rawScore += q.weight;
        categoryScores[q.categoryKey] += q.weight;
        triggeredScenarios.push(q);
      }
    });

    // Normalize risk score to 0-100 scale
    const riskScore = maxPossibleScore > 0 ? Math.min(100, Math.round((rawScore / maxPossibleScore) * 100)) : 0;

    let statusTitle = 'Safe Candidate Signal';
    let statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    let statusDesc = 'No critical scam red flags were detected in your diagnostic answers. Always maintain basic security vigilance.';
    let icon = ShieldCheck;

    if (riskScore >= 50) {
      statusTitle = 'Critical Scam Threat';
      statusBadge = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      statusDesc = 'HIGH SCAM PROBABILITY! Multiple severe fraud tactics detected. Immediately stop all communication and do not transfer money or share identity details.';
      icon = AlertOctagon;
    } else if (riskScore >= 25) {
      statusTitle = 'Moderate Suspicion Warning';
      statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      statusDesc = 'Suspicious offer elements detected. Exercise heightened caution, verify employer domain credentials, and do not pay any upfront charges.';
      icon = AlertTriangle;
    }

    return {
      riskScore,
      statusTitle,
      statusBadge,
      statusDesc,
      icon,
      triggeredScenarios,
      categoryScores,
      categoryTotals,
      totalAnswered: Object.keys(answers).length
    };
  };

  const result = submitted ? calculateResult() : null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-16">
      
      {/* GOD TIER HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-black uppercase tracking-wider animate-pulse">
          <LifeBuoy className="w-4 h-4 text-purple-400" />
          <span>ADVANCED SCAM DIAGNOSTIC SUITE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
          <span className="text-slate-400 font-semibold">15 Scenario Intelligence</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Scam Threat Diagnostic Quiz</h1>
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed">
          Evaluating job offers, recruiter interactions, and interview channels against 15 real-world fraud vectors to calculate your risk index and generate an emergency defense plan.
        </p>
      </div>

      {/* MODE SELECTION BAR */}
      {!submitted && (
        <div className="glass-panel-god p-2 rounded-2xl border border-slate-700/60 flex flex-wrap items-center justify-between gap-2 shadow-xl">
          <div className="flex items-center space-x-1.5 w-full sm:w-auto">
            <button
              onClick={() => handleModeChange('full')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                quizMode === 'full' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Full Audit (15 Questions)
            </button>
            <button
              onClick={() => handleModeChange('quick')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                quizMode === 'quick' 
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Quick Scan (5 High Risk Qs)
            </button>
            <button
              onClick={() => handleModeChange('category')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                quizMode === 'category' 
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              Category Filter
            </button>
          </div>

          {quizMode === 'category' && (
            <div className="flex items-center space-x-1 overflow-x-auto py-1 px-1 text-[11px] font-bold">
              <button
                onClick={() => { setSelectedCategory('payment'); setCurrentIndex(0); setAnswers({}); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${selectedCategory === 'payment' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'}`}
              >
                Payment
              </button>
              <button
                onClick={() => { setSelectedCategory('communication'); setCurrentIndex(0); setAnswers({}); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${selectedCategory === 'communication' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-white'}`}
              >
                Communication
              </button>
              <button
                onClick={() => { setSelectedCategory('identity'); setCurrentIndex(0); setAnswers({}); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${selectedCategory === 'identity' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'}`}
              >
                Identity
              </button>
              <button
                onClick={() => { setSelectedCategory('terms'); setCurrentIndex(0); setAnswers({}); }}
                className={`px-3 py-1.5 rounded-lg transition-all ${selectedCategory === 'terms' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'text-slate-400 hover:text-white'}`}
              >
                Offer Terms
              </button>
            </div>
          )}
        </div>
      )}

      {/* QUIZ INTERACTIVE QUESTION CARD */}
      {!submitted ? (
        <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-6 shadow-2xl relative overflow-hidden">
          
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-slate-400">
              <span className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Question {currentIndex + 1} of {currentQuestions.length}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-purple-300">
                {currentQ.category}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / currentQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Scenario Details Container */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                {React.createElement(currentQ.icon, { className: "w-5 h-5" })}
              </div>
              <div className="space-y-1">
                <h3 className="text-base sm:text-lg font-extrabold text-white leading-snug">
                  {currentQ.question}
                </h3>
                <div className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-slate-800 text-slate-300 border border-slate-700">
                  Severity: {currentQ.severity} Risk
                </div>
              </div>
            </div>

            {/* Context Box */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 space-y-1.5">
              <div className="font-extrabold text-cyan-400 uppercase tracking-wider text-[10px] flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Scenario Context Example</span>
              </div>
              <p className="italic text-slate-300 font-medium">"{currentQ.scenario}"</p>
            </div>

          </div>

          {/* Interactive Answer Selection */}
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => handleAnswer(true)}
                className={`p-4 rounded-2xl border font-black text-xs transition-all flex items-center justify-center space-x-2 ${
                  answers[currentQ.id] === true
                    ? 'bg-rose-950/80 border-rose-500 text-rose-200 shadow-lg shadow-rose-950/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-rose-950/30 hover:border-rose-500/40 hover:text-white'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>YES (Applies to me)</span>
              </button>

              <button
                type="button"
                onClick={() => handleAnswer(false)}
                className={`p-4 rounded-2xl border font-black text-xs transition-all flex items-center justify-center space-x-2 ${
                  answers[currentQ.id] === false
                    ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200 shadow-lg shadow-emerald-950/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-emerald-950/30 hover:border-emerald-500/40 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>NO (Does not apply)</span>
              </button>

              <button
                type="button"
                onClick={() => handleAnswer('unsure')}
                className={`p-4 rounded-2xl border font-black text-xs transition-all flex items-center justify-center space-x-2 ${
                  answers[currentQ.id] === 'unsure'
                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-lg shadow-cyan-950/50'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>UNSURE / SKIP</span>
              </button>
            </div>
          </div>

          {/* Wizard Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="btn-base btn-secondary px-5 py-2.5 text-xs font-bold flex items-center space-x-2 disabled:opacity-40"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {Object.keys(answers).length >= currentQuestions.length ? (
              <button
                onClick={() => setSubmitted(true)}
                className="btn-base btn-purple px-7 py-3 text-xs font-black flex items-center space-x-2 shadow-xl shadow-purple-600/30 animate-pulse"
              >
                <span>Generate Diagnostic Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : currentIndex < currentQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(currentIndex + 1)}
                className="btn-base btn-primary px-6 py-2.5 text-xs font-bold flex items-center space-x-2"
              >
                <span>Next Scenario</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setSubmitted(true)}
                className="btn-base btn-purple px-7 py-3 text-xs font-black flex items-center space-x-2 shadow-xl shadow-purple-600/30"
              >
                <span>Complete & View Score</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>
      ) : (
        /* DIAGNOSTIC RESULTS DASHBOARD */
        <div className="space-y-8 animate-fadeIn">
          
          {/* Main Risk Banner */}
          <div className={`p-8 rounded-3xl border shadow-2xl relative overflow-hidden ${
            result.riskScore >= 50
              ? 'bg-gradient-to-r from-rose-950/80 via-red-900/50 to-rose-950/80 border-rose-500/50'
              : result.riskScore >= 25
              ? 'bg-gradient-to-r from-amber-950/80 via-orange-900/50 to-amber-950/80 border-amber-500/50'
              : 'bg-gradient-to-r from-emerald-950/80 via-teal-900/50 to-emerald-950/80 border-emerald-500/50'
          }`}>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
              <div className="space-y-2">
                <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border ${result.statusBadge}`}>
                  {React.createElement(result.icon, { className: "w-4 h-4" })}
                  <span>{result.statusTitle}</span>
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white">{result.statusTitle}</h2>
                <p className="text-xs sm:text-sm text-slate-200 max-w-xl font-medium leading-relaxed">
                  {result.statusDesc}
                </p>
              </div>

              {/* Score Meter */}
              <div className="text-center sm:text-right shrink-0 bg-slate-900/80 p-5 rounded-2xl border border-slate-700/60 shadow-xl">
                <div className="text-5xl font-black text-white flex items-baseline justify-center sm:justify-end gap-1">
                  <span>{result.riskScore}</span>
                  <span className="text-xs font-bold text-slate-400">/ 100</span>
                </div>
                <div className="text-[11px] font-black uppercase tracking-wider text-slate-400 mt-1">Calculated Threat Index</div>
              </div>
            </div>
          </div>

          {/* Category Breakdown Progress */}
          <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-4 shadow-xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Risk Profile Breakdown by Domain</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-extrabold text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <DollarSign className="w-4 h-4 text-purple-400" />
                    <span>Payment & Fee Traps</span>
                  </span>
                  <span className="text-purple-300">{result.categoryScores.payment} pts</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-purple-500" style={{ width: `${Math.min(100, (result.categoryScores.payment / 150) * 100)}%` }}></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-extrabold text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Communication Channels</span>
                  </span>
                  <span className="text-cyan-300">{result.categoryScores.communication} pts</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-cyan-500" style={{ width: `${Math.min(100, (result.categoryScores.communication / 110) * 100)}%` }}></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-extrabold text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <KeyRound className="w-4 h-4 text-rose-400" />
                    <span>Identity & Financial Security</span>
                  </span>
                  <span className="text-rose-300">{result.categoryScores.identity} pts</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, (result.categoryScores.identity / 170) * 100)}%` }}></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex justify-between text-xs font-extrabold text-slate-300">
                  <span className="flex items-center space-x-1.5">
                    <Briefcase className="w-4 h-4 text-emerald-400" />
                    <span>Offer Terms & Work Realism</span>
                  </span>
                  <span className="text-emerald-300">{result.categoryScores.terms} pts</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (result.categoryScores.terms / 75) * 100)}%` }}></div>
                </div>
              </div>

            </div>
          </div>

          {/* Triggered Red Flags & Actionable Guidance */}
          <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-6 shadow-xl">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              <span>Tailored Protection & Emergency Action Plan</span>
            </h3>

            {result.triggeredScenarios.length > 0 ? (
              <div className="space-y-3">
                <div className="text-xs font-extrabold text-rose-300">Identified Risk Scenarios & Specific Protective Directives:</div>
                {result.triggeredScenarios.map((sc, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-white flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                        <span>{sc.question}</span>
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-950 text-rose-300 border border-rose-500/30">
                        {sc.severity}
                      </span>
                    </div>
                    <p className="text-slate-300 font-medium pl-6 leading-relaxed">
                      💡 <strong className="text-white">Safety Directive:</strong> {sc.advice}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-200 space-y-1">
                <div className="font-extrabold text-emerald-300 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero High-Risk Traps Triggered</span>
                </div>
                <p className="text-emerald-100/80">Your job offer responses matched standard verified recruitment protocols.</p>
              </div>
            )}

            {/* Standard Safety Checklist */}
            <div className="pt-2 space-y-2 text-xs">
              <div className="font-extrabold text-slate-300">Universal Job Defense Checklist:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Never pay registration or training fees</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Verify employer via company domain email</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Refuse paper check equipment purchases</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Never share OTPs or install remote apps</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <button
                onClick={handleReset}
                className="w-full sm:w-auto btn-base btn-secondary px-6 py-3 text-xs font-extrabold flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake Diagnostic Quiz</span>
              </button>

              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <Link
                  to="/threat-radar"
                  className="flex-1 sm:flex-initial btn-base btn-danger px-6 py-3 text-xs font-black flex items-center justify-center space-x-2"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Log Scammer to Public Blacklist</span>
                </Link>
                <button
                  onClick={() => window.print()}
                  className="btn-base btn-god-glass px-4 py-3 text-xs font-extrabold flex items-center justify-center"
                  title="Print / Save Summary"
                >
                  <Printer className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
