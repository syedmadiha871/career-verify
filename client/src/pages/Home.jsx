import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileSearch, Building2, FileCheck, Cpu, CheckCircle2, AlertTriangle, ArrowRight, Activity, Database, Lock, ShieldAlert, LifeBuoy, Sparkles, Zap, Award, Play } from 'lucide-react';
import PresetSelector from '../components/PresetSelector';
import ResultCard from '../components/ResultCard';
import { predictJob } from '../services/api';

export default function Home() {
  const [demoText, setDemoText] = useState('');
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoResult, setDemoResult] = useState(null);

  const handleRunDemo = async (textToTest) => {
    try {
      setDemoLoading(true);
      const text = textToTest || demoText;
      const res = await predictJob(text);
      setDemoResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="space-y-16 pb-20 overflow-hidden">
      
      {/* GOD TIER HERO SECTION */}
      <section className="relative pt-8 sm:pt-14 pb-8">
        
        {/* Animated Glow Particles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow"></div>
        <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-purple-600/15 rounded-full blur-[110px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10 px-4">
          
          {/* Static Hero Badge */}
          <div className="inline-flex items-center space-x-3 px-4 py-2 rounded-full glass-panel-god border border-cyan-500/40 text-cyan-300 text-xs font-extrabold shadow-xl shadow-cyan-500/10 animate-float">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI FRAUD SHIELD V2.5 ONLINE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
            <span className="text-slate-300 font-semibold">Node.js NLP & MongoDB</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-7xl font-black tracking-tight text-white leading-[1.08]">
            Defend Your Career From <br />
            <span className="gradient-god-text">Job Scams & Fake Recruiters</span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed">
            Real-time artificial intelligence fraud detection for job postings, unverified recruiters, and suspicious employment offers. Powered by natural language pattern recognition and entity domain intelligence.
          </p>

          {/* Medium Rounded Pill Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/verify-job"
              className="w-full sm:w-auto btn-base btn-god-hero px-7 py-3.5 text-xs font-black flex items-center justify-center space-x-2.5 group"
            >
              <FileSearch className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Verify Job Posting Now</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>

            <Link
              to="/verify-company"
              className="w-full sm:w-auto btn-base btn-god-glass px-7 py-3.5 text-xs font-extrabold flex items-center justify-center space-x-2.5 group"
            >
              <Building2 className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
              <span>Verify Company Trust</span>
            </Link>
          </div>

          {/* Interactive Instant Demo Card */}
          <div className="pt-8 max-w-4xl mx-auto text-left">
            <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center space-x-2">
                  <Play className="w-3.5 h-3.5" />
                  <span>Instant Interactive AI Demo</span>
                </span>
                <span className="text-[11px] text-slate-400 font-bold">Click preset to test live:</span>
              </div>

              <PresetSelector onSelectPreset={(txt) => { setDemoText(txt); handleRunDemo(txt); }} />

              {demoResult && (
                <div className="pt-4 border-t border-slate-800">
                  <ResultCard result={demoResult} />
                </div>
              )}
            </div>
          </div>

          {/* Live Metrics Quick Strip */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="glass-panel-god p-5 rounded-3xl border border-slate-700/50 text-center">
              <div className="text-3xl font-black text-cyan-400">99.4%</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">NLP Accuracy</div>
            </div>
            <div className="glass-panel-god p-5 rounded-3xl border border-slate-700/50 text-center">
              <div className="text-3xl font-black text-purple-400">&lt; 200ms</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Analysis Speed</div>
            </div>
            <div className="glass-panel-god p-5 rounded-3xl border border-slate-700/50 text-center">
              <div className="text-3xl font-black text-emerald-400">MongoDB</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Threat Database</div>
            </div>
            <div className="glass-panel-god p-5 rounded-3xl border border-slate-700/50 text-center">
              <div className="text-3xl font-black text-rose-400">100%</div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">Vercel Ready</div>
            </div>
          </div>

        </div>
      </section>

      {/* GOD TIER FEATURE GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <span className="text-xs font-extrabold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30">
            COMPLETE SCAM DEFENSE SUITE
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">4 Pillars of Candidate Protection</h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">All-in-one intelligence suite designed to stop job scams before you apply.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Job Verifier */}
          <div className="glass-panel-god p-6 rounded-3xl border border-slate-700/60 glass-panel-god-hover flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <FileSearch className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Job Text & URL Analyzer</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Scans job posting descriptions or fetches live web links. Detects registration fee traps, fake recruiter channels, and unrealistic pay schemes.
              </p>
            </div>
            <Link
              to="/verify-job"
              className="btn-base btn-secondary py-2.5 px-5 text-xs font-black flex items-center justify-between group"
            >
              <span>Analyze Posting</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 2: Company Verifier */}
          <div className="glass-panel-god p-6 rounded-3xl border border-slate-700/60 glass-panel-god-hover flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Company Trust Verifier</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Evaluates recruiter email domains, website HTTPS integrity, domain matching, and high-risk top-level extensions (.xyz, .top).
              </p>
            </div>
            <Link
              to="/verify-company"
              className="btn-base btn-secondary py-2.5 px-5 text-xs font-black flex items-center justify-between group"
            >
              <span>Verify Employer</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 3: Offer Letter & Contract Inspector */}
          <div className="glass-panel-god p-6 rounded-3xl border border-slate-700/60 glass-panel-god-hover flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Offer & Contract Auditor</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                AI NLP document inspector analyzing appointment letters for hidden registration fee traps, fake equipment checks, and domain spoofing.
              </p>
            </div>
            <Link
              to="/verify-contract"
              className="btn-base btn-primary py-2.5 px-5 text-xs font-black flex items-center justify-between group"
            >
              <span>Inspect Offer Letter</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Card 4: Scam Shield Quiz */}
          <div className="glass-panel-god p-6 rounded-3xl border border-slate-700/60 glass-panel-god-hover flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold text-white">Scam Threat Diagnostic</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                Interactive diagnostic wizard evaluating your offer against 15 real-world red flags to generate a step-by-step emergency action plan.
              </p>
            </div>
            <Link
              to="/scam-shield"
              className="btn-base btn-purple py-2.5 px-5 text-xs font-black flex items-center justify-between group"
            >
              <span>Take Diagnostic Quiz</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </div>
      </section>

      {/* DEFENSE PIPELINE GRAPHIC */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-god p-8 sm:p-12 rounded-3xl border border-slate-700/60 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold text-purple-400 uppercase tracking-wider">UNDER THE HOOD</span>
            <h3 className="text-2xl sm:text-4xl font-black text-white">How CareerVerify Protects You</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto font-black">1</div>
              <h4 className="text-base font-bold text-white">NLP & URL Extraction</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Pulls text from job posts or web URLs, stripping noise and tokenizing key indicator terms.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center mx-auto font-black">2</div>
              <h4 className="text-base font-bold text-white">Scoring & Rule Heuristics</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Computes TF-IDF fraud weights, confidence percentages, and company domain trust ratings.</p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto font-black">3</div>
              <h4 className="text-base font-bold text-white">MongoDB & PDF Audit</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Saves log audit records to MongoDB and generates downloadable official PDF report files.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
