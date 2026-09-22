import React, { useState } from 'react';
import { ShieldCheck, AlertOctagon, AlertTriangle, CheckCircle, Activity, Tag, RotateCcw, Share2, Check, HelpCircle, Building2, Briefcase, Mail, DollarSign } from 'lucide-react';
import PDFReport from './PDFReport';

export default function ResultCard({ result, onReset }) {
  const [copied, setCopied] = useState(false);

  if (!result) return null;

  // Master ML Schema Label Support: GENUINE | FAKE | UNCERTAIN
  const label = result.label || (result.prediction === 'Fake Job' ? 'FAKE' : result.prediction === 'Suspicious Job' ? 'UNCERTAIN' : 'GENUINE');
  const isFake = label === 'FAKE';
  const isUncertain = label === 'UNCERTAIN';
  const isGenuine = label === 'GENUINE';

  const risk_level = result.risk_level || (isFake ? 'HIGH' : isUncertain ? 'MEDIUM' : 'LOW');
  const fakeProbPct = Math.round((result.fake_probability ?? (result.fraud_score ? result.fraud_score / 100 : 0.05)) * 100);
  const genuineProbPct = Math.round((result.genuine_probability ?? (1 - fakeProbPct / 100)) * 100);

  const handleShare = () => {
    const summaryText = `CareerVerify Audit: ${label} (${fakeProbPct}% Fake Prob / ${genuineProbPct}% Genuine Prob)\nReasoning: ${result.reasoning_summary || result.explanation || 'Scanned'}`;
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getHeaderStyle = () => {
    if (isFake) return 'bg-gradient-to-r from-rose-950/60 via-rose-900/40 to-red-950/50 border-rose-500/50 shadow-xl shadow-rose-950/50';
    if (isUncertain) return 'bg-gradient-to-r from-amber-950/60 via-orange-900/40 to-amber-950/50 border-amber-500/50 shadow-xl shadow-amber-950/50';
    if (isGenuine) return 'bg-gradient-to-r from-emerald-950/60 via-teal-900/40 to-emerald-950/50 border-emerald-500/50 shadow-xl shadow-emerald-950/50';
    return 'bg-gradient-to-r from-slate-900/80 via-slate-800/50 to-slate-900/80 border-slate-700/60 shadow-xl';
  };

  const getIcon = () => {
    if (isFake) return <AlertOctagon className="w-8 h-8 text-rose-400" />;
    if (isUncertain) return <AlertTriangle className="w-8 h-8 text-amber-400" />;
    if (isGenuine) return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
    return <HelpCircle className="w-8 h-8 text-slate-400" />;
  };

  const getLabelColor = () => {
    if (isFake) return 'text-rose-400';
    if (isUncertain) return 'text-amber-400';
    if (isGenuine) return 'text-emerald-400';
    return 'text-slate-300';
  };

  const extracted = result.evidence?.extractedFeatures || result.breakdown?.extractedFeatures || {};

  return (
    <div id="pdf-report-content" className="space-y-6">
      
      {/* Top Banner Status Header */}
      <div className={`p-6 sm:p-8 rounded-3xl border transition-all ${getHeaderStyle()}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
              isFake ? 'bg-rose-500/20 border-rose-500/30' :
              isUncertain ? 'bg-amber-500/20 border-amber-500/30' :
              isGenuine ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-slate-800 border-slate-700'
            }`}>
              {getIcon()}
            </div>

            <div>
              <div className="flex items-center space-x-3 mb-1">
                <span className={`text-2xl sm:text-3xl font-black ${getLabelColor()}`}>
                  {label}
                </span>
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  risk_level === 'CRITICAL' || risk_level === 'HIGH' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                  risk_level === 'MEDIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {risk_level} Risk Level
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-mono bg-slate-900 text-cyan-400 border border-slate-800">
                  {result.model_version || 'v2.5.0-calibrated'}
                </span>
              </div>

              <p className="text-xs text-slate-300 font-medium max-w-xl leading-relaxed">
                {result.reasoning_summary || result.explanation || (isFake
                  ? 'High probability of fraudulent job posting scam.'
                  : isUncertain
                  ? 'Borderline posting with mixed signals. Exercise caution.'
                  : 'Matches authentic enterprise posting signals.')}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
            <button
              onClick={handleShare}
              className="btn-base btn-secondary px-3.5 py-2 text-xs flex items-center space-x-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied' : 'Share'}</span>
            </button>
            <PDFReport result={result} />
            {onReset && (
              <button
                onClick={onReset}
                className="btn-base btn-secondary px-3.5 py-2 text-xs flex items-center space-x-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Search</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Structured Features Pill Strip */}
      {(extracted.companyName || extracted.claimedCompensation || extracted.contactDomain) && (
        <div className="glass-panel-god p-4 rounded-2xl border border-slate-700/60 flex flex-wrap items-center gap-3 text-xs">
          {extracted.companyName && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="font-extrabold">{extracted.companyName}</span>
            </div>
          )}
          {extracted.jobTitle && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
              <Briefcase className="w-3.5 h-3.5 text-purple-400" />
              <span className="font-semibold">{extracted.jobTitle}</span>
            </div>
          )}
          {extracted.claimedCompensation && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono">{extracted.claimedCompensation}</span>
            </div>
          )}
          {extracted.contactEmail && (
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 font-mono text-[11px]">
              <Mail className="w-3.5 h-3.5 text-rose-400" />
              <span>{extracted.contactEmail}</span>
            </div>
          )}
        </div>
      )}

      {/* Calibrated Probability Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Fake Probability Card */}
        <div className="glass-panel-god p-5 rounded-3xl border border-slate-700/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Fake Probability</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-3xl font-black text-white mb-2">{fakeProbPct}%</div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-red-600 rounded-full transition-all duration-1000"
              style={{ width: `${fakeProbPct}%` }}
            ></div>
          </div>
        </div>

        {/* Genuine Probability Card */}
        <div className="glass-panel-god p-5 rounded-3xl border border-slate-700/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Genuine Probability</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white mb-2">{genuineProbPct}%</div>
          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-1000"
              style={{ width: `${genuineProbPct}%` }}
            ></div>
          </div>
        </div>

        {/* Calibrated Model Confidence */}
        <div className="glass-panel-god p-5 rounded-3xl border border-slate-700/60">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Model Confidence</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400 mb-2">{result.confidence}%</div>
          <p className="text-[11px] text-slate-400 font-medium">
            Calibrated probability score
          </p>
        </div>
      </div>

      {/* Evidence Breakdown Grid (Fraud, Legitimacy, Missing Information) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Evidence Supporting Fraud */}
        <div className="glass-panel-god p-6 rounded-3xl border border-rose-900/40 space-y-4">
          <h4 className="text-xs font-black text-rose-300 uppercase tracking-wider flex items-center space-x-2">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>Evidence Supporting Fraud ({result.evidence_for_fake?.length || 0})</span>
          </h4>
          <div className="space-y-2">
            {result.evidence_for_fake && result.evidence_for_fake.length > 0 ? (
              result.evidence_for_fake.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-200 font-semibold">
                  <AlertOctagon className="w-3.5 h-3.5 text-rose-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic p-3">No direct fraud signals detected in posting text.</p>
            )}
          </div>
        </div>

        {/* Evidence Supporting Legitimacy */}
        <div className="glass-panel-god p-6 rounded-3xl border border-emerald-900/40 space-y-4">
          <h4 className="text-xs font-black text-emerald-300 uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Evidence Supporting Legitimacy ({result.evidence_for_genuine?.length || 0})</span>
          </h4>
          <div className="space-y-2">
            {result.evidence_for_genuine && result.evidence_for_genuine.length > 0 ? (
              result.evidence_for_genuine.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic p-3">No verifiable enterprise corporate signals detected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Missing Information & Verifiability Inspection */}
      {result.missing_information && result.missing_information.length > 0 && (
        <div className="glass-panel-god p-6 rounded-3xl border border-slate-700/60 space-y-3">
          <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center space-x-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Missing Information & Verifiability Gaps</span>
          </h4>
          <div className="space-y-2">
            {result.missing_information.map((item, idx) => (
              <div key={idx} className="flex items-start space-x-2.5 p-3 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-amber-200">
                <Tag className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submitted Job Text Preview */}
      {result.job_text && (
        <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-3">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Submitted Job Description</h4>
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
            {result.job_text}
          </div>
        </div>
      )}
    </div>
  );
}
