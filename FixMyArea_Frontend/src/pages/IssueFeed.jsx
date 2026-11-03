import { useState, useEffect } from 'react';
import api, { getAttachmentUrl } from '../utils/api';
import { CATEGORY_ICONS, CATEGORIES, STATUS_CLASS, PRIORITY_CLASS, timeAgo } from '../utils/helpers';
import {
  MapPin,
  ThumbsUp,
  MessageCircle,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
  Sparkles,
  Building2,
  Calendar,
  CheckCircle2,
  Send,
  Loader2,
} from 'lucide-react';
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

  useEffect(() => {
    fetchIssues();
  }, [page, filters.status, filters.category]);

  const clearFilters = () => setFilters({ status: '', category: '', search: '' });
  const hasFilters = filters.status || filters.category || filters.search;

  const filteredIssues = filters.search
    ? issues.filter(
        i =>
          i.issueTitle?.toLowerCase().includes(filters.search.toLowerCase()) ||
          i.address?.toLowerCase().includes(filters.search.toLowerCase()) ||
          i.category?.toLowerCase().includes(filters.search.toLowerCase())
      )
    : issues;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="pointer-events-none absolute w-[500px] h-[500px] rounded-full bg-indigo-600/15 blur-[140px] top-0 right-[-150px]" />
      <div className="pointer-events-none absolute w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[130px] top-1/2 left-[-100px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-2">
              <Sparkles size={12} className="text-indigo-400" />
              <span>Municipal Transparency Stream</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Community Issue Feed
            </h1>
            <p className="text-slate-400 mt-1 text-xs sm:text-sm">
              Live civic grievances reported across all municipal wards ({total} total tickets recorded)
            </p>
          </div>

          <div className="flex items-center gap-3">
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white glass px-3.5 py-2.5 rounded-xl border border-white/10 hover:border-white/20 transition-all"
              >
                <X size={13} /> Reset
              </button>
            )}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                showFilters || filters.status || filters.category
                  ? 'text-indigo-300 border-indigo-500/40 bg-indigo-500/20 shadow-md shadow-indigo-500/10'
                  : 'text-slate-400 border-white/10 bg-white/[0.03] hover:text-white hover:border-white/20'
              }`}
            >
              <Filter size={15} />
              <span>Filter Feed</span>
              {(filters.status || filters.category) && (
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search grievances by title, street address, or category…"
            value={filters.search}
            onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
            className="input-glass pl-12 py-3.5 w-full text-sm shadow-sm"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(f => ({ ...f, search: '' }))}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Filter Drawer */}
        {showFilters && (
          <div className="glass-strong p-6 rounded-2xl mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 border border-white/15 animate-fadeIn">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                Filter by Status
              </label>
              <div className="flex flex-wrap gap-2">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => setFilters(f => ({ ...f, status: f.status === s ? '' : s }))}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                      filters.status === s
                        ? 'text-white border-indigo-500/60 bg-indigo-500/30 shadow-md'
                        : 'text-slate-400 border-white/10 hover:text-white hover:border-white/20 bg-white/[0.02]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                Filter by Category
              </label>
              <select
                value={filters.category}
                onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
                className="input-glass text-xs py-2.5"
              >
                <option value="">All Categories ({CATEGORIES.length})</option>
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {CATEGORY_ICONS[c]} {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Issue Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-5 animate-pulse border border-white/10 h-72">
                <div className="h-36 bg-white/10 rounded-xl mb-4" />
                <div className="h-4 bg-white/10 rounded mb-2 w-3/4" />
                <div className="h-3 bg-white/5 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredIssues.length === 0 ? (
          <div className="glass-card p-16 text-center border border-white/10">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display font-bold text-white text-lg mb-2">No matching reports found</h3>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm mx-auto">
              {hasFilters
                ? 'Try adjusting your search query or reset active filters.'
                : 'No public reports have been submitted yet.'}
            </p>
            {hasFilters && (
              <button onClick={clearFilters} className="btn-ghost text-xs mt-4">
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIssues.map(issue => (
              <FeedCard key={issue._id} issue={issue} user={user} onVote={fetchIssues} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2.5 glass rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10"
              title="Previous Page"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${
                  page === i + 1
                    ? 'text-white border-indigo-500/50 bg-indigo-600 shadow-lg shadow-indigo-600/30'
                    : 'glass text-slate-400 hover:text-white border-white/10'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2.5 glass rounded-xl text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-white/10"
              title="Next Page"
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
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(issue.comments || []);
  const [commentText, setCommentText] = useState('');
  const [commenting, setCommenting] = useState(false);

  const handleVote = async () => {
    if (!user) {
      toast.error('Please log in to upvote civic issues');
      return;
    }
    setVoting(true);
    try {
      const res = await api.post(`/issues/${issue._id}/vote`);
      setVotes(res.data.votes);
      setVoted(res.data.voted);
    } catch {
      toast.error('Failed to register upvote');
    } finally {
      setVoting(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to comment');
      return;
    }
    if (!commentText.trim()) return;
    setCommenting(true);
    try {
      const res = await api.post(`/issues/${issue._id}/comment`, { text: commentText.trim() });
      setComments(res.data.comments || [...comments, { text: commentText, userId: { name: user.name } }]);
      setCommentText('');
      toast.success('Comment posted!');
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setCommenting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    setDeleting(true);
    try {
      await api.delete(`/issues/${issue._id}`);
      toast.success('Issue deleted');
      onVote();
    } catch {
      toast.error('Failed to delete issue');
    } finally {
      setDeleting(false);
    }
  };

  const icon = CATEGORY_ICONS[issue.category] || '📋';
  const statusClass = STATUS_CLASS[issue.status] || 'badge-pending';
  const priorityClass = PRIORITY_CLASS[issue.priority] || 'badge-low';

  return (
    <div className="glass-card p-5 flex flex-col justify-between border border-white/10 hover:border-indigo-500/40 transition-all duration-300 group">
      <div>
        {/* Photo Box */}
        {issue.photo && !imgError && (
          <div className="h-44 rounded-xl overflow-hidden mb-4 border border-white/10 bg-slate-900 relative">
            <img
              src={getAttachmentUrl(issue.photo)}
              alt={issue.issueTitle}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={() => setImgError(true)}
            />
            <div className="absolute top-2.5 right-2.5">
              <span className={`badge ${priorityClass} shadow-md uppercase tracking-wider text-[10px]`}>
                {issue.priority}
              </span>
            </div>
          </div>
        )}

        {/* Title & Status */}
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl shrink-0">
              {icon}
            </div>
            <div>
              <h3 className="font-display font-bold text-white text-sm sm:text-base leading-snug line-clamp-2">
                {issue.issueTitle}
              </h3>
              <p className="text-[11px] text-slate-400">{issue.category}</p>
            </div>
          </div>
          <span className={`badge ${statusClass} shrink-0 text-[11px]`}>{issue.status}</span>
        </div>

        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
          {issue.issueDescription}
        </p>

        {/* Official Note Callout if available */}
        {issue.officialNote && (
          <div className="mb-4 p-2.5 rounded-xl bg-indigo-500/[0.08] border border-indigo-500/20 text-[11px] text-slate-300 flex items-start gap-2">
            <Building2 size={13} className="text-indigo-400 shrink-0 mt-0.5" />
            <div className="line-clamp-2">
              <span className="font-semibold text-white">Note: </span>
              {issue.officialNote}
            </div>
          </div>
        )}
      </div>

      <div>
        {/* Location & Meta info */}
        <div className="flex items-center justify-between text-xs text-slate-400 pb-3 border-b border-white/5">
          <div className="flex items-center gap-1.5 truncate max-w-[170px]" title={issue.address}>
            <MapPin size={12} className="text-indigo-400 shrink-0" />
            <span className="truncate text-[11px]">{issue.address}</span>
          </div>
          <span className="text-[11px] text-slate-500">{timeAgo(issue.createdAt)}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            {/* Upvote Button */}
            <button
              onClick={handleVote}
              disabled={voting}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all border ${
                voted
                  ? 'text-indigo-300 border-indigo-500/40 bg-indigo-500/20 shadow-md shadow-indigo-500/10'
                  : 'text-slate-400 border-white/10 hover:text-white hover:border-white/20 bg-white/[0.02]'
              }`}
            >
              <ThumbsUp size={12} className={voted ? 'fill-indigo-300' : ''} />
              <span>{votes}</span>
            </button>

            {/* Comment Drawer Toggle */}
            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl text-slate-400 border border-white/10 hover:text-white hover:border-white/20 bg-white/[0.02] transition-all"
            >
              <MessageCircle size={12} />
              <span>{comments.length}</span>
            </button>
          </div>

          {user && user.role === 'admin' && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="p-1.5 rounded-lg border border-red-500/20 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-all"
              title="Delete ticket"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {/* Expandable Comments Drawer */}
        {showComments && (
          <div className="mt-4 pt-3 border-t border-white/10 space-y-3 animate-fadeIn">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Comments ({comments.length})
            </h4>

            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              {comments.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic">No comments yet. Be the first!</p>
              ) : (
                comments.map((c, idx) => (
                  <div key={idx} className="p-2 rounded-lg bg-white/5 border border-white/5 text-[11px]">
                    <div className="font-semibold text-slate-300">{c.userId?.name || 'Citizen'}</div>
                    <div className="text-slate-400 mt-0.5">{c.text}</div>
                  </div>
                ))
              )}
            </div>

            {user && (
              <form onSubmit={handleAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  placeholder="Add a remark..."
                  className="input-glass py-1.5 px-3 text-xs flex-1"
                />
                <button
                  type="submit"
                  disabled={commenting || !commentText.trim()}
                  className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-all shrink-0"
                >
                  <Send size={12} />
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
