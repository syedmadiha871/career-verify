import React, { useState } from 'react';
import { Columns, ShieldCheck, AlertTriangle, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
import { predictJob } from '../services/api';

export default function OfferComparer() {
  const [offerA, setOfferA] = useState({ title: '', desc: '', company: '' });
  const [offerB, setOfferB] = useState({ title: '', desc: '', company: '' });
  const [resA, setResA] = useState(null);
  const [resB, setResB] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!offerA.desc || !offerB.desc) return;

    try {
      setLoading(true);
      const [dataA, dataB] = await Promise.all([
        predictJob(offerA.desc),
        predictJob(offerB.desc),
      ]);
      setResA(dataA);
      setResB(dataB);
    } catch (err) {
      alert('Failed to compare offers.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-xs font-black uppercase tracking-wider">
          <Columns className="w-4 h-4" />
          <span>Multi-Offer Matrix Analysis</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Side-by-Side Offer Comparer</h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Compare two competing job offers side-by-side to evaluate fraud risk, legitimacy score, and key indicator differences.
        </p>
      </div>

      <form onSubmit={handleCompare} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Offer A */}
          <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-cyan-400 uppercase tracking-wider">Offer A</h3>
              <span className="text-[10px] text-slate-500 font-mono">Job #1</span>
            </div>
            <input
              type="text"
              value={offerA.title}
              onChange={(e) => setOfferA({ ...offerA, title: e.target.value })}
              placeholder="Job Title (e.g. Full Stack Engineer)"
              className="w-full p-3.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-white font-medium px-4"
            />
            <textarea
              rows={7}
              value={offerA.desc}
              onChange={(e) => setOfferA({ ...offerA, desc: e.target.value })}
              placeholder="Paste Job Description for Offer A..."
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700/80 text-xs text-white font-mono leading-relaxed"
            />
          </div>

          {/* Offer B */}
          <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-purple-400 uppercase tracking-wider">Offer B</h3>
              <span className="text-[10px] text-slate-500 font-mono">Job #2</span>
            </div>
            <input
              type="text"
              value={offerB.title}
              onChange={(e) => setOfferB({ ...offerB, title: e.target.value })}
              placeholder="Job Title (e.g. Data Analyst)"
              className="w-full p-3.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-white font-medium px-4"
            />
            <textarea
              rows={7}
              value={offerB.desc}
              onChange={(e) => setOfferB({ ...offerB, desc: e.target.value })}
              placeholder="Paste Job Description for Offer B..."
              className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-700/80 text-xs text-white font-mono leading-relaxed"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !offerA.desc || !offerB.desc}
          className="w-full py-4.5 rounded-full btn-base btn-purple text-white font-black text-sm flex items-center justify-center space-x-2 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{loading ? 'Running Side-by-Side Analysis...' : 'Compare Both Offers'}</span>
        </button>
      </form>

      {/* Results Comparison Grid */}
      {resA && resB && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Result A */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl ${
            resA.prediction === 'Fake Job' ? 'bg-rose-950/40 border-rose-500/40' : 'bg-emerald-950/40 border-emerald-500/40'
          }`}>
            <h4 className="text-base font-black text-white mb-1">{offerA.title || 'Offer A Result'}</h4>
            <div className={`text-3xl font-black mb-3 ${resA.prediction === 'Fake Job' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {resA.prediction}
            </div>
            <div className="text-xs text-slate-300 space-y-2 font-mono">
              <div className="flex justify-between p-2.5 rounded-2xl bg-slate-900/60"><span>Confidence:</span> <span className="font-extrabold">{resA.confidence}%</span></div>
              <div className="flex justify-between p-2.5 rounded-2xl bg-slate-900/60"><span>Fraud Index:</span> <span className="font-extrabold">{resA.fraud_score} / 100</span></div>
              <div className="flex justify-between p-2.5 rounded-2xl bg-slate-900/60"><span>Risk Rating:</span> <span className="font-extrabold">{resA.risk}</span></div>
            </div>
          </div>

          {/* Result B */}
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl ${
            resB.prediction === 'Fake Job' ? 'bg-rose-950/40 border-rose-500/40' : 'bg-emerald-950/40 border-emerald-500/40'
          }`}>
            <h4 className="text-base font-black text-white mb-1">{offerB.title || 'Offer B Result'}</h4>
            <div className={`text-3xl font-black mb-3 ${resB.prediction === 'Fake Job' ? 'text-rose-400' : 'text-emerald-400'}`}>
              {resB.prediction}
            </div>
            <div className="text-xs text-slate-300 space-y-2 font-mono">
              <div className="flex justify-between p-2.5 rounded-2xl bg-slate-900/60"><span>Confidence:</span> <span className="font-extrabold">{resB.confidence}%</span></div>
              <div className="flex justify-between p-2.5 rounded-2xl bg-slate-900/60"><span>Fraud Index:</span> <span className="font-extrabold">{resB.fraud_score} / 100</span></div>
              <div className="flex justify-between p-2.5 rounded-2xl bg-slate-900/60"><span>Risk Rating:</span> <span className="font-extrabold">{resB.risk}</span></div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
