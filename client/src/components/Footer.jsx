import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Heart, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-800 bg-[#070d1e] text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <Shield className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold text-white">Career<span className="gradient-text">Verify</span> AI</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              Protecting candidates and job seekers from fraudulent postings, recruitment scams, and phishing schemes using NLP artificial intelligence and automated company verification algorithms.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Core Modules</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/verify-job" className="hover:text-cyan-400 transition-colors">Job Fraud Analysis</Link></li>
              <li><Link to="/verify-company" className="hover:text-cyan-400 transition-colors">Company Trust Verifier</Link></li>
              <li><Link to="/history" className="hover:text-cyan-400 transition-colors">Audit History Logs</Link></li>
              <li><Link to="/dashboard" className="hover:text-cyan-400 transition-colors">Fraud Metrics Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Architecture</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>React + Vite SPA</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Node.js / Express API</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>MongoDB Database</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                <span>Vercel / Netlify Deploy</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerVerify AI. All rights reserved.</p>
          <p className="flex items-center space-x-1 mt-2 sm:mt-0">
            <span>Powered by Node.js NLP Engine & MongoDB</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
