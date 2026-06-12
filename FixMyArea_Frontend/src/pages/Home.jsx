import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, CheckCircle, Clock, AlertTriangle, TrendingUp, ChevronRight, Zap, Shield, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { CATEGORY_ICONS, timeAgo, STATUS_CLASS } from '../utils/helpers';

const STAT_ITEMS = [
  { icon: AlertTriangle, label: 'Issues Reported', color: '#fbbf24', key: 'total' },
  { icon: Clock, label: 'Under Review', color: '#60a5fa', key: 'inProgress' },
  { icon: CheckCircle, label: 'Resolved', color: '#34d399', key: 'resolved' },
];

const HOW_IT_WORKS = [
  { icon: '📸', title: 'Spot & Report', desc: 'Photograph the issue, describe it, and submit in under 60 seconds.' },
  { icon: '📡', title: 'Authority Notified', desc: 'Your report instantly reaches the right municipal department.' },
  { icon: '🔧', title: 'Work Begins', desc: 'Officials update status as they assign and work on the fix.' },
  { icon: '✅', title: 'Problem Solved', desc: 'Get notified when the issue is marked resolved in your area.' },
];

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, inProgress: 0, resolved: 0 });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(true);

  useEffect(() => {
    api.get('/issues/stats').then(r => setStats(r.data)).catch(() => {});
    const isStaff = user && (user.role === 'admin' || user.role === 'municipal');
    if (isStaff) {
      api.get('/issues/public?limit=6').then(r => {
        setRecentIssues(r.data.issues || []);
      }).catch(() => {}).finally(() => setLoadingIssues(false));
    } else {
      setLoadingIssues(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background orbs */}
        <div className="orb w-[600px] h-[600px] bg-indigo-500 top-[-100px] left-[-200px]" />
        <div className="orb w-[400px] h-[400px] bg-purple-500 bottom-[-100px] right-[-100px]" />
        <div className="orb w-[300px] h-[300px] bg-blue-500 top-[30%] right-[20%]" style={{ opacity: 0.08 }} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-xs font-medium text-indigo-300 border border-indigo-500/20 mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Civic Infrastructure Platform
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 tracking-tight">
            Your City,{' '}
            <span className="gradient-text">Your Voice</span>
          </h1>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Spot a pothole? Broken streetlight? Submit it in seconds.
            Watch authorities respond. Track every fix in real time.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            {user?.role === 'citizen' ? (
              <>
                <Link to="/report" className="btn-primary text-base px-7 py-3.5">
                  <MapPin size={18} />
                  Report an Issue
                  <ArrowRight size={16} />
                </Link>
                <Link to="/dashboard/citizen" className="btn-ghost text-base px-7 py-3.5">
                  Go to Dashboard
                  <ChevronRight size={16} />
                </Link>
              </>
            ) : user?.role === 'municipal' || user?.role === 'admin' ? (
              <>
                <Link to={user.role === 'admin' ? "/dashboard/admin" : "/dashboard/municipal"} className="btn-primary text-base px-7 py-3.5">
                  <Zap size={18} />
                  Go to Dashboard
                  <ArrowRight size={16} />
                </Link>
                <Link to="/issues" className="btn-ghost text-base px-7 py-3.5">
                  Browse All Issues
                  <ChevronRight size={16} />
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth?tab=register" className="btn-primary text-base px-7 py-3.5">
                  <Zap size={18} />
                  Get Started Free
                  <ArrowRight size={16} />
                </Link>
                <Link to="/auth" className="btn-ghost text-base px-7 py-3.5">
                  Log In
                  <ChevronRight size={16} />
                </Link>
              </>
            )}
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {STAT_ITEMS.map(({ icon: Icon, label, color, key }) => (
              <div key={key} className="glass-card p-4 text-center">
                <div className="text-3xl font-display font-bold text-white mb-1">
                  {stats[key]?.toLocaleString() || '—'}
                </div>
                <div className="text-xs text-slate-400">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-5 h-8 glass rounded-full flex items-start justify-center p-1 border border-white/10">
            <div className="w-1 h-2 bg-indigo-400 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">Process</p>
            <h2 className="font-display text-4xl font-bold text-white">How FixMyArea Works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="glass-card p-6 relative group">
                <div className="absolute top-4 right-4 text-xs font-bold text-white/10 font-display">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── RECENT ISSUES FEED ─── */}
      {user && (user.role === 'admin' || user.role === 'municipal') && (
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-10">
              <div>
                <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-1">Live Feed</p>
                <h2 className="font-display text-3xl font-bold text-white">Recent Reports</h2>
              </div>
              <Link to="/issues" className="btn-ghost text-sm">
                View all <ChevronRight size={14} />
              </Link>
            </div>

            {loadingIssues ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="glass-card p-5 animate-pulse">
                    <div className="h-4 bg-white/10 rounded mb-3 w-3/4" />
                    <div className="h-3 bg-white/6 rounded mb-2 w-full" />
                    <div className="h-3 bg-white/6 rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : recentIssues.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <div className="text-5xl mb-4">📭</div>
                <p className="text-slate-400">No issues reported yet.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recentIssues.map(issue => (
                  <IssueCard key={issue._id} issue={issue} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── CTA BANNER ─── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="glass-card p-12 text-center relative overflow-hidden">
            <div className="orb w-64 h-64 bg-indigo-500 top-[-60px] left-[-60px]" style={{ opacity: 0.2 }} />
            <div className="orb w-64 h-64 bg-purple-500 bottom-[-60px] right-[-60px]" style={{ opacity: 0.15 }} />
            <div className="relative z-10">
              <div className="flex justify-center gap-6 mb-6">
                {[Shield, Users, TrendingUp].map((Icon, i) => (
                  <div key={i} className="w-12 h-12 glass rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-indigo-400" />
                  </div>
                ))}
              </div>
              <h2 className="font-display text-4xl font-bold text-white mb-4">
                Make Your Area Better
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Join thousands of citizens who are already making their communities cleaner, safer, and better maintained.
              </p>
              {!user && (
                <Link to="/auth?tab=register" className="btn-primary text-base px-8 py-3.5 inline-flex">
                  <Zap size={18} />
                  Join FixMyArea Today
                  <ArrowRight size={16} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/8 py-8 px-4 text-center text-slate-500 text-sm">
        <div className="flex items-center justify-center gap-2 mb-2">
          <MapPin size={14} className="text-indigo-400" />
          <span className="font-display font-bold text-white text-sm">FixMyArea</span>
        </div>
        <p>© {new Date().getFullYear()} FixMyArea. Empowering citizens to fix their communities.</p>
      </footer>
    </div>
  );
}

function IssueCard({ issue }) {
  const icon = CATEGORY_ICONS[issue.category] || '📋';
  const statusClass = STATUS_CLASS[issue.status] || 'badge-pending';

  return (
    <div className="glass-card p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl">{icon}</span>
          <div>
            <h3 className="font-semibold text-white text-sm leading-tight line-clamp-1">{issue.issueTitle}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{issue.category}</p>
          </div>
        </div>
        <span className={`badge ${statusClass} whitespace-nowrap`}>{issue.status}</span>
      </div>

      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{issue.issueDescription}</p>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-white/6">
        <span className="flex items-center gap-1">
          <MapPin size={11} />
          {issue.address?.length > 25 ? issue.address.slice(0, 25) + '…' : issue.address}
        </span>
        <span>{timeAgo(issue.createdAt)}</span>
      </div>
    </div>
  );
}
