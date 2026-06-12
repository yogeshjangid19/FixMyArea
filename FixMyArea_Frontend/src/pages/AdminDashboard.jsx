import { useState, useEffect } from 'react';
import api from '../utils/api';
import { formatDate, timeAgo } from '../utils/helpers';
import { Users, Shield, BarChart3, CheckCircle, AlertTriangle, Clock, Loader2, ChevronDown, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="glass-card p-5">
    <div className="flex items-center justify-between mb-3">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon size={18} style={{ color }} />
      </div>
    </div>
    <div className="text-2xl font-display font-bold text-white mb-0.5">{value ?? '—'}</div>
    <div className="text-xs text-slate-400">{label}</div>
    {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
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
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setUsersLoading(false));
  };

  useEffect(() => {
    if (tab === 'users') loadUsers();
  }, [tab]);

  const changeRole = async (userId, role) => {
    try {
      await api.put('/auth/assign-role', { userId, role });
      toast.success('Role updated!');
      loadUsers();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/auth/users/${userId}`);
      toast.success('User deleted successfully');
      loadUsers();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const TABS = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'users', label: 'Manage Users', icon: Users },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="orb w-[500px] h-[500px] bg-violet-600 top-0 left-[-150px]" />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-violet-400 text-sm font-semibold uppercase tracking-widest mb-1">Super Admin</p>
          <h1 className="font-display text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-slate-400 mt-1 text-sm">Full platform oversight and user management</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 rounded-xl w-fit" style={{ background: 'rgba(0,0,0,0.3)' }}>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                tab === key ? 'text-white shadow-lg' : 'text-slate-400 hover:text-white'
              }`}
              style={tab === key ? { background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' } : {}}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>

        {/* OVERVIEW TAB */}
        {tab === 'overview' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 size={32} className="animate-spin text-violet-400" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard icon={AlertTriangle} label="Total Issues" value={stats?.total} color="#a78bfa" />
                  <StatCard icon={Clock} label="Pending" value={stats?.pending} color="#fbbf24" />
                  <StatCard icon={Shield} label="In Progress" value={stats?.inProgress} color="#60a5fa" />
                  <StatCard icon={CheckCircle} label="Resolved" value={stats?.resolved} color="#34d399" />
                </div>

                {/* Category Breakdown */}
                {stats?.byCategory?.length > 0 && (
                  <div className="glass-card p-6 mb-6">
                    <h2 className="font-display font-bold text-white mb-5">Issues by Category</h2>
                    <div className="space-y-3">
                      {stats.byCategory.map(({ _id, count }) => {
                        const pct = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                        return (
                          <div key={_id} className="flex items-center gap-3">
                            <span className="text-sm w-36 text-slate-300 truncate">{_id || 'Unknown'}</span>
                            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                              <div className="h-2 rounded-full transition-all duration-700"
                                style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }} />
                            </div>
                            <span className="text-xs text-slate-400 w-10 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Priority Breakdown */}
                {stats?.byPriority?.length > 0 && (
                  <div className="glass-card p-6">
                    <h2 className="font-display font-bold text-white mb-5">Issues by Priority</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {stats.byPriority.map(({ _id, count }) => {
                        const colors = { critical: '#f87171', high: '#fb923c', medium: '#fbbf24', low: '#94a3b8' };
                        const color = colors[_id] || '#94a3b8';
                        return (
                          <div key={_id} className="glass rounded-xl p-4 text-center border" style={{ borderColor: `${color}20` }}>
                            <div className="text-2xl font-display font-bold mb-1" style={{ color }}>{count}</div>
                            <div className="text-xs text-slate-400 capitalize">{_id}</div>
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
              <div className="flex justify-center py-20">
                <Loader2 size={32} className="animate-spin text-violet-400" />
              </div>
            ) : (
              <div className="glass-card overflow-hidden">
                <div className="p-5 border-b border-white/8">
                  <h2 className="font-display font-bold text-white">All Users</h2>
                  <p className="text-xs text-slate-400 mt-1">{users.length} registered users</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/8">
                        {['Name', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-widest">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                                style={{ background: 'linear-gradient(135deg, #7c3aed, #a78bfa)' }}>
                                {u.name?.[0]?.toUpperCase()}
                              </div>
                              <span className="text-sm text-white font-medium">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm text-slate-400">{u.email}</td>
                          <td className="px-5 py-4">
                            <span className={`badge text-xs capitalize ${
                              u.role === 'admin' ? 'badge-critical' : u.role === 'municipal' ? 'badge-progress' : 'badge-low'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-xs text-slate-500">{formatDate(u.createdAt)}</td>
                          <td className="px-5 py-4">
                            {u.role !== 'admin' && (
                              <div className="flex items-center gap-2">
                                <div className="relative group inline-block">
                                  <select
                                    defaultValue={u.role}
                                    onChange={e => changeRole(u._id, e.target.value)}
                                    className="input-glass text-xs py-1.5 px-3 w-auto pr-8 cursor-pointer appearance-none"
                                    style={{ minWidth: '100px' }}
                                  >
                                    <option value="citizen">Citizen</option>
                                    <option value="municipal">Municipal</option>
                                  </select>
                                  <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                </div>
                                <button
                                  onClick={() => handleDeleteUser(u._id)}
                                  className="p-1.5 rounded-lg border border-red-500/20 text-red-400 bg-red-500/10 hover:bg-red-500/20 hover:text-red-300 transition-all"
                                  title="Delete User"
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
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
