import { useState, useEffect } from 'react';
import api from '../utils/api';
import { formatDate, timeAgo } from '../utils/helpers';
import {
  Users,
  Shield,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Clock,
  Loader2,
  ChevronDown,
  Trash2,
  Sparkles,
  Building2,
  CheckCircle2,
  UserCheck,
  TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color, desc }) => (
  <div className="glass-card p-5 border border-white/10 hover:border-violet-500/30 flex items-center justify-between">
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

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(false);

  useEffect(() => {
    api.get('/issues/stats')
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const loadUsers = () => {
    setUsersLoading(true);
    api.get('/auth/users')
      .then(r => setUsers(r.data))
      .catch(() => toast.error('Failed to load platform users'))
      .finally(() => setUsersLoading(false));
  };

  useEffect(() => {
    if (tab === 'users') loadUsers();
  }, [tab]);

  const changeRole = async (userId, role) => {
    try {
      await api.put('/auth/assign-role', { userId, role });
      toast.success(`Role updated to ${role}!`);
      loadUsers();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    try {
      await api.delete(`/auth/users/${userId}`);
      toast.success('User deleted successfully');
      loadUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const TABS = [
    { key: 'overview', label: 'Platform Analytics', icon: BarChart3 },
    { key: 'users', label: 'User Directory & Roles', icon: Users },
  ];

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="pointer-events-none absolute w-[500px] h-[500px] rounded-full bg-violet-600/15 blur-[140px] top-0 left-[-150px]" />
      <div className="pointer-events-none absolute w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[130px] bottom-10 right-[-100px]" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="glass-strong rounded-2xl p-6 sm:p-8 mb-8 border border-white/15 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/25 text-violet-300 text-xs font-semibold mb-2">
                <Shield size={13} className="text-violet-400" />
                <span>Super Admin Command Interface</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white">
                Platform Administrator
              </h1>
              <p className="text-slate-300 mt-1 text-xs sm:text-sm max-w-xl">
                Global platform oversight, category resolution telemetry, and role privilege management.
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
              <UserCheck size={14} className="text-violet-400" />
              <span>Full Access Granted</span>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-8 p-1.5 rounded-2xl bg-white/[0.04] border border-white/10 w-fit">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                tab === key
                  ? 'text-white shadow-lg shadow-violet-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              style={tab === key ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' } : {}}
            >
              <Icon size={15} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div className="space-y-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3">
                <Loader2 size={36} className="animate-spin text-violet-400" />
                <p className="text-xs text-slate-400">Loading civic analytics…</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard icon={AlertTriangle} label="Total Grievances" value={stats?.total} color="#a78bfa" desc="All wards cumulative" />
                  <StatCard icon={Clock} label="Pending Review" value={stats?.pending} color="#fbbf24" desc="Unaddressed tickets" />
                  <StatCard icon={TrendingUp} label="Active Fieldwork" value={stats?.inProgress} color="#60a5fa" desc="Crews assigned" />
                  <StatCard icon={CheckCircle2} label="Closed Fixes" value={stats?.resolved} color="#34d399" desc="Resolved & audited" />
                </div>

                {/* Category Telemetry Breakdown */}
                {stats?.byCategory?.length > 0 && (
                  <div className="glass-card p-6 sm:p-8 border border-white/10">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h2 className="font-display font-bold text-white text-lg">
                          Resolution by Infrastructure Category
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Distribution of reported issues across civic categories
                        </p>
                      </div>
                      <span className="text-xs text-violet-300 font-semibold bg-violet-500/10 border border-violet-500/20 px-3 py-1 rounded-full">
                        {stats.byCategory.length} Active Categories
                      </span>
                    </div>

                    <div className="space-y-4">
                      {stats.byCategory.map(({ _id, count }) => {
                        const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                        return (
                          <div key={_id} className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-200 font-medium">{_id || 'Other'}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-slate-400">{count} reports</span>
                                <span className="font-semibold text-violet-300">({pct}%)</span>
                              </div>
                            </div>
                            <div className="h-2 rounded-full overflow-hidden bg-white/5 border border-white/5">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${pct}%`,
                                  background: 'linear-gradient(90deg, #7c3aed, #a78bfa)',
                                }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Priority Breakdown Cards */}
                {stats?.byPriority?.length > 0 && (
                  <div className="glass-card p-6 sm:p-8 border border-white/10">
                    <h2 className="font-display font-bold text-white text-lg mb-1">
                      Urgency Distribution
                    </h2>
                    <p className="text-xs text-slate-400 mb-6">
                      Priority triage status across reported community tickets
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {stats.byPriority.map(({ _id, count }) => {
                        const colors = {
                          critical: '#f87171',
                          high: '#fb923c',
                          medium: '#fbbf24',
                          low: '#94a3b8',
                        };
                        const color = colors[_id] || '#94a3b8';
                        return (
                          <div
                            key={_id}
                            className="p-4 rounded-2xl border text-center transition-all bg-white/[0.03]"
                            style={{ borderColor: `${color}30` }}
                          >
                            <div className="text-3xl font-display font-extrabold mb-1" style={{ color }}>
                              {count}
                            </div>
                            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 capitalize">
                              {_id} Priority
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {tab === 'users' && (
          <div>
            {usersLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 size={36} className="animate-spin text-violet-400" />
                <p className="text-xs text-slate-400">Loading user directory…</p>
              </div>
            ) : (
              <div className="glass-card overflow-hidden border border-white/10">
                <div className="p-6 border-b border-white/10 flex items-center justify-between">
                  <div>
                    <h2 className="font-display font-bold text-white text-lg">Platform User Directory</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{users.length} registered accounts in MongoDB</p>
                  </div>
                  <button
                    onClick={loadUsers}
                    className="btn-ghost text-xs py-1.5 px-3"
                  >
                    Refresh Directory
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02]">
                        {['Name & Profile', 'Email Address', 'Assigned Role', 'Account Created', 'Privileges'].map(h => (
                          <th key={h} className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map(u => (
                        <tr key={u._id} className="hover:bg-white/[0.04] transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-md"
                                style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}
                              >
                                {u.name?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <span className="text-sm text-white font-semibold block">{u.name}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{u._id?.slice(-6)}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs sm:text-sm text-slate-300 font-mono">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`badge text-xs capitalize ${
                              u.role === 'admin' ? 'badge-critical' : u.role === 'municipal' ? 'badge-progress' : 'badge-low'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-slate-400">{formatDate(u.createdAt)}</td>
                          <td className="px-6 py-4">
                            {u.role !== 'admin' ? (
                              <div className="flex items-center gap-2">
                                <div className="relative group inline-block">
                                  <select
                                    defaultValue={u.role}
                                    onChange={e => changeRole(u._id, e.target.value)}
                                    className="input-glass text-xs py-1.5 px-3 pr-8 cursor-pointer appearance-none rounded-lg"
                                  >
                                    <option value="citizen">Citizen</option>
                                    <option value="municipal">Municipal</option>
                                  </select>
                                  <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                </div>
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="p-1.5 rounded-lg border border-red-500/20 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-all"
                                  title="Delete User"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-500 italic">Protected Super Admin</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
