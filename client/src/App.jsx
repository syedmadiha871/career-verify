import React, { lazy, Suspense, Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { Loader2, AlertTriangle, RefreshCw } from 'lucide-react';

// Direct high-speed imports for primary core pages
import Home from './pages/Home';
import JobVerify from './pages/JobVerify';
import CompanyVerify from './pages/CompanyVerify';
import ContractVerify from './pages/ContractVerify';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';

// Lazy-load secondary tool pages & admin dashboard
const ScamShield = lazy(() => import('./pages/ScamShield'));
const OfferComparer = lazy(() => import('./pages/OfferComparer'));
const History = lazy(() => import('./pages/History'));
const ThreatRadar = lazy(() => import('./pages/ThreatRadar'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled UI Error Caught by Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-xl">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-white">Something went wrong</h2>
          <p className="text-xs text-slate-400 max-w-md">
            {this.state.error?.message || 'An unexpected rendering error occurred.'}
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/dashboard';
              }}
              className="btn-base btn-primary px-5 py-2.5 text-xs font-black flex items-center space-x-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reload Application</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const PageLoader = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
    <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Loading Module...</p>
  </div>
);

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen bg-[#050914] text-slate-100 selection:bg-cyan-500 selection:text-white bg-god-mesh">
            <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public Unauthenticated Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/auth" element={<Auth />} />

                  {/* Admin Master Route */}
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                  {/* Protected Feature Routes (Require Sign In) */}
                  <Route path="/verify-job" element={<ProtectedRoute><JobVerify /></ProtectedRoute>} />
                  <Route path="/verify-company" element={<ProtectedRoute><CompanyVerify /></ProtectedRoute>} />
                  <Route path="/verify-contract" element={<ProtectedRoute><ContractVerify /></ProtectedRoute>} />
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/scam-shield" element={<ProtectedRoute><ScamShield /></ProtectedRoute>} />
                  <Route path="/compare-offers" element={<ProtectedRoute><OfferComparer /></ProtectedRoute>} />
                  <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                  <Route path="/threat-radar" element={<ProtectedRoute><ThreatRadar /></ProtectedRoute>} />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}
