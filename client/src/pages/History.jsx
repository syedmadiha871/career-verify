import React, { useState, useEffect } from 'react';
import { History as HistoryIcon, Search, Filter, Trash2, Eye, Calendar, AlertOctagon, ShieldCheck, Loader2, X, RefreshCw } from 'lucide-react';
import { getHistory, deleteHistoryItem } from '../services/api';
import PDFReport from '../components/PDFReport';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [predictionFilter, setPredictionFilter] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getHistory({
        search,
        risk: riskFilter,
        prediction: predictionFilter,
      });
      setHistory(data.history || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [riskFilter, predictionFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this history audit record?')) {
      try {
        await deleteHistoryItem(id);
        setHistory(history.filter((item) => (item._id || item.id) !== id));
        if (selectedRecord && (selectedRecord._id || selectedRecord.id) === id) {
          setSelectedRecord(null);
        }
      } catch (err) {
        alert('Failed to delete record.');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
            <HistoryIcon className="w-4 h-4" />
            <span>MongoDB Threat Log Archive</span>
          </div>
          <h1 className="text-3xl font-black text-white">Verification History</h1>
        </div>
        <button
          onClick={fetchLogs}
          className="btn-base btn-secondary px-5 py-2.5 text-xs font-black flex items-center space-x-2 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel-god p-4 rounded-full border border-slate-700/60 flex flex-col md:flex-row items-center justify-between gap-4 px-6">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-auto flex-1 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-4 top-3.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title or keyword..."
            className="w-full pl-11 pr-4 py-3 rounded-full bg-slate-900/90 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 font-medium"
          />
        </form>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="py-3 px-4 rounded-full bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none font-bold"
          >
            <option value="">All Risk Levels</option>
            <option value="Low">Low Risk</option>
            <option value="Medium">Medium Risk</option>
            <option value="High">High Risk</option>
          </select>

          <select
            value={predictionFilter}
            onChange={(e) => setPredictionFilter(e.target.value)}
            className="py-3 px-4 rounded-full bg-slate-900 border border-slate-700 text-slate-200 text-xs focus:outline-none font-bold"
          >
            <option value="">All Verdicts</option>
            <option value="Real Job">Real Jobs</option>
            <option value="Fake Job">Fake Jobs</option>
          </select>
        </div>
      </div>

      {/* Table Log */}
      <div className="glass-panel-god rounded-3xl border border-slate-700/60 overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan-400" />
            <p className="text-xs font-semibold">Loading verification history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <p className="text-sm font-bold text-white">No Verification Logs Found</p>
            <p className="text-xs">Run a job description analysis to store records in MongoDB.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider font-black border-b border-slate-800">
                <tr>
                  <th className="py-4 px-6">Job Title</th>
                  <th className="py-4 px-4">Verdict</th>
                  <th className="py-4 px-4">Confidence</th>
                  <th className="py-4 px-4">Risk</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {history.map((record) => {
                  const id = record._id || record.id;
                  const isFake = record.prediction === 'Fake Job';
                  return (
                    <tr
                      key={id}
                      onClick={() => setSelectedRecord(record)}
                      className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                    >
                      <td className="py-4 px-6 font-extrabold text-white max-w-xs truncate">
                        {record.jobTitle || 'Job Description Analysis'}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase ${
                          isFake ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}>
                          {isFake ? <AlertOctagon className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                          <span>{record.prediction}</span>
                        </span>
                      </td>
                      <td className="py-4 px-4 font-bold text-slate-200">
                        {record.confidence}%
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase ${
                          record.risk === 'High'
                            ? 'bg-rose-950 text-rose-400'
                            : record.risk === 'Medium'
                            ? 'bg-amber-950 text-amber-400'
                            : 'bg-emerald-950 text-emerald-400'
                        }`}>
                          {record.risk}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRecord(record);
                          }}
                          className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-400 transition-transform active:scale-95"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(id, e)}
                          className="p-2 rounded-full bg-slate-800 hover:bg-rose-950 text-rose-400 transition-transform active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel-god max-w-2xl w-full rounded-3xl border border-slate-700/80 p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-lg font-black text-white">{selectedRecord.jobTitle}</h3>
              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-black">Verdict</span>
                <div className={`text-sm font-black mt-1 ${selectedRecord.prediction === 'Fake Job' ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {selectedRecord.prediction}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-black">Confidence</span>
                <div className="text-sm font-black text-white mt-1">{selectedRecord.confidence}%</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-black">Risk Rating</span>
                <div className="text-sm font-black text-amber-400 mt-1">{selectedRecord.risk}</div>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Detected Reasons</h4>
              <ul className="space-y-2 text-xs text-slate-300">
                {selectedRecord.reasons?.map((r, i) => (
                  <li key={i} className="p-3 rounded-2xl bg-slate-900 border border-slate-800 font-medium">• {r}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Submitted Text</h4>
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 max-h-40 overflow-y-auto whitespace-pre-wrap">
                {selectedRecord.jobDescription}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-2">
              <PDFReport result={{
                prediction: selectedRecord.prediction,
                confidence: selectedRecord.confidence,
                fraud_score: selectedRecord.fraudScore,
                risk: selectedRecord.risk,
                reasons: selectedRecord.reasons,
                job_text: selectedRecord.jobDescription
              }} />
              <button
                onClick={() => setSelectedRecord(null)}
                className="btn-base btn-secondary px-5 py-2.5 text-xs font-extrabold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
