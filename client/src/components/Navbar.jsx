import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, ShieldCheck, FileSearch, Building2, FileCheck, History, LayoutDashboard, Menu, X, ShieldAlert, LifeBuoy, Columns, ChevronDown, Sparkles, Activity, LogOut, User, KeyRound, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const primaryLinks = [
    { name: 'Verify Job', path: '/verify-job', icon: FileSearch },
    { name: 'Company Verifier', path: '/verify-company', icon: Building2 },
    { name: 'Offer Audit', path: '/verify-contract', icon: FileCheck, badge: 'AI' },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  ];

  const secondaryTools = [
    { name: 'Scam Diagnostic Quiz', path: '/scam-shield', icon: LifeBuoy, desc: 'Interactive threat wizard' },
    { name: 'Threat Heatmap & Radar', path: '/threat-radar', icon: Activity, desc: 'Visual scam distribution radar' },
    { name: 'Side-by-Side Comparer', path: '/compare-offers', icon: Columns, desc: 'Compare competing offers' },
    { name: 'Verification Audit Logs', path: '/history', icon: History, desc: 'MongoDB threat history archive' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 pt-4 pb-2">
      <div className="max-w-6xl mx-auto glass-nav rounded-full border border-slate-700/50 shadow-xl shadow-black/40 px-4 sm:px-6 py-2.5 transition-all">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group shrink-0 pl-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-4 h-4" />
            </div>
            <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1">
              Career<span className="gradient-god-text font-black">Verify</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            </span>
          </Link>

          {/* Center Capsule Navigation - SHOWN ONLY AFTER SIGN IN */}
          {user ? (
            <div className="hidden md:flex items-center space-x-1 bg-slate-900/80 px-2 py-1 rounded-full border border-slate-800">
              {primaryLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
                      active
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="text-[8px] font-extrabold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}

              {/* Additional Tools Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-1 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                    secondaryTools.some((t) => isActive(t.path))
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <span>Tools ▾</span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-72 glass-nav rounded-2xl border border-slate-700/80 p-2 shadow-2xl space-y-1 animate-fadeIn z-50">
                    {secondaryTools.map((tool) => {
                      const Icon = tool.icon;
                      const active = isActive(tool.path);
                      return (
                        <Link
                          key={tool.path}
                          to={tool.path}
                          onClick={() => setDropdownOpen(false)}
                          className={`flex items-start space-x-3 p-2.5 rounded-xl transition-all ${
                            active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'hover:bg-slate-800/80 text-slate-300'
                          }`}
                        >
                          <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${active ? 'text-cyan-400' : 'text-slate-400'}`} />
                          <div>
                            <div className="text-xs font-bold text-white">{tool.name}</div>
                            <div className="text-[10px] text-slate-400">{tool.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Admin Console Link (Shown if user is Admin) */}
              {user && user.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                    isActive('/admin')
                      ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/30'
                      : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Console</span>
                </Link>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2 text-xs font-extrabold text-slate-400">
              <Lock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Features Locked • Sign In Required</span>
            </div>
          )}

          {/* Right Action / Auth Pill Buttons */}
          <div className="hidden md:flex items-center space-x-2 pr-1">
            {user ? (
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase flex items-center space-x-1.5 ${
                  user.role === 'admin'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : user.role === 'tester'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                    : 'bg-slate-800 text-slate-200 border border-slate-700'
                }`}>
                  <User className="w-3.5 h-3.5" />
                  <span>{(user?.name || 'User').split(' ')[0]} ({user?.role || 'candidate'})</span>
                </span>

                <button
                  onClick={logout}
                  className="btn-base btn-secondary p-2 text-xs text-rose-400 hover:text-rose-300"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-base btn-primary px-5 py-2 text-xs font-black flex items-center space-x-1.5 group"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Sign In / Demo Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-2 max-w-6xl mx-auto glass-nav rounded-2xl border border-slate-700/60 p-3 space-y-1 shadow-2xl">
          {user ? (
            <>
              {primaryLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-extrabold ${
                      active ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
              <div className="border-t border-slate-800 my-1 pt-1 space-y-1">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-400" />
                    <span>Admin Console (Master Powers)</span>
                  </Link>
                )}
                {secondaryTools.map((tool) => {
                  const Icon = tool.icon;
                  const active = isActive(tool.path);
                  return (
                    <Link
                      key={tool.path}
                      to={tool.path}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold ${
                        active ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-purple-400" />
                      <span>{tool.name}</span>
                    </Link>
                  );
                })}
                <button
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full text-left flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-extrabold text-rose-400 hover:bg-slate-800"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out ({user?.name || 'User'})</span>
                </button>
              </div>
            </>
          ) : (
            <div className="p-3 text-center space-y-3">
              <p className="text-xs text-slate-400 font-bold">Sign in to unlock all verification tools.</p>
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full btn-base btn-primary py-3 text-xs font-black flex items-center justify-center space-x-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Sign In / Demo Login</span>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
