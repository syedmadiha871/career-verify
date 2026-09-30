import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, User, Loader2, KeyRound, CheckCircle2, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup } = useAuth();

  // Mode: 'login' | 'signup' | 'admin'
  const [mode, setMode] = useState(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('mode') === 'admin' ? 'admin' : 'login';
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('mode') === 'admin') {
      setMode('admin');
    }
  }, [location.search]);

  const handleTabChange = (newMode) => {
    setMode(newMode);
    setError(null);
    setSuccessMsg(null);
    setConfirmPassword('');
    if (newMode === 'admin') {
      if (!email || email === 'candidate@example.com') {
        setEmail('admin@careerverify.com');
      }
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
      if (mode === 'login' || mode === 'admin') {
        const res = await login(email, password);
        
        if (mode === 'admin' && res?.user?.role !== 'admin') {
          setError('Access Denied: The credentials provided do not have Administrator permissions.');
          setLoading(false);
          return;
        }

        setSuccessMsg(`Authenticated successfully as ${res?.user?.role?.toUpperCase() || 'USER'}!`);
        const target = res?.user?.role === 'admin' ? '/admin' : '/dashboard';
        setTimeout(() => navigate(target), 800);
      } else {
        // Public registration automatically assigns 'candidate' role
        const res = await signup(name, email, password, 'candidate');
        setSuccessMsg('Account registered successfully as Candidate!');
        setTimeout(() => navigate('/dashboard'), 800);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white mx-auto shadow-xl transition-all ${
          mode === 'admin'
            ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-500/30 ring-2 ring-cyan-400/50'
            : 'bg-gradient-to-tr from-cyan-500 to-blue-600 shadow-cyan-500/20'
        }`}>
          {mode === 'admin' ? <ShieldCheck className="w-7 h-7" /> : <Shield className="w-7 h-7" />}
        </div>
        
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          {mode === 'login' && 'Access CareerVerify'}
          {mode === 'signup' && 'Create Candidate Account'}
          {mode === 'admin' && 'Login as Admin'}
        </h1>
        
        <p className="text-xs text-slate-400">
          {mode === 'login' && 'Sign in to your candidate account to access fraud verification tools.'}
          {mode === 'signup' && 'Register your candidate account to analyze postings & save audit logs.'}
          {mode === 'admin' && 'Restricted Admin Portal • Exclusive administrator credentials required.'}
        </p>
      </div>

      {/* Auth Panel */}
      <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-slate-700/60 shadow-2xl space-y-6">
        
        {/* 3-Mode Tab Switcher */}
        <div className="flex items-center space-x-1 p-1 rounded-full bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => handleTabChange('login')}
            className={`flex-1 py-2 rounded-full text-[11px] font-black transition-all ${
              mode === 'login' ? 'btn-base btn-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('signup')}
            className={`flex-1 py-2 rounded-full text-[11px] font-black transition-all ${
              mode === 'signup' ? 'btn-base btn-primary text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('admin')}
            className={`flex-1 py-2 rounded-full text-[11px] font-black transition-all flex items-center justify-center space-x-1 ${
              mode === 'admin'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                : 'text-cyan-400 hover:text-cyan-300'
            }`}
          >
            <ShieldCheck className="w-3 h-3 shrink-0" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Dedicated Admin Portal Banner */}
        {mode === 'admin' && (
          <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/40 space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-cyan-300 font-black">
              <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Admin Authentication Restricted</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
              1-Click public admin access has been removed for security. Enter your confidential administrator credentials to log in.
            </p>
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
            <label className="font-extrabold text-slate-300 block mb-1">
              {mode === 'admin' ? 'Admin Email Address' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === 'admin' ? 'admin@careerverify.com' : 'candidate@example.com'}
                className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-900 border border-slate-700 text-slate-100 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="font-extrabold text-slate-300 block mb-1">
              {mode === 'admin' ? 'Admin Password' : 'Password'}
            </label>
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
            className={`w-full py-4 rounded-full btn-base text-white font-black text-xs flex items-center justify-center space-x-2 transition-all ${
              mode === 'admin'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/20'
                : 'btn-primary'
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              <span>
                {mode === 'login' && 'Sign In to Account'}
                {mode === 'signup' && 'Complete Registration'}
                {mode === 'admin' && 'Authenticate as Admin'}
              </span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
}

