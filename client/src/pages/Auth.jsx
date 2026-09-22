import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Mail, User, Sparkles, Loader2, KeyRound, CheckCircle2, ShieldCheck, TestTube2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (type) => {
    try {
      setLoading(true);
      setError(null);
      let demoEmail = 'admin@careerverify.com';
      let demoPass = 'admin123';

      if (type === 'tester') {
        demoEmail = 'tester@careerverify.com';
        demoPass = 'tester123';
      }

      setEmail(demoEmail);
      setPassword(demoPass);

      const res = await login(demoEmail, demoPass);
      setSuccessMsg(`Logged in successfully as ${type.toUpperCase()}!`);
      const target = (res?.user?.role === 'admin' || type === 'admin') ? '/admin' : '/dashboard';
      setTimeout(() => navigate(target), 800);
    } catch (err) {
      setError(err.message || 'Demo login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please verify your password.');
        return;
      }
    }

    try {
      setLoading(true);
      if (mode === 'login') {
        const res = await login(email, password);
        setSuccessMsg('Welcome back!');
        const target = res?.user?.role === 'admin' ? '/admin' : '/dashboard';
        setTimeout(() => navigate(target), 800);
      } else {
        // Public registration automatically assigns 'candidate' role
        const res = await signup(name, email, password, 'candidate');
        setSuccessMsg('Account registered successfully as Candidate!');
        setTimeout(() => navigate('/dashboard'), 800);
      }
    } catch (err) {
      setError(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white mx-auto shadow-xl shadow-cyan-500/20">
          <Shield className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {mode === 'login' ? 'Access CareerVerify' : 'Create Candidate Account'}
        </h1>
        <p className="text-xs text-slate-400">
          {mode === 'login'
            ? 'Sign in to your account or use 1-click Demo credentials.'
            : 'Register your account as a candidate to verify jobs & save threat audit logs.'}
        </p>
      </div>

      {/* Auth Panel */}
      <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-2xl space-y-6">
        
        {/* Mode Switcher Tabs */}
        <div className="flex items-center space-x-2 p-1 rounded-full bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); setConfirmPassword(''); }}
            className={`flex-1 py-2 rounded-full text-xs font-black transition-all ${
              mode === 'login' ? 'btn-base btn-primary text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); setConfirmPassword(''); }}
            className={`flex-1 py-2 rounded-full text-xs font-black transition-all ${
              mode === 'signup' ? 'btn-base btn-primary text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* 1-Click Demo Accounts Bar */}
        {mode === 'login' && (
          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-extrabold">
              <span className="flex items-center space-x-1.5 text-cyan-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>1-Click Demo Login IDs</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Pre-seeded</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="p-3 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/40 text-left transition-all active:scale-95 flex items-center justify-center space-x-2 font-bold"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Login as Admin</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('tester')}
                className="p-3 rounded-full bg-purple-950/40 border border-purple-500/40 text-purple-300 hover:bg-purple-900/40 text-left transition-all active:scale-95 flex items-center justify-center space-x-2 font-bold"
              >
                <TestTube2 className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span>Login as Tester</span>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div>
              <label className="font-extrabold text-slate-300 block mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sarah Connor"
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-900 border border-slate-700 text-slate-100 font-medium"
                />
              </div>
            </div>
          )}

          <div>
            <label className="font-extrabold text-slate-300 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-900 border border-slate-700 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-extrabold text-slate-300 block mb-1">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3 rounded-full bg-slate-900 border border-slate-700 text-slate-100 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-slate-400 hover:text-cyan-400 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'signup' && (
            <div>
              <label className="font-extrabold text-slate-300 block mb-1">Confirm Password</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 rounded-full bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-slate-400 hover:text-cyan-400 transition-colors"
                  title={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-full bg-rose-950/50 border border-rose-500/40 text-rose-300 text-xs flex items-center space-x-2 px-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-full bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 px-6">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-full btn-base btn-primary text-white font-black text-xs flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Sign In to Account' : 'Complete Registration'}</span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}
