import { useState, useEffect } from 'react';
import api, { getAttachmentUrl } from '../utils/api';
import { CATEGORY_ICONS, CATEGORIES, STATUS_CLASS, timeAgo } from '../utils/helpers';
import { MapPin, ThumbsUp, MessageCircle, Filter, Search, ChevronLeft, ChevronRight, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

export default function IssueFeed() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({ status: '', category: '', search: '' });
  const [showFilters, setShowFilters] = useState(false);

  const fetchIssues = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 9 });
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      const res = await api.get(`/issues/public?${params}`);
      setIssues(res.data.issues || []);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.totalIssues || 0);
    } catch {
      toast.error('Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchIssues(); }, [page, filters.status, filters.category]);

  const clearFilters = () => setFilters({ status: '', category: '', search: '' });
  const hasFilters = filters.status || filters.category;

  const filteredIssues = filters.search
    ? issues.filter(i => i.issueTitle.toLowerCase().includes(filters.search.toLowerCase()) ||
        i.address.toLowerCase().includes(filters.search.toLowerCase()))
    : issues;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="orb w-[500px] h-[500px] bg-indigo-600 top-0 right-[-200px]" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-1">Community</p>
            <h1 className="font-display text-4xl font-bold text-white">Issue Feed</h1>
            <p className="text-slate-400 mt-1">{total} issues reported</p>
          </div>

          <div className="flex items-center gap-3">
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white glass px-3 py-2 rounded-lg border border-white/10">
                <X size={12} /> Clear filters
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                showFilters || hasFilters
                  ? 'text-indigo-300 border-indigo-500/30 bg-indigo-500/15'
                  : 'text-slate-400 border-white/10 bg-white/4 hover:text-white'
              }`}
            >
              <Filter size={14} /> Filter
              {hasFilters && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search issues by title or location…"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="input-glass pl-11 w-full"
          />
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="glass-card p-5 mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button key={s} onClick={() => setFilters(f => ({ ...f, status: f.status === s ? '' : s }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                      filters.status === s
                        ? 'text-white border-indigo-500/40 bg-indigo-500/20'
                        : 'text-slate-400 border-white/10 hover:text-white'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-2">Category</label>
              <select
                value={filters.category}
                onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                className="input-glass text-xs"
              >
                <option value="">All categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Issue Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="glass-card p-5 animate-pulse">
                <div className="flex gap-3 mb-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl" />
                  <div className="flex-1">
                    <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
                    <div className="h-3 bg-white/6 rounded w-1/2" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/6 rounded w-full" />
                  <div className="h-3 bg-white/6 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="glass-card p-16 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-semibold text-white mb-2">No issues found</h3>
            <p className="text-slate-400 text-sm">Try adjusting your filters or search term</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredIssues.map(issue => (
              <FeedCard key={issue._id} issue={issue} user={user} onVote={fetchIssues} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${
                  page === i + 1
                    ? 'text-white'
                    : 'glass text-slate-400 hover:text-white'
                }`}
                style={page === i + 1 ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FeedCard({ issue, user, onVote }) {
  const [votes, setVotes] = useState(issue.votes?.length || 0);
  const [voted, setVoted] = useState(user ? issue.votes?.includes(user._id) : false);
  const [voting, setVoting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleVote = async () => {
    if (!user) {
      toast.error('Log in to vote on issues');
      return;
    }
    setVoting(true);
    try {
      const res = await api.post(`/issues/${issue._id}/vote`);
      setVotes(res.data.votes);
      setVoted(res.data.voted);
    } catch {
      toast.error('Failed to vote');
    } finally {
      setVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    setDeleting(true);
    try {
      await api.delete(`/issues/${issue._id}`);
      toast.success('Issue deleted successfully');
      onVote();
    } catch {
      toast.error('Failed to delete issue');
    } finally {
      setDeleting(false);
    }
  };

  const icon = CATEGORY_ICONS[issue.category] || '📋';
  const statusClass = STATUS_CLASS[issue.status] || 'badge-pending';

  return (
    <div className="glass-card p-5 flex flex-col gap-4">
      {/* Image */}
      {issue.photo && !imgError && (
        <div className="h-40 rounded-xl overflow-hidden -mx-0">
          <img
            src={getAttachmentUrl(issue.photo)}
            alt={issue.issueTitle}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">
              {issue.issueTitle}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">{issue.category}</p>
          </div>
        </div>
        <span className={`badge ${statusClass} shrink-0`}>{issue.status}</span>
      </div>

      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
        {issue.issueDescription}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-white/6">
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <MapPin size={11} />
          <span className="line-clamp-1 max-w-[120px]">{issue.address}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <MessageCircle size={11} />
            {issue.comments?.length || 0}
          </span>
          <button
            onClick={handleVote}
            disabled={voting}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-all border ${
              voted
                ? 'text-indigo-300 border-indigo-500/30 bg-indigo-500/15'
                : 'text-slate-400 border-white/10 hover:text-indigo-300 hover:border-indigo-500/30'
            }`}
          >
            <ThumbsUp size={11} className={voted ? 'fill-indigo-300' : ''} />
            {votes}
          </button>
          {user && user.role === 'admin' && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center justify-center p-1.5 rounded-lg border border-red-500/20 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-all disabled:opacity-30"
              title="Delete Issue"
            >
              <Trash2 size={12} />
            </button>
          )}
        </div>
      </div>

      <div className="text-xs text-slate-600">
        {timeAgo(issue.createdAt)} · {issue.userId?.name || 'Anonymous'}
      </div>
    </div>
  );
}
