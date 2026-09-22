import React, { useEffect, useState } from 'react';
import { LayoutDashboard, ShieldCheck, AlertOctagon, Activity, TrendingUp, AlertTriangle, RefreshCw, Loader2, Cpu } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { getDashboardStats } from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalJobs: 0,
    realJobs: 0,
    fakeJobs: 0,
    highRisk: 0,
    mediumRisk: 0,
    lowRisk: 0,
    avgConfidence: 0,
    avgFraudScore: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      if (res && typeof res.totalJobs === 'number') {
        setStats(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const pieData = [
    { name: 'Real Jobs', value: stats?.realJobs || 0, color: '#10b981' },
    { name: 'Fake Jobs', value: stats?.fakeJobs || 0, color: '#f43f5e' },
  ];

  const barData = [
    { name: 'Low Risk', count: stats?.lowRisk || 0, fill: '#10b981' },
    { name: 'Medium Risk', count: stats?.mediumRisk || 0, fill: '#f59e0b' },
    { name: 'High Risk', count: stats?.highRisk || 0, fill: '#f43f5e' },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-4 h-4" />
            <span>Telemetry & Risk Intelligence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Fraud Analytics Dashboard</h1>
        </div>
        <button
          onClick={fetchStats}
          className="btn-base btn-secondary px-5 py-2.5 text-xs font-black flex items-center space-x-2 shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Analytics</span>
        </button>
      </div>

      {/* Counter Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="glass-panel-god p-6 rounded-3xl border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider mb-3">
            <span>Total Analyzed</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-4xl font-black text-white">{stats?.totalJobs || 0}</div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">Processed job descriptions</p>
        </div>

        <div className="glass-panel-god p-6 rounded-3xl border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider mb-3">
            <span>Genuine Jobs</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-4xl font-black text-emerald-400">{stats?.realJobs || 0}</div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">Legitimate job postings</p>
        </div>

        <div className="glass-panel-god p-6 rounded-3xl border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider mb-3">
            <span>Fraud Flagged</span>
            <AlertOctagon className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-4xl font-black text-rose-400">{stats?.fakeJobs || 0}</div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">Scam job postings detected</p>
        </div>

        <div className="glass-panel-god p-6 rounded-3xl border border-slate-700/60 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs font-black uppercase tracking-wider mb-3">
            <span>Avg Confidence</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-4xl font-black text-white">{stats?.avgConfidence || 0}%</div>
          <p className="text-[11px] text-slate-400 font-medium mt-1">Average AI certainty</p>
        </div>

      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pie Chart: Real vs Fake */}
        <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-4 shadow-xl">
          <h3 className="text-xs font-black text-white uppercase tracking-wider">Classification Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={6}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', fontSize: '12px', color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar Chart: Risk Distribution */}
        <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-4 shadow-xl">
          <h3 className="text-xs font-black text-white uppercase tracking-wider">Risk Profile Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Recent Activity Log */}
      <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 space-y-4 shadow-xl">
        <h3 className="text-xs font-black text-white uppercase tracking-wider">Recent Activity Feed</h3>
        <div className="space-y-2.5">
          {stats?.recentActivity && stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
                <div className="flex items-center space-x-3">
                  {item.prediction === 'Fake Job' ? (
                    <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
                  ) : (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  )}
                  <span className="font-extrabold text-white max-w-xs sm:max-w-md truncate">{item.jobTitle}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    item.prediction === 'Fake Job' ? 'bg-rose-950 text-rose-300 border border-rose-500/30' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                  }`}>
                    {item.prediction}
                  </span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs text-slate-400 text-center py-6">No recent verification activity.</p>
          )}
        </div>
      </div>

    </div>
  );
}
