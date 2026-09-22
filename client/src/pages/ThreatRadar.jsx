import React from 'react';
import { Activity, ShieldAlert, Zap, Globe, AlertTriangle, PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const SCAM_TYPE_DATA = [
  { name: 'Telegram / WhatsApp Chat', value: 38, color: '#f43f5e' },
  { name: 'Registration & Software Fee', value: 27, color: '#be123c' },
  { name: 'Fake Check & Equipment', value: 20, color: '#fb923c' },
  { name: 'Identity Theft Phishing', value: 15, color: '#a855f7' },
];

const JOB_CATEGORY_RISK = [
  { category: 'Data Entry / Typing', riskScore: 92 },
  { category: 'Customer Service Remote', riskScore: 78 },
  { category: 'Virtual Assistant', riskScore: 68 },
  { category: 'Crypto / Forex Trader', riskScore: 88 },
  { category: 'Software Engineer', riskScore: 12 },
  { category: 'Data Analyst', riskScore: 18 },
];

export default function ThreatRadar() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-xs font-black uppercase tracking-wider">
          <Activity className="w-4 h-4" />
          <span>Real-Time Intelligence Heatmap</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Scam Risk Radar & Threat Heatmap</h1>
        <p className="text-sm text-slate-300 max-w-xl mx-auto">
          Visual analytics radar monitoring live job fraud patterns across employment sectors, payment schemes, and regional threat hotspots.
        </p>
      </div>

      {/* Top Threat Indicators Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel-god p-6 rounded-3xl border border-slate-700/60 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Top Threat Category</div>
            <div className="text-lg font-black text-white">Telegram Fee Traps</div>
            <div className="text-[11px] text-rose-400 font-bold">38% of reported scams</div>
          </div>
        </div>

        <div className="glass-panel-god p-6 rounded-3xl border border-slate-700/60 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Highest Vulnerability Work Mode</div>
            <div className="text-lg font-black text-white">100% Unverified Remote</div>
            <div className="text-[11px] text-amber-400 font-bold">84% of fraudulent posts</div>
          </div>
        </div>

        <div className="glass-panel-god p-6 rounded-3xl border border-slate-700/60 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs font-black text-slate-400 uppercase tracking-wider">Average Extortion Demand</div>
            <div className="text-lg font-black text-white">$145 per Candidate</div>
            <div className="text-[11px] text-cyan-400 font-bold">Registration & setup fees</div>
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Pie Chart: Distribution */}
        <div className="lg:col-span-6 glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <PieIcon className="w-4 h-4 text-cyan-400" />
              <span>Scam Scheme Distribution</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Live Dataset</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={SCAM_TYPE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {SCAM_TYPE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {SCAM_TYPE_DATA.map((item) => (
              <div key={item.name} className="flex items-center space-x-2 p-2 rounded-xl bg-slate-900/80">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-300 text-[11px] truncate font-medium">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bar Chart: Risk by Role */}
        <div className="lg:col-span-6 glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-rose-400" />
              <span>Job Role Vulnerability Score</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">Risk Index / 100</span>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={JOB_CATEGORY_RISK} layout="vertical" margin={{ left: 20 }}>
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={10} />
                <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={10} width={130} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="riskScore" fill="#f43f5e" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
