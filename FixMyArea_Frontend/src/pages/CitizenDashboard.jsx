import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { CATEGORY_ICONS, STATUS_CLASS, PRIORITY_CLASS, timeAgo, formatDate } from '../utils/helpers';
import { MapPin, Plus, Clock, CheckCircle, AlertTriangle, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass-card p-5 flex items-center gap-4">
    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
      <Icon size={22} style={{ color }} />
    </div>
    <div>
      <div className="text-2xl font-display font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
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
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="orb w-[400px] h-[400px] bg-indigo-500 top-0 left-[-100px]" />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-1">Citizen Portal</p>
            <h1 className="font-display text-3xl font-bold text-white">
              Hello, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-400 mt-1 text-sm">Track all your reported issues here</p>
          </div>
          <Link to="/report" className="btn-primary self-start sm:self-center">
            <Plus size={16} />
            Report New Issue
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={TrendingUp} label="Total Reports" value={counts.total} color="#818cf8" />
          <StatCard icon={AlertTriangle} label="Pending" value={counts.pending} color="#fbbf24" />
          <StatCard icon={Clock} label="In Progress" value={counts.inProgress} color="#60a5fa" />
          <StatCard icon={CheckCircle} label="Resolved" value={counts.resolved} color="#34d399" />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'Pending', 'In Progress', 'Resolved', 'Rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border capitalize ${
                filter === f
                  ? 'text-white border-indigo-500/40'
                  : 'text-slate-400 border-white/10 hover:text-white hover:border-white/20'
              }`}
              style={filter === f ? { background: 'rgba(99,102,241,0.2)' } : { background: 'rgba(255,255,255,0.03)' }}
            >
              {f === 'all' ? 'All Issues' : f}
              {f !== 'all' && (
                <span className="ml-1.5 text-xs opacity-60">
                  ({f === 'Pending' ? counts.pending : f === 'In Progress' ? counts.inProgress : f === 'Resolved' ? counts.resolved : issues.filter(i => i.status === f).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Issue List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-indigo-400" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="font-semibold text-white mb-2">
              {filter === 'all' ? 'No issues reported yet' : `No ${filter} issues`}
            </h3>
            <p className="text-slate-400 text-sm mb-6">
              {filter === 'all' ? 'Spot a problem in your area? Report it now!' : 'Nothing here yet.'}
            </p>
            {filter === 'all' && (
              <Link to="/report" className="btn-primary inline-flex">
                <Plus size={16} /> Report First Issue
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
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
  const icon = CATEGORY_ICONS[issue.category] || '📋';
  const statusCls = STATUS_CLASS[issue.status] || 'badge-pending';
  const priorityCls = PRIORITY_CLASS[issue.priority] || 'badge-low';

  return (
    <div className="glass-card p-5">
      <div className="flex items-start gap-4">
        <span className="text-2xl mt-0.5">{icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold text-white text-sm">{issue.issueTitle}</h3>
              <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                <MapPin size={10} />
                {issue.address}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className={`badge ${priorityCls} capitalize`}>{issue.priority}</span>
              <span className={`badge ${statusCls}`}>{issue.status}</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-2 line-clamp-1">{issue.issueDescription}</p>

          {issue.officialNote && (
            <div className="mt-3 glass rounded-lg p-3 border-l-2 border-indigo-500/50">
              <p className="text-xs text-slate-300">
                <span className="text-indigo-400 font-medium">Official note: </span>
                {issue.officialNote}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/6">
            <span className="text-xs text-slate-500">Reported {timeAgo(issue.createdAt)}</span>
            {issue.status === 'Resolved' && issue.resolvedAt && (
              <span className="text-xs text-emerald-400">✓ Resolved {formatDate(issue.resolvedAt)}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
