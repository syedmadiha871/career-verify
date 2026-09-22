import React, { useState } from 'react';
import { FileSearch, Sparkles, Loader2, AlertCircle, Trash2, Link as LinkIcon, FileText, Globe, CheckCircle2 } from 'lucide-react';
import { predictJob, scrapeJobUrl } from '../services/api';
import PresetSelector from '../components/PresetSelector';
import ResultCard from '../components/ResultCard';

export default function JobVerify() {
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'url'
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [scraping, setScraping] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError('Please enter or fetch a job description text to analyze.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // Instant AI analysis without artificial delay
      const data = await predictJob(jobDescription);
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the job posting.');
    } finally {
      setLoading(false);
    }
  };

  const handleFetchUrl = async (e) => {
    e.preventDefault();
    if (!jobUrl.trim()) return;

    try {
      setScraping(true);
      setError(null);
      const res = await scrapeJobUrl(jobUrl);
      setJobDescription(res.extractedText || '');
      setActiveTab('text');
    } catch (err) {
      setError(err.message || 'Failed to fetch job description from URL.');
    } finally {
      setScraping(false);
    }
  };

  const handleClear = () => {
    setJobDescription('');
    setJobUrl('');
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 text-xs font-black uppercase tracking-wider">
          <FileSearch className="w-4 h-4" />
          <span>High-Speed NLP Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Job Posting Fraud Detector</h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Paste job description text or fetch directly from any web link. Our AI scans for hidden fees, suspicious recruiter handles, identity hazards, and scam patterns.
        </p>
      </div>

      {/* Main Form or Result View */}
      {!result ? (
        <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-2xl space-y-6">
          
          {/* Mode Tabs */}
          <div className="flex items-center space-x-2 p-1.5 rounded-full bg-slate-900/90 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('text')}
              className={`flex-1 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'text'
                  ? 'btn-base btn-primary text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paste Text Description</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-2.5 rounded-full text-xs font-extrabold transition-all flex items-center justify-center space-x-2 ${
                activeTab === 'url'
                  ? 'btn-base btn-primary text-white shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Fetch via Job Web URL</span>
            </button>
          </div>

          {activeTab === 'url' ? (
            <form onSubmit={handleFetchUrl} className="space-y-4">
              <div>
                <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 block">
                  Paste Job Link / Web URL
                </label>
                <div className="relative">
                  <LinkIcon className="w-4 h-4 text-slate-500 absolute left-4 top-4" />
                  <input
                    type="url"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://example-jobs.com/posting/senior-developer"
                    className="w-full pl-11 pr-4 py-3.5 rounded-full bg-slate-900/90 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Fast web scraper with 3.5s timeout. Supports Greenhouse, Lever, LinkedIn, Indeed.</span>
                </p>
              </div>

              <button
                type="submit"
                disabled={scraping || !jobUrl.trim()}
                className="w-full py-4 rounded-full btn-base btn-secondary font-black text-xs flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {scraping ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Scraping Web Page Content...</span>
                  </>
                ) : (
                  <>
                    <Globe className="w-4 h-4" />
                    <span>Extract & Load Job Text</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <>
              {/* Quick Presets */}
              <PresetSelector onSelectPreset={(text) => setJobDescription(text)} />

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-extrabold text-slate-300 uppercase tracking-wider">
                      Job Description Copy
                    </label>
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="text-slate-500 font-mono">{jobDescription.length} characters</span>
                      {jobDescription && (
                        <button
                          type="button"
                          onClick={handleClear}
                          className="text-slate-400 hover:text-rose-400 transition-colors flex items-center space-x-1 font-bold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Clear</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    rows={9}
                    placeholder="Paste complete job description, requirements, recruiter contact details, or offer email copy here..."
                    className="w-full p-4.5 rounded-2xl bg-slate-950/90 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 text-xs sm:text-sm font-mono leading-relaxed shadow-inner"
                    disabled={loading}
                  />
                </div>

                {error && (
                  <div className="p-4 rounded-full bg-rose-950/50 border border-rose-500/50 text-rose-300 text-xs flex items-center space-x-2 px-6">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !jobDescription.trim()}
                  className="w-full py-4.5 rounded-full btn-base btn-primary text-white font-black text-sm flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Analyzing Job Posting...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Analyze Job Posting</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      ) : (
        <ResultCard result={result} onReset={handleClear} />
      )}
    </div>
  );
}
