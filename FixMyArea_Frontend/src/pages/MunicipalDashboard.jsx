import { useState, useEffect, useRef } from 'react';
import api, { getAttachmentUrl } from '../utils/api';
import { CATEGORY_ICONS, STATUS_CLASS, PRIORITY_CLASS, timeAgo, formatDate } from '../utils/helpers';
import { MapPin, CheckCircle, Clock, AlertTriangle, XCircle, ChevronLeft, ChevronRight, Loader2, Save, X, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <div className="text-2xl font-display font-bold text-white">{value ?? '—'}</div>
      <div className="text-xs text-slate-400">{label}</div>
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

  useEffect(() => { fetchIssues(); }, [page, filters]);

  const openIssue = (issue) => {
    setSelected(issue);
    setDetailImgError(false);
    setUpdateForm({ status: issue.status, officialNote: issue.officialNote || '', assignedTo: issue.assignedTo || '' });
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      await api.put(`/issues/${selected._id}/status`, updateForm);
      toast.success('Issue updated!');
      fetchIssues();
      api.get('/issues/stats').then(r => setStats(r.data)).catch(() => {});
      setSelected(null);
    } catch {
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="orb w-[500px] h-[500px] bg-blue-600 top-0 right-[-200px]" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-blue-400 text-sm font-semibold uppercase tracking-widest mb-1">Authority Panel</p>
          <h1 className="font-display text-3xl font-bold text-white">Municipal Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">Review and resolve citizen-reported issues</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={AlertTriangle} label="Total Issues" value={stats?.total} color="#818cf8" />
          <StatCard icon={Clock} label="Pending" value={stats?.pending} color="#fbbf24" />
          <StatCard icon={CheckCircle} label="In Progress" value={stats?.inProgress} color="#60a5fa" />
          <StatCard icon={XCircle} label="Resolved" value={stats?.resolved} color="#34d399" />
        </div>

        {/* Filters */}
        <div className="glass-card p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <Filter size={14} />
            <span className="font-medium">Filter:</span>
          </div>
          <select
            value={filters.status}
            onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}
            className="input-glass text-sm w-auto"
          >
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            value={filters.priority}
            onChange={e => { setFilters(f => ({ ...f, priority: e.target.value })); setPage(1); }}
            className="input-glass text-sm w-auto"
          >
            <option value="">All Priorities</option>
            {['low','medium','high','critical'].map(p => <option key={p} value={p} className="capitalize">{p}</option>)}
          </select>
          <div className="ml-auto text-xs text-slate-500">{total} issues found</div>
        </div>

        {/* Issue Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-blue-400" />
          </div>
        ) : issues.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="font-semibold text-white mb-2">No issues match your filters</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {issues.map(issue => (
              <MunicipalIssueCard key={issue._id} issue={issue} onClick={() => openIssue(issue)} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
              <ChevronLeft size={16} />
            </button>
            {[...Array(Math.min(totalPages, 5))].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === i+1 ? 'text-white' : 'glass text-slate-400 hover:text-white'}`}
                style={page === i+1 ? { background: 'linear-gradient(135deg, #3b82f6, #2563eb)' } : {}}>
                {i + 1}
              </button>
            ))}
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30">
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Issue Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-strong rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 glass-strong border-b border-white/10 flex items-center justify-between p-5 rounded-t-2xl">
              <h2 className="font-display font-bold text-white text-lg">Update Issue</h2>
              <button onClick={() => setSelected(null)} className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Issue Info */}
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{CATEGORY_ICONS[selected.category] || '📋'}</span>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{selected.issueTitle}</h3>
                    <p className="text-xs text-slate-400">{selected.category}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-3">{selected.issueDescription}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <MapPin size={11} />{selected.address}
                  {selected.landmark && <span>· {selected.landmark}</span>}
                </div>
                <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                  <span>By: {selected.userId?.name || 'Citizen'}</span>
                  <span>·</span>
                  <span>{formatDate(selected.createdAt)}</span>
                </div>

                {selected.photo && !detailImgError && (
                  <img src={getAttachmentUrl(selected.photo)}
                    alt="Issue" className="w-full h-40 object-cover rounded-lg mt-3"
                    onError={() => setDetailImgError(true)} />
                )}
              </div>

              {/* Update Form */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Update Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {STATUSES.map(s => (
                    <button key={s} type="button"
                      onClick={() => setUpdateForm(f => ({ ...f, status: s }))}
                      className={`py-2.5 rounded-lg text-xs font-medium transition-all border ${
                        updateForm.status === s ? 'text-white' : 'text-slate-400 border-white/10'
                      }`}
                      style={updateForm.status === s ? {
                        background: s === 'Resolved' ? 'rgba(52,211,153,0.2)' : s === 'In Progress' ? 'rgba(96,165,250,0.2)' : s === 'Rejected' ? 'rgba(248,113,113,0.2)' : 'rgba(251,191,36,0.2)',
                        borderColor: s === 'Resolved' ? 'rgba(52,211,153,0.4)' : s === 'In Progress' ? 'rgba(96,165,250,0.4)' : s === 'Rejected' ? 'rgba(248,113,113,0.4)' : 'rgba(251,191,36,0.4)',
                        color: s === 'Resolved' ? '#34d399' : s === 'In Progress' ? '#60a5fa' : s === 'Rejected' ? '#f87171' : '#fbbf24',
                      } : { background: 'rgba(255,255,255,0.03)' }}
                    >{s}</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Assigned Department / Officer</label>
                <input
                  className="input-glass"
                  placeholder="e.g. Roads Division, Officer Sharma"
                  value={updateForm.assignedTo}
                  onChange={e => setUpdateForm(f => ({ ...f, assignedTo: e.target.value }))}
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-2">Official Note to Citizen</label>
                <textarea
                  rows={3}
                  className="input-glass resize-none"
                  placeholder="Provide an update for the citizen who reported this…"
                  value={updateForm.officialNote}
                  onChange={e => setUpdateForm(f => ({ ...f, officialNote: e.target.value }))}
                />
              </div>

              <button onClick={handleUpdate} disabled={updating}
                className="btn-primary w-full justify-center py-3">
                {updating ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                {updating ? 'Saving…' : 'Save Update'}
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
    <button onClick={onClick} className="glass-card p-5 text-left flex flex-col gap-3 hover:border-blue-500/30 w-full animate-fade-in">
      {issue.photo && !imgError && (
        <div className="h-40 rounded-xl overflow-hidden w-full mb-1">
          <img
            src={getAttachmentUrl(issue.photo)}
            alt={issue.issueTitle}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-white text-sm line-clamp-2 leading-tight">{issue.issueTitle}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{issue.category}</p>
          </div>
        </div>
        <span className={`badge ${statusCls} shrink-0 text-[10px]`}>{issue.status}</span>
      </div>

      <p className="text-xs text-slate-400 line-clamp-2">{issue.issueDescription}</p>

      <div className="flex items-center justify-between border-t border-white/6 pt-3">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={10} />
          <span className="line-clamp-1 max-w-[120px]">{issue.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`badge ${priorityCls} capitalize text-[10px]`}>{issue.priority}</span>
          <span className="text-xs text-slate-600">{timeAgo(issue.createdAt)}</span>
        </div>
      </div>
    </button>
  );
}
