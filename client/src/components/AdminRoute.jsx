import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, ShieldCheck, KeyRound, ArrowRight } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/10">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-white">Admin Privileges Required</h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            You are currently logged in as <span className="text-cyan-400 font-bold">{user.name}</span> ({user.role.toUpperCase()}). The Admin Control Center is restricted to System Administrators only.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 max-w-md mx-auto">
          <div className="text-xs text-slate-300 font-bold flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Switch to Admin Account to Access Control Center</span>
          </div>
          <Link
            to="/auth"
            className="btn-base btn-primary w-full py-3 text-xs font-black flex items-center justify-center space-x-2"
          >
            <KeyRound className="w-4 h-4" />
            <span>Sign In as Admin (admin@careerverify.com)</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </div>
    );
  }

  return children;
}
