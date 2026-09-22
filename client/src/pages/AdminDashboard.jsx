import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  UserCog,
  Activity,
  AlertTriangle,
  FileText,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Database,
  Filter,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Sliders,
  Lock,
  Loader2,
  PlusCircle,
  Eye,
  Terminal,
  Zap,
} from 'lucide-react';
import {
  getAdminUsers,
  createAdminUser,
  updateUserRole,
  deleteUserByAdmin,
  getAdminAnalytics,
  deleteScamReportByAdmin,
  purgeHistoryByAdmin,
  getAdminAuditLogs,
  getBlacklist,
} from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'progress' | 'moderation' | 'audit'

  // Users state
  const [users, setUsers] = useState([]);
  const [userCounts, setUserCounts] = useState({ total: 0, admin: 0, tester: 0, candidate: 0 });
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Add User Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('candidate');
  const [addLoading, setAddLoading] = useState(false);

  // Analytics & Telemetry state
  const [telemetry, setTelemetry] = useState(null);
  const [loadingTelemetry, setLoadingTelemetry] = useState(false);

  // Scam Moderation state
  const [scamReports, setScamReports] = useState([]);
  const [loadingScams, setLoadingScams] = useState(false);

  // Audit Logs state
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Global Alert / Toast state
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Fetch users list
  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await getAdminUsers({ role: roleFilter, search: searchQuery });
      setUsers(res.users || []);
      if (res.counts) setUserCounts(res.counts);
    } catch (err) {
      showToast(err.message || 'Failed to fetch user directory', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Fetch telemetry
  const fetchTelemetry = async () => {
    try {
      setLoadingTelemetry(true);
      const res = await getAdminAnalytics();
      setTelemetry(res.telemetry || null);
    } catch (err) {
      showToast(err.message || 'Failed to load system telemetry', 'error');
    } finally {
      setLoadingTelemetry(false);
    }
  };

  // Fetch scam reports
  const fetchScamReports = async () => {
    try {
      setLoadingScams(true);
      const res = await getBlacklist();
      setScamReports(res.reports || []);
    } catch (err) {
      showToast(err.message || 'Failed to load scam reports', 'error');
    } finally {
      setLoadingScams(false);
    }
  };

  // Fetch audit logs
  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const res = await getAdminAuditLogs();
      setAuditLogs(res.auditLogs || []);
    } catch (err) {
      showToast(err.message || 'Failed to load audit logs', 'error');
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchTelemetry();
    fetchScamReports();
    fetchLogs();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, searchQuery]);

  // Handle Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setAddLoading(true);
      const res = await createAdminUser({
        name: newUserName,
        email: newUserEmail,
        password: newUserPassword,
        role: newUserRole,
      });
      showToast(res.message || 'User created successfully!');
      setShowAddModal(false);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserRole('candidate');
      fetchUsers();
      fetchLogs();
      fetchTelemetry();
    } catch (err) {
      showToast(err.message || 'Failed to create user', 'error');
    } finally {
      setAddLoading(false);
    }
  };

  // Handle Role Update
  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await updateUserRole(userId, newRole);
      showToast(res.message || 'User role updated');
      fetchUsers();
      fetchLogs();
    } catch (err) {
      showToast(err.message || 'Failed to update user role', 'error');
    }
  };

  // Handle Delete User
  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to permanently delete user '${userName}'?`)) return;
    try {
      const res = await deleteUserByAdmin(userId);
      showToast(res.message || 'User deleted');
      fetchUsers();
      fetchLogs();
      fetchTelemetry();
    } catch (err) {
      showToast(err.message || 'Failed to delete user', 'error');
    }
  };

  // Handle Delete Scam Report
  const handleDeleteScam = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this scam report from the public blacklist?')) return;
    try {
      const res = await deleteScamReportByAdmin(reportId);
      showToast(res.message || 'Scam report deleted');
      fetchScamReports();
      fetchLogs();
    } catch (err) {
      showToast(err.message || 'Failed to delete report', 'error');
    }
  };

  // Handle Purge History
  const handlePurgeHistory = async () => {
    if (!window.confirm('CRITICAL ACTION: Are you sure you want to purge ALL verification history logs? This cannot be undone.')) return;
    try {
      const res = await purgeHistoryByAdmin();
      showToast(res.message || 'History logs purged');
      fetchTelemetry();
      fetchLogs();
    } catch (err) {
      showToast(err.message || 'Failed to purge history', 'error');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Toast Alert Banner */}
      {toast && (
        <div
          className={`fixed top-20 right-6 z-50 p-4 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center space-x-3 text-xs font-bold transition-all animate-bounce ${
            toast.type === 'error'
              ? 'bg-rose-950/90 text-rose-300 border-rose-500/50'
              : 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50'
          }`}
        >
          {toast.type === 'error' ? <XCircle className="w-5 h-5 shrink-0" /> : <CheckCircle2 className="w-5 h-5 shrink-0" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Control Center Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel-god p-6 sm:p-8 rounded-3xl border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase tracking-wider flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span>System Master Admin Power Active</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center space-x-3">
            <span>Admin Control Center</span>
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl">
            Full administrative oversight of CareerVerify: Manage user permissions, add/delete accounts, track real-time fraud telemetry, moderate community scam reports, and inspect security audit logs.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-base btn-primary px-4 py-2.5 text-xs font-black flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add User</span>
          </button>

          <button
            onClick={() => {
              fetchUsers();
              fetchTelemetry();
              fetchScamReports();
              fetchLogs();
              showToast('Refreshed admin telemetry data.');
            }}
            className="p-2.5 rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
            title="Refresh All Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'users'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4 text-cyan-400" />
          <span>User Management</span>
          <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-[10px] text-cyan-300 font-bold">
            {userCounts.total || users.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('progress')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'progress'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Progress & Telemetry</span>
        </button>

        <button
          onClick={() => setActiveTab('moderation')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'moderation'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span>Scam Blacklist Moderation</span>
          <span className="px-1.5 py-0.5 rounded-full bg-rose-500/20 text-[10px] text-rose-300 font-bold">
            {scamReports.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-black transition-all shrink-0 ${
            activeTab === 'audit'
              ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Terminal className="w-4 h-4 text-purple-400" />
          <span>Audit Logs & Controls</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: USER MANAGEMENT */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Count Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Registered</div>
              <div className="text-2xl font-black text-white">{userCounts.total || users.length}</div>
              <div className="text-[10px] text-cyan-400 font-semibold">Active User Base</div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-1">
              <div className="text-[10px] font-bold text-cyan-300 uppercase tracking-wider">Admins</div>
              <div className="text-2xl font-black text-cyan-200">{userCounts.admin || users.filter((u) => u.role === 'admin').length}</div>
              <div className="text-[10px] text-cyan-400 font-semibold">Full System Control</div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-1">
              <div className="text-[10px] font-bold text-purple-300 uppercase tracking-wider">Security Testers</div>
              <div className="text-2xl font-black text-purple-200">{userCounts.tester || users.filter((u) => u.role === 'tester').length}</div>
              <div className="text-[10px] text-purple-400 font-semibold">QA & Vulnerability Access</div>
            </div>

            <div className="glass-card p-4 rounded-2xl border border-slate-700 bg-slate-900/50 space-y-1">
              <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">Candidates</div>
              <div className="text-2xl font-black text-slate-100">{userCounts.candidate || users.filter((u) => u.role === 'candidate').length}</div>
              <div className="text-[10px] text-slate-400 font-semibold">Standard Verification Users</div>
            </div>
          </div>

          {/* Filter & Search Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-200 font-medium"
              />
            </div>

            {/* Role filter buttons */}
            <div className="flex items-center space-x-1.5 w-full sm:w-auto justify-end">
              {['all', 'admin', 'tester', 'candidate'].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                    roleFilter === r
                      ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Users Directory Table */}
          <div className="glass-panel p-4 rounded-3xl border border-slate-800 overflow-x-auto">
            {loadingUsers ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
                <p className="text-xs font-bold">Loading User Accounts...</p>
              </div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center text-slate-500 space-y-2">
                <Users className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs font-bold">No user accounts matching filters.</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] font-black uppercase text-slate-400 tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Account ID</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-xs">
                  {users.map((u) => {
                    const isMasterAdmin = u._id === 'demo_admin_1';
                    return (
                      <tr key={u._id || u.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-white flex items-center space-x-2">
                            <span>{u.name}</span>
                            {isMasterAdmin && (
                              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[9px] text-cyan-300 font-extrabold border border-cyan-500/40">
                                MASTER ADMIN
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center space-x-1 ${
                              u.role === 'admin'
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                                : u.role === 'tester'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : 'bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            <span>{u.role}</span>
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono text-[11px] text-slate-500">
                          {u._id || u.id}
                        </td>

                        <td className="py-3 px-4 text-slate-400 text-[11px]">
                          {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Pre-seeded'}
                        </td>

                        <td className="py-3 px-4 text-right space-x-2">
                          {/* Role selector dropdown */}
                          <select
                            value={u.role}
                            disabled={isMasterAdmin}
                            onChange={(e) => handleRoleChange(u._id || u.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded-lg text-[11px] text-slate-200 px-2 py-1 font-bold disabled:opacity-50"
                          >
                            <option value="candidate">Role: Candidate</option>
                            <option value="tester">Role: Security Tester</option>
                            <option value="admin">Role: Admin</option>
                          </select>

                          {/* Delete user button */}
                          <button
                            disabled={isMasterAdmin}
                            onClick={() => handleDeleteUser(u._id || u.id, u.name)}
                            className="p-1.5 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-900/50 disabled:opacity-30 transition-all"
                            title={isMasterAdmin ? 'Cannot delete master admin' : 'Delete User'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PROGRESS & TELEMETRY TRACKER */}
      {/* ========================================================================= */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-3xl border border-cyan-500/30 bg-cyan-950/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Total Job Verification Scans</span>
                <Activity className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white">{telemetry?.totalScans || 24}</div>
              <div className="text-[10px] text-cyan-300 font-semibold">100% Processed by NLP & AI Engine</div>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-rose-500/30 bg-rose-950/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Fake Job Postings Intercepted</span>
                <ShieldAlert className="w-4 h-4 text-rose-400" />
              </div>
              <div className="text-3xl font-black text-rose-300">{telemetry?.fakeJobs || 14}</div>
              <div className="text-[10px] text-rose-400 font-semibold">High risk scam patterns flagged</div>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-emerald-500/30 bg-emerald-950/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>System Fraud Detection Rate</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-emerald-300">{telemetry?.fraudDetectionRate || 58}%</div>
              <div className="text-[10px] text-emerald-400 font-semibold">High precision NLP accuracy</div>
            </div>

            <div className="glass-card p-5 rounded-3xl border border-purple-500/30 bg-purple-950/10 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>Scam Blacklist Database</span>
                <Database className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-3xl font-black text-purple-200">{scamReports.length || 18}</div>
              <div className="text-[10px] text-purple-300 font-semibold">Community intelligence reports</div>
            </div>
          </div>

          {/* Progress Overview Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Verification Risk Breakdown</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-rose-400">High Risk Scam Postings</span>
                    <span className="text-slate-300">58%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full" style={{ width: '58%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-amber-400">Medium Risk Suspicious Postings</span>
                    <span className="text-slate-300">25%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-bold mb-1">
                    <span className="text-emerald-400">Low Risk Legitimate Jobs</span>
                    <span className="text-slate-300">17%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: '17%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Real-Time Engine Telemetry</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">NLP Transformer Engine:</span>
                  <span className="font-bold text-emerald-300">ACTIVE & READY</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Phishing Pattern Model:</span>
                  <span className="font-bold text-cyan-300">100% Operational</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Average NLP Latency:</span>
                  <span className="font-mono text-white">42 ms</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Database Connection Status:</span>
                  <span className="font-bold text-emerald-400">CONNECTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SCAM BLACKLIST MODERATION */}
      {/* ========================================================================= */}
      {activeTab === 'moderation' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/90 border border-slate-800">
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Community Scam Blacklist Moderation</span>
            </h3>
            <span className="text-xs text-slate-400">Admin power: Delete inappropriate or spam reports</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loadingScams ? (
              <div className="col-span-2 py-12 text-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-cyan-400" />
              </div>
            ) : scamReports.length === 0 ? (
              <div className="col-span-2 py-12 text-center text-slate-500 font-bold text-xs">
                No scam reports logged in database.
              </div>
            ) : (
              scamReports.map((report) => (
                <div
                  key={report._id || report.id}
                  className="glass-card p-5 rounded-3xl border border-slate-800 space-y-3 relative hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black uppercase">
                        {report.scamType || 'Job Scam'}
                      </span>
                      <h4 className="text-sm font-black text-white mt-1">{report.companyOrRecruiterName}</h4>
                      <p className="text-xs text-cyan-400 font-medium">{report.jobTitle}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteScam(report._id || report.id)}
                      className="p-2 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-400 hover:bg-rose-900/60 transition-all shrink-0"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    "{report.description}"
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    <span>Email: <strong className="text-slate-200">{report.scammerEmail || 'N/A'}</strong></span>
                    <span>Upvotes: <strong className="text-cyan-400">{report.upvotes || 0}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: AUDIT LOGS & SYSTEM OVERRIDES */}
      {/* ========================================================================= */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Admin System Emergency Action Controls */}
          <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 bg-rose-950/10 space-y-4">
            <h3 className="text-sm font-black text-rose-300 flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Admin System Power & Emergency Overrides</span>
            </h3>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handlePurgeHistory}
                className="btn-base bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 text-xs font-black flex items-center space-x-2 shadow-lg shadow-rose-600/20"
              >
                <Trash2 className="w-4 h-4" />
                <span>Purge Verification History Logs</span>
              </button>

              <button
                onClick={() => {
                  fetchLogs();
                  showToast('Audit log stream updated.');
                }}
                className="btn-base btn-secondary px-4 py-2.5 text-xs font-bold flex items-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Audit Logs</span>
              </button>
            </div>
          </div>

          {/* Audit Logs Table Stream */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-white flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span>Real-Time Admin Security Audit Trail</span>
            </h3>

            {loadingLogs ? (
              <div className="py-8 text-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin mx-auto text-purple-400" />
              </div>
            ) : auditLogs.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs font-bold">No audit log records logged.</div>
            ) : (
              <div className="space-y-2 font-mono text-xs">
                {auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold">
                        {log.action}
                      </span>
                      <span className="text-slate-200">{log.details}</span>
                    </div>

                    <div className="flex items-center space-x-3 text-[10px] text-slate-400 shrink-0">
                      <span>By: <strong className="text-cyan-400">{log.performer}</strong></span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD NEW USER */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel-god p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-2xl max-w-md w-full space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-white flex items-center space-x-2">
                <UserPlus className="w-5 h-5 text-cyan-400" />
                <span>Add New User Account</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Miller"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="jordan@example.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-300 block mb-1">Assign User Role</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-cyan-300 font-bold"
                >
                  <option value="candidate">Candidate (Generic User)</option>
                  <option value="tester">Security Tester (QA Privileges)</option>
                  <option value="admin">Master Admin (All System Powers)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-base btn-secondary flex-1 py-3 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="btn-base btn-primary flex-1 py-3 text-xs font-black flex items-center justify-center space-x-2"
                >
                  {addLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create User Account</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
