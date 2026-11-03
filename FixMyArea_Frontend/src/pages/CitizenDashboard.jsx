import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { getAttachmentUrl } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_ICONS, STATUS_CLASS, PRIORITY_CLASS, timeAgo, formatDate } from '../utils/helpers';
import {
  MapPin,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Loader2,
  Building2,
  ThumbsUp,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color, desc }) => (
  <div className="glass-card p-5 flex items-center justify-between border border-white/10 hover:border-indigo-500/30">
    <div className="flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
        style={{ background: `${color}18`, border: `1px solid ${color}30` }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <div className="text-2xl font-display font-extrabold text-white">{value}</div>
        <div className="text-xs text-slate-300 font-medium">{label}</div>
        {desc && <div className="text-[10px] text-slate-500 mt-0.5">{desc}</div>}
      </div>
    </div>
  </div>
);

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/issues/my')
      .then(r => setIssues(r.data))
      .catch(() => toast.error('Failed to load your issues'))
      .finally(() => setLoading(false));
  }, []);

  const counts = {
    total: issues.length,
    pending: issues.filter(i => i.status === 'Pending').length,
    inProgress: issues.filter(i => i.status === 'In Progress').length,
    resolved: issues.filter(i => i.status === 'Resolved').length,
  };

  const filtered = filter === 'all' ? issues : issues.filter(i => i.status === filter);

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="pointer-events-none absolute w-[450px] h-[450px] rounded-full bg-indigo-500/10 blur-[130px] top-0 left-[-100px]" />
      <div className="pointer-events-none absolute w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[130px] top-1/3 right-[-100px]" />

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Welcome Banner */}
        <div className="glass-strong rounded-2xl p-6 sm:p-8 mb-8 border border-white/15 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Citizen Portal
                </span>
                <span className="text-xs text-slate-400">• Active Reporter</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                Hello, {user?.name?.split(' ')[0]} 👋
              </h1>
              <p className="text-slate-300 mt-1.5 text-xs sm:text-sm max-w-lg">
                Track your active municipal reports, review official resolution notes, and watch your neighborhood transform.
              </p>
            </div>

            <Link
              to="/report"
              className="btn-primary self-start sm:self-center px-6 py-3 shadow-lg shadow-indigo-600/30 flex items-center gap-2 shrink-0 hover:scale-[1.02] transition-transform"
            >
              <Plus size={18} />
              <span className="font-semibold text-sm">Report New Issue</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={TrendingUp} label="Total Reports" value={counts.total} color="#818cf8" desc="Submitted by you" />
          <StatCard icon={AlertTriangle} label="Pending Review" value={counts.pending} color="#fbbf24" desc="Awaiting assignment" />
          <StatCard icon={Clock} label="Under Repair" value={counts.inProgress} color="#60a5fa" desc="Work in progress" />
          <StatCard icon={CheckCircle} label="Resolved" value={counts.resolved} color="#34d399" desc="Verified fixes" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            {['all', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border capitalize ${
                  filter === f
                    ? 'text-white border-indigo-500/50 bg-indigo-500/20 shadow-lg shadow-indigo-500/10'
                    : 'text-slate-400 border-white/10 hover:text-white hover:border-white/20 bg-white/[0.02]'
                }`}
              >
                {f === 'all' ? 'All Issues' : f}
                <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-slate-300">
                  {f === 'all' ? counts.total : f === 'Pending' ? counts.pending : f === 'In Progress' ? counts.inProgress : f === 'Resolved' ? counts.resolved : issues.filter(i => i.status === f).length}
                </span>
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-500 hidden sm:inline">
            Showing {filtered.length} {filtered.length === 1 ? 'issue' : 'issues'}
          </span>
        </div>

        {/* Issue List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 size={36} className="animate-spin text-indigo-400" />
            <p className="text-xs text-slate-400">Loading your civic reports...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-16 text-center border border-white/10">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-display font-bold text-white text-lg mb-2">
              {filter === 'all' ? 'No issues reported yet' : `No ${filter} issues`}
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mb-6 max-w-sm mx-auto">
              {filter === 'all'
                ? 'Spot a civic problem like broken streetlights or potholes? Submit it with photo proof in 60 seconds.'
                : `You currently have no complaints in the ${filter} state.`}
            </p>
            {filter === 'all' && (
              <Link to="/report" className="btn-primary inline-flex items-center gap-2">
                <Plus size={16} /> Report Your First Issue
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(issue => (
              <CitizenIssueRow key={issue._id} issue={issue} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CitizenIssueRow({ issue }) {
  const [imgError, setImgError] = useState(false);
  const icon = CATEGORY_ICONS[issue.category] || '📋';
  const statusCls = STATUS_CLASS[issue.status] || 'badge-pending';
  const priorityCls = PRIORITY_CLASS[issue.priority] || 'badge-low';

  // Step indicator
  const steps = [
    { label: 'Submitted', done: true },
    { label: 'Under Review', done: issue.status === 'In Progress' || issue.status === 'Resolved' },
    { label: 'In Progress', done: issue.status === 'In Progress' || issue.status === 'Resolved' },
    { label: 'Resolved', done: issue.status === 'Resolved' },
  ];

  return (
    <div className="glass-card p-5 sm:p-6 border border-white/10 hover:border-indigo-500/40 transition-all">
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* Photo Thumbnail if available */}
        {issue.photo && !imgError ? (
          <div className="w-full md:w-32 h-28 rounded-xl overflow-hidden shrink-0 border border-white/10 bg-slate-900">
            <img
              src={getAttachmentUrl(issue.photo)}
              alt={issue.issueTitle}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
              onError={() => setImgError(true)}
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl shrink-0">
            {icon}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-white text-base sm:text-lg">
                  {issue.issueTitle}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-white/5 text-slate-300 border border-white/10">
                  {issue.category}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                <MapPin size={12} className="text-indigo-400 shrink-0" />
                <span className="truncate">{issue.address}</span>
                {issue.landmark && (
                  <span className="text-slate-500 truncate">• Near {issue.landmark}</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start">
              <span className={`badge ${priorityCls} capitalize text-[11px]`}>
                {issue.priority} priority
              </span>
              <span className={`badge ${statusCls} text-[11px]`}>
                {issue.status}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
            {issue.issueDescription}
          </p>

          {/* Assigned Department / Official Note */}
          {(issue.assignedTo || issue.officialNote) && (
            <div className="mt-4 p-3.5 rounded-xl bg-indigo-500/[0.08] border border-indigo-500/25 space-y-1.5">
              {issue.assignedTo && (
                <div className="flex items-center gap-2 text-xs text-indigo-300 font-semibold">
                  <Building2 size={13} />
                  <span>Assigned Department: {issue.assignedTo}</span>
                </div>
              )}
              {issue.officialNote && (
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Official Authority Note: </strong>
                  {issue.officialNote}
                </p>
              )}
            </div>
          )}

          {/* Progress Timeline Bar */}
          <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
              {steps.map((st, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      st.done ? 'bg-emerald-400' : 'bg-slate-600'
                    }`}
                  />
                  <span className={`text-[11px] ${st.done ? 'text-slate-200 font-medium' : 'text-slate-500'}`}>
                    {st.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <span className="text-slate-600 text-[10px]">➔</span>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 text-slate-500 text-[11px]">
              <span>Reported {timeAgo(issue.createdAt)}</span>
              {issue.status === 'Resolved' && issue.resolvedAt && (
                <span className="text-emerald-400 font-semibold">
                  ✓ Resolved on {formatDate(issue.resolvedAt)}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
