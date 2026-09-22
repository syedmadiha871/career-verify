import React, { useState } from 'react';
import { Building2, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, Globe, Mail, Lock, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import { verifyCompany } from '../services/api';

export default function CompanyVerify() {
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!companyName.trim() || !website.trim() || !email.trim()) {
      setError('Please fill in Company Name, Website URL, and Recruiter Email.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await verifyCompany(companyName, website, email);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to verify company details.');
    } finally {
      setLoading(false);
    }
  };

  const handlePreset = (cName, web, em) => {
    setCompanyName(cName);
    setWebsite(web);
    setEmail(em);
    setResult(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 text-xs font-black uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Corporate & Recruiter Trust Auditor</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Company Trust Verifier</h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Verify corporate website HTTPS security, recruiter email domain alignment, and high-risk domain extensions (.xyz, .top) before responding to job offers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-6 glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-2xl space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white uppercase tracking-wider">Company Credentials</h3>
            <span className="text-xs text-slate-400 font-bold">Quick Samples:</span>
          </div>

          {/* Quick Presets */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <button
              type="button"
              onClick={() => handlePreset('Google LLC', 'https://google.com', 'careers@google.com')}
              className="p-3.5 rounded-full bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/40 text-left transition-all active:scale-95 flex flex-col items-center justify-center text-center"
            >
              <div className="font-extrabold flex items-center space-x-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Corp</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">Google / @google.com</div>
            </button>

            <button
              type="button"
              onClick={() => handlePreset('Apex Global Scam', 'http://jobscam.xyz', 'hr.jobs2026@gmail.com')}
              className="p-3.5 rounded-full bg-rose-950/30 border border-rose-500/40 text-rose-300 hover:bg-rose-900/40 text-left transition-all active:scale-95 flex flex-col items-center justify-center text-center"
            >
              <div className="font-extrabold flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Suspicious Scam</span>
              </div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">.xyz / @gmail.com</div>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 block">Company Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 block">Company Website URL</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. https://acme.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 block">Recruiter Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. hr@acme.com"
                  className="w-full pl-11 pr-4 py-3.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="p-3.5 rounded-full bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2 px-6">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !companyName || !website || !email}
              className="w-full py-4 rounded-full btn-base btn-primary text-white font-black text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditing Entity Credentials...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Verify Company Trust</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Result Column */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="space-y-6">
              
              {/* Trust Score Banner */}
              <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl transition-all ${
                result.status === 'Verified'
                  ? 'bg-gradient-to-r from-emerald-950/60 via-teal-900/40 to-emerald-950/60 border-emerald-500/40'
                  : result.status === 'Needs Manual Review'
                  ? 'bg-gradient-to-r from-amber-950/60 via-orange-900/40 to-amber-950/60 border-amber-500/40'
                  : 'bg-gradient-to-r from-rose-950/60 via-red-900/40 to-rose-950/60 border-rose-500/40'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300">Audited Entity</span>
                    <h2 className="text-2xl font-black text-white">{result.company_name}</h2>
                  </div>
                  <span className={`px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    result.status === 'Verified'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : result.status === 'Needs Manual Review'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {result.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-slate-200">
                    <span className="font-extrabold uppercase tracking-wider">Trust Rating Score</span>
                    <span className="font-black text-2xl text-white">{result.score} <span className="text-xs text-slate-400 font-normal">/ 100</span></span>
                  </div>
                  <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        result.score >= 80 ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : result.score >= 50 ? 'bg-gradient-to-r from-amber-400 to-orange-500' : 'bg-gradient-to-r from-rose-500 to-red-600'
                      }`}
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Inspection Reasons */}
              <div className="glass-panel-god p-6 rounded-3xl border border-slate-700/60 space-y-4">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Diagnostic Audit Feedback</h4>
                <div className="space-y-2.5">
                  {result.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-200">
                      {reason.includes('HTTPS') || reason.includes('matches') ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <span className="font-medium">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="glass-panel-god p-8 rounded-3xl border border-slate-700/60 h-full flex flex-col items-center justify-center text-center space-y-4 min-h-[350px]">
              <div className="w-16 h-16 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-500">
                <Building2 className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-base font-extrabold text-white">No Company Audited Yet</h3>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Fill out the recruiter credentials form or click one of the quick test sample buttons to evaluate employer trust.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
