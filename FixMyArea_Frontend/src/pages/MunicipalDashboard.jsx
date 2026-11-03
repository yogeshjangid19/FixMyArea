import { useState, useEffect, useRef } from 'react';
import api, { getAttachmentUrl } from '../utils/api';
import { CATEGORY_ICONS, STATUS_CLASS, PRIORITY_CLASS, timeAgo, formatDate, CATEGORIES } from '../utils/helpers';
import {
  MapPin,
  CheckCircle,
  Clock,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Save,
  X,
  Filter,
  Building2,
  ShieldAlert,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const StatCard = ({ icon: Icon, label, value, color, desc }) => (
  <div className="glass-card p-5 border border-white/10 hover:border-blue-500/30 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-display font-extrabold text-white">{value ?? '—'}</div>
        <div className="text-xs text-slate-300 font-medium">{label}</div>
        {desc && <div className="text-[10px] text-slate-500 mt-0.5">{desc}</div>}
      </div>
    </div>
  </div>
);

export default function MunicipalDashboard() {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ status: '', category: '', priority: '' });
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [updateForm, setUpdateForm] = useState({ status: '', officialNote: '', assignedTo: '' });
  const [detailImgError, setDetailImgError] = useState(false);

  useEffect(() => {
    api.get('/issues/stats').then(r => setStats(r.data)).catch(() => {});
  }, []);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      const res = await api.get(`/issues?${params}`);
      setIssues(res.data.issues || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.totalIssues || 0);
    } catch {
      toast.error('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, [page, filters]);

  const openIssue = (issue) => {
    setSelected(issue);
    setDetailImgError(false);
    setUpdateForm({
      status: issue.status,
      officialNote: issue.officialNote || '',
      assignedTo: issue.assignedTo || '',
    });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await api.put(`/issues/${selected._id}/status`, updateForm);
      toast.success('Ticket updated and citizen notified!');
      fetchIssues();
      api.get('/issues/stats').then(r => setStats(r.data)).catch(() => {});
      setSelected(null);
    } catch {
      toast.error('Failed to update issue status');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="pointer-events-none absolute w-[500px] h-[500px] rounded-full bg-blue-600/15 blur-[140px] top-0 right-[-150px]" />
      <div className="pointer-events-none absolute w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[130px] top-1/2 left-[-100px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Command Center Header */}
        <div className="glass-strong rounded-2xl p-6 sm:p-8 mb-8 border border-white/15 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-semibold mb-2">
                <Building2 size={13} className="text-blue-400" />
                <span>Municipal Authority Dispatch Desk</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                Municipal Operations Portal
              </h1>
              <p className="text-slate-300 mt-1 text-xs sm:text-sm max-w-xl">
                Triage citizen grievances, assign ward inspection teams, and append transparent resolution notes.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Ward Triage Active</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={AlertTriangle} label="Total Received" value={stats?.total} color="#818cf8" desc="All logged tickets" />
          <StatCard icon={Clock} label="Pending Triage" value={stats?.pending} color="#fbbf24" desc="Needs assignment" />
          <StatCard icon={CheckCircle} label="Work In Progress" value={stats?.inProgress} color="#60a5fa" desc="Field team deployed" />
          <StatCard icon={CheckCircle2} label="Closed / Resolved" value={stats?.resolved} color="#34d399" desc="Verified solutions" />
        </div>

        {/* Filter Controls Bar */}
        <div className="glass-card p-4 sm:p-5 mb-8 flex flex-wrap items-center justify-between gap-4 border border-white/10">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider">
              <Filter size={13} />
              <span>Filters:</span>
            </div>

            <select
              value={filters.status}
              onChange={e => {
                setFilters(f => ({ ...f, status: e.target.value }));
                setPage(1);
              }}
              className="input-glass text-xs py-2 w-auto"
            >
              <option value="">All Statuses</option>
              {STATUSES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={filters.priority}
              onChange={e => {
                setFilters(f => ({ ...f, priority: e.target.value }));
                setPage(1);
              }}
              className="input-glass text-xs py-2 w-auto"
            >
              <option value="">All Priorities</option>
              {['low', 'medium', 'high', 'critical'].map(p => (
                <option key={p} value={p} className="capitalize">{p}</option>
              ))}
            </select>

            <select
              value={filters.category}
              onChange={e => {
                setFilters(f => ({ ...f, category: e.target.value }));
                setPage(1);
              }}
              className="input-glass text-xs py-2 w-auto"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="text-xs text-slate-400 font-medium">
            {total} {total === 1 ? 'grievance' : 'grievances'} found
          </div>
        </div>

        {/* Issue Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={36} className="animate-spin text-blue-400" />
            <p className="text-xs text-slate-400">Loading municipal queue…</p>
          </div>
        ) : issues.length === 0 ? (
          <div className="glass-card p-16 text-center border border-white/10">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-display font-bold text-white text-lg mb-2">No tickets match your filters</h3>
            <p className="text-slate-400 text-xs sm:text-sm">Great job! All issues in this category are addressed.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {issues.map(issue => (
              <MunicipalIssueCard key={issue._id} issue={issue} onClick={() => openIssue(issue)} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2.5 glass rounded-xl text-slate-400 hover:text-white disabled:opacity-30 transition-all border border-white/10"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                  page === i + 1
                    ? 'text-white border-blue-500/50 bg-blue-600 shadow-lg shadow-blue-600/30'
                    : 'glass text-slate-400 hover:text-white border-white/10'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2.5 glass rounded-xl text-slate-400 hover:text-white disabled:opacity-30 transition-all border border-white/10"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Issue Detail & Update Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelected(null)}
        >
          <div
            className="glass-strong rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto border border-white/20 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 glass-strong border-b border-white/10 flex items-center justify-between p-5 rounded-t-3xl z-10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                <h2 className="font-display font-bold text-white text-base sm:text-lg">
                  Update Civic Ticket
                </h2>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 glass rounded-xl flex items-center justify-center text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Issue Details Overview */}
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{CATEGORY_ICONS[selected.category] || '📋'}</span>
                    <div>
                      <h3 className="font-display font-bold text-white text-sm sm:text-base">
                        {selected.issueTitle}
                      </h3>
                      <p className="text-[11px] text-slate-400">{selected.category}</p>
                    </div>
                  </div>
                  <span className={`badge ${PRIORITY_CLASS[selected.priority]} capitalize text-[10px]`}>
                    {selected.priority}
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{selected.issueDescription}</p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
                  <MapPin size={12} className="text-blue-400 shrink-0" />
                  <span>{selected.address}</span>
                  {selected.landmark && <span className="text-slate-500">• Near {selected.landmark}</span>}
                </div>

                {selected.photo && !detailImgError && (
                  <div className="mt-3 rounded-xl overflow-hidden border border-white/10 h-48 bg-slate-900">
                    <img
                      src={getAttachmentUrl(selected.photo)}
                      alt="Citizen Evidence"
                      className="w-full h-full object-cover"
                      onError={() => setDetailImgError(true)}
                    />
                  </div>
                )}
              </div>

              {/* Status Update Buttons */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Update Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map(s => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setUpdateForm(f => ({ ...f, status: s }))}
                      className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                        updateForm.status === s ? 'shadow-md scale-[1.01]' : 'text-slate-400 border-white/10 bg-white/[0.02]'
                      }`}
                      style={updateForm.status === s ? {
                        background:
                          s === 'Resolved'
                            ? 'rgba(52,211,153,0.25)'
                            : s === 'In Progress'
                            ? 'rgba(96,165,250,0.25)'
                            : s === 'Rejected'
                            ? 'rgba(248,113,113,0.25)'
                            : 'rgba(251,191,36,0.25)',
                        borderColor:
                          s === 'Resolved'
                            ? 'rgba(52,211,153,0.5)'
                            : s === 'In Progress'
                            ? 'rgba(96,165,250,0.5)'
                            : s === 'Rejected'
                            ? 'rgba(248,113,113,0.5)'
                            : 'rgba(251,191,36,0.5)',
                        color:
                          s === 'Resolved'
                            ? '#34d399'
                            : s === 'In Progress'
                            ? '#60a5fa'
                            : s === 'Rejected'
                            ? '#f87171'
                            : '#fbbf24',
                      } : {}}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Assigned Division / Officer */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Assigned Department / Field Officer
                </label>
                <input
                  className="input-glass text-xs sm:text-sm"
                  placeholder="e.g. Ward 42 Road Maintenance Crew, Eng. Sharma"
                  value={updateForm.assignedTo}
                  onChange={e => setUpdateForm(f => ({ ...f, assignedTo: e.target.value }))}
                />
              </div>

              {/* Official Citizen Note */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Official Note to Citizen (Visible on their dashboard)
                </label>
                <textarea
                  rows={3}
                  className="input-glass resize-none text-xs sm:text-sm"
                  placeholder="Explain actions taken, scheduled repair time, or completion remarks…"
                  value={updateForm.officialNote}
                  onChange={e => setUpdateForm(f => ({ ...f, officialNote: e.target.value }))}
                />
              </div>

              {/* Submit Button */}
              <button
                onClick={handleUpdate}
                disabled={updating}
                className="btn-primary w-full justify-center py-3.5 text-sm shadow-xl shadow-blue-600/30"
              >
                {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span>{updating ? 'Saving & Publishing…' : 'Publish Ticket Update'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MunicipalIssueCard({ issue, onClick }) {
  const [imgError, setImgError] = useState(false);
  const icon = CATEGORY_ICONS[issue.category] || '📋';
  const statusCls = STATUS_CLASS[issue.status] || 'badge-pending';
  const priorityCls = PRIORITY_CLASS[issue.priority] || 'badge-low';

  return (
    <button
      onClick={onClick}
      className="glass-card p-5 text-left flex flex-col justify-between border border-white/10 hover:border-blue-500/40 hover:bg-white/[0.08] transition-all duration-300 w-full group"
    >
      <div>
        {issue.photo && !imgError && (
          <div className="h-40 rounded-xl overflow-hidden w-full mb-3 border border-white/10 bg-slate-900">
            <img
              src={getAttachmentUrl(issue.photo)}
              alt={issue.issueTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
          </div>
        )}

        <div className="flex items-start justify-between gap-2.5 mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg shrink-0">
              {icon}
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-sm line-clamp-2 leading-tight">
                {issue.issueTitle}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{issue.category}</p>
            </div>
          </div>
          <span className={`badge ${statusCls} shrink-0 text-[10px]`}>{issue.status}</span>
        </div>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-3">
          {issue.issueDescription}
        </p>

        {issue.assignedTo && (
          <div className="mb-3 px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[11px] text-blue-300 font-medium truncate flex items-center gap-1.5">
            <Building2 size={11} className="shrink-0" />
            <span className="truncate">Dept: {issue.assignedTo}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-white/5 pt-3 text-xs text-slate-400">
        <span className="flex items-center gap-1 truncate max-w-[130px]">
          <MapPin size={11} className="text-blue-400 shrink-0" />
          <span className="truncate text-[11px]">{issue.address}</span>
        </span>
        <div className="flex items-center gap-2">
          <span className={`badge ${priorityCls} capitalize text-[10px]`}>
            {issue.priority}
          </span>
          <span className="text-[11px] text-slate-500">{timeAgo(issue.createdAt)}</span>
        </div>
      </div>
    </button>
  );
}
