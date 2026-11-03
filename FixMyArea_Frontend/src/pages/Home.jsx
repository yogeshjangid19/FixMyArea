import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  MapPin,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  ChevronRight,
  Zap,
  Shield,
  Users,
  Camera,
  Navigation,
  Sparkles,
  ThumbsUp,
  Activity,
  Award,
  Building2,
  CheckCircle,
  FileText,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { CATEGORY_ICONS, timeAgo, STATUS_CLASS, CATEGORIES } from '../utils/helpers';

const STAT_ITEMS = [
  { icon: AlertTriangle, label: 'Reported Grievances', color: '#fbbf24', key: 'total', change: '+14% this month' },
  { icon: Clock, label: 'Active In-Progress', color: '#60a5fa', key: 'inProgress', change: 'Avg 48h turnaround' },
  { icon: CheckCircle2, label: 'Successfully Resolved', color: '#34d399', key: 'resolved', change: '89.4% resolution rate' },
];

const WORKFLOW_STEPS = [
  {
    step: '01',
    icon: '📸',
    title: 'Spot & Capture',
    desc: 'Notice a pothole, broken streetlight, or garbage dump? Snap a quick photo with your phone or device.',
    badge: 'Under 60s',
  },
  {
    step: '02',
    icon: '📍',
    title: 'Auto-Locate & Tag',
    desc: 'One-click GPS detects your street location. Select the category and priority level for rapid classification.',
    badge: 'GPS Enabled',
  },
  {
    step: '03',
    icon: '🏢',
    title: 'Municipal Dispatch',
    desc: 'The complaint routes automatically to the respective municipal department and ward supervisor.',
    badge: 'Direct Routing',
  },
  {
    step: '04',
    icon: '✅',
    title: 'Verified Fix',
    desc: 'Receive transparent status updates, official resolution notes, and inspect the solved issue in your area.',
    badge: 'Citizen Verified',
  },
];

const FEATURES = [
  {
    icon: Camera,
    title: 'Photo-Verified Proof',
    desc: 'Eliminates vague complaints by attaching clear photographic evidence directly to the civic ticket.',
    color: 'from-blue-500/20 to-indigo-500/20',
    iconColor: '#60a5fa',
  },
  {
    icon: Navigation,
    title: 'Pinpoint Geolocation',
    desc: 'High-accuracy Nominatim reverse geocoding identifies exact roads, landmarks, and municipal wards.',
    color: 'from-emerald-500/20 to-teal-500/20',
    iconColor: '#34d399',
  },
  {
    icon: ThumbsUp,
    title: 'Crowdsourced Upvotes',
    desc: 'Fellow citizens upvote critical community problems so municipal teams know what needs urgent attention first.',
    color: 'from-amber-500/20 to-orange-500/20',
    iconColor: '#fbbf24',
  },
  {
    icon: Building2,
    title: 'Municipal Command Desk',
    desc: 'Dedicated workflow interface for civic officers to assign officers, add official notes, and mark progress.',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: '#c084fc',
  },
  {
    icon: Shield,
    title: 'Role-Based Security',
    desc: 'Strict JWT authentication and RBAC separating citizens, municipal department officers, and system administrators.',
    color: 'from-indigo-500/20 to-purple-500/20',
    iconColor: '#818cf8',
  },
  {
    icon: Activity,
    title: 'Real-time Analytics',
    desc: 'Comprehensive charts and category breakdowns giving city leaders actionable insights on infrastructure health.',
    color: 'from-rose-500/20 to-red-500/20',
    iconColor: '#f87171',
  },
];

const TESTIMONIALS = [
  {
    quote: "A hazardous deep pothole on MG Road was fixed in under 48 hours after I submitted a photo through FixMyArea. The live status tracking is phenomenal.",
    author: "Rahul Sharma",
    role: "Resident, Indiranagar Ward",
    avatar: "RS",
  },
  {
    quote: "As a municipal ward engineer, this platform completely replaced chaotic paper complaints. We can triage issues by priority and respond directly to citizens.",
    author: "Eng. Sunita Patil",
    role: "Municipal Works Supervisor",
    avatar: "SP",
  },
  {
    quote: "The transparency is unmatched. You can see official notes from authorities and know exactly which team is working on your streetlight.",
    author: "Arjun Verma",
    role: "Community Organizer",
    avatar: "AV",
  },
];

export default function Home() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 184, inProgress: 42, resolved: 142 });
  const [recentIssues, setRecentIssues] = useState([]);
  const [loadingIssues, setLoadingIssues] = useState(true);

  useEffect(() => {
    api.get('/issues/stats')
      .then(r => {
        if (r.data && typeof r.data.total === 'number') {
          setStats(r.data);
        }
      })
      .catch(() => {});

    const isStaff = user && (user.role === 'admin' || user.role === 'municipal');
    if (isStaff) {
      api.get('/issues/public?limit=6')
        .then(r => setRecentIssues(r.data.issues || []))
        .catch(() => {})
        .finally(() => setLoadingIssues(false));
    } else {
      setLoadingIssues(false);
    }
  }, [user]);

  return (
    <div className="min-h-screen">
      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-28 pb-16 px-4">
        {/* Ambient Glowing Background Orbs */}
        <div className="pointer-events-none absolute w-[650px] h-[650px] rounded-full bg-indigo-600/15 blur-[140px] top-[-120px] left-[-200px]" />
        <div className="pointer-events-none absolute w-[550px] h-[550px] rounded-full bg-violet-600/15 blur-[140px] bottom-[-100px] right-[-150px]" />
        <div className="pointer-events-none absolute w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[130px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

        {/* Micro-dot grid background */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-12">
            {/* Announcement Pill */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-6 shadow-inner shadow-indigo-500/10 hover:border-indigo-500/50 transition-all cursor-default">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500" />
              </span>
              <span>Next-Gen Civic Infrastructure Management • v2.0</span>
              <span className="text-white/20">|</span>
              <span className="text-slate-300 font-normal">Realtime Municipal Sync</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] mb-6 tracking-tight">
              Your City,{' '}
              <span className="gradient-text">Your Voice.</span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              Don’t let broken roads, dark streets, or overflowing sewage be ignored. 
              Upload photographic evidence in 60 seconds and track official municipal resolution from dispatch to completion.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
              {user?.role === 'citizen' ? (
                <>
                  <Link
                    to="/report"
                    className="btn-primary text-sm sm:text-base px-8 py-3.5 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-transform flex items-center gap-2.5"
                  >
                    <MapPin size={18} />
                    <span>Report an Issue Now</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/dashboard/citizen"
                    className="btn-ghost text-sm sm:text-base px-7 py-3.5 flex items-center gap-2"
                  >
                    <span>My Dashboard</span>
                    <ChevronRight size={16} />
                  </Link>
                </>
              ) : user?.role === 'municipal' || user?.role === 'admin' ? (
                <>
                  <Link
                    to={user.role === 'admin' ? '/dashboard/admin' : '/dashboard/municipal'}
                    className="btn-primary text-sm sm:text-base px-8 py-3.5 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-transform flex items-center gap-2.5"
                  >
                    <Zap size={18} />
                    <span>Go to Command Center</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/issues"
                    className="btn-ghost text-sm sm:text-base px-7 py-3.5 flex items-center gap-2"
                  >
                    <span>Browse All Issues</span>
                    <ChevronRight size={16} />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/auth?tab=register"
                    className="btn-primary text-sm sm:text-base px-8 py-3.5 shadow-xl shadow-indigo-600/30 hover:scale-[1.02] transition-transform flex items-center gap-2.5"
                  >
                    <Zap size={18} />
                    <span>Start as Citizen — Free</span>
                    <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/auth"
                    className="btn-ghost text-sm sm:text-base px-7 py-3.5 flex items-center gap-2"
                  >
                    <span>Log In to Portal</span>
                    <ChevronRight size={16} />
                  </Link>
                </>
              )}
            </div>

            {/* Quick trust metrics */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-emerald-400" /> 100% Free for Citizens
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-indigo-400" /> Direct Municipal Alert
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-violet-400" /> Photo & GPS Verified
              </span>
            </div>
          </div>

          {/* Interactive Live Hero Showcase Card */}
          <div className="max-w-4xl mx-auto">
            <div className="glass-strong rounded-2xl p-6 sm:p-8 border border-white/15 shadow-2xl relative overflow-hidden group">
              {/* Subtle accent header line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400" />

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-2xl shadow-inner">
                    🕳️
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-base sm:text-lg">
                        Hazardous Deep Pothole on 80ft Main Road
                      </span>
                      <span className="badge badge-progress text-xs">In Progress</span>
                    </div>
                    <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                      <MapPin size={12} className="text-indigo-400" />
                      Near Indiranagar Metro Station, Pillar #142 • Reported 3 hours ago
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <span className="badge badge-critical text-xs">Critical Priority</span>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-indigo-300 font-semibold">
                    <ThumbsUp size={13} className="text-indigo-400" /> 24 Upvotes
                  </div>
                </div>
              </div>

              {/* Resolution Workflow Timeline inside Card */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-6">
                {[
                  { title: 'Reported', time: '10:15 AM', done: true, note: 'Citizen photo uploaded' },
                  { title: 'Verified', time: '10:42 AM', done: true, note: 'Ward 84 Engineer' },
                  { title: 'Dispatched', time: '01:20 PM', done: true, active: true, note: 'Road Repair Unit 4' },
                  { title: 'Resolved', time: 'Estimated 24h', done: false, note: 'Asphalt resurfacing' },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      step.active
                        ? 'bg-indigo-500/15 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                        : step.done
                        ? 'bg-white/5 border-white/10'
                        : 'bg-white/[0.02] border-white/5 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-bold ${step.active ? 'text-indigo-300' : 'text-slate-300'}`}>
                        {step.title}
                      </span>
                      {step.done ? (
                        <CheckCircle2 size={13} className="text-emerald-400" />
                      ) : (
                        <Clock size={13} className="text-slate-500" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">{step.time}</div>
                    <div className="text-[10px] text-slate-500 mt-1 truncate">{step.note}</div>
                  </div>
                ))}
              </div>

              {/* Official Municipal Note Preview */}
              <div className="mt-5 p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3">
                <div className="w-6 h-6 rounded-md bg-indigo-600/30 flex items-center justify-center shrink-0 mt-0.5">
                  <Building2 size={13} className="text-indigo-400" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold text-slate-200">Official Municipal Note: </span>
                  <span className="text-slate-400">
                    "Road maintenance contractor assigned. Cold-mix patching scheduled today at 4:00 PM to eliminate traffic hazard."
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Live Impact Counter Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-4xl mx-auto mt-12">
            {STAT_ITEMS.map(({ icon: Icon, label, color, key, change }) => (
              <div
                key={key}
                className="glass-card p-6 text-center border border-white/10 relative overflow-hidden group hover:border-indigo-500/40"
              >
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"
                  style={{ background: `${color}18`, border: `1px solid ${color}30` }}
                >
                  <Icon size={22} style={{ color }} />
                </div>
                <div className="text-4xl font-display font-extrabold text-white mb-1 tracking-tight">
                  {stats[key]?.toLocaleString() || '0'}
                </div>
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1">
                  {label}
                </div>
                <div className="text-[11px] text-slate-400 font-medium">{change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CIVIC ISSUE CATEGORIES SECTION ─── */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
              Civic Infrastructure
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              What Can You Report?
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
              We cover 9 essential public utility categories with direct municipal forwarding.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4 sm:gap-6">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={user?.role === 'citizen' ? '/report' : '/auth'}
                className="glass-card p-5 border border-white/10 hover:border-indigo-500/40 hover:bg-white/[0.08] transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                    {CATEGORY_ICONS[cat] || '📋'}
                  </div>
                  <h3 className="font-semibold text-white text-base mb-1.5 group-hover:text-indigo-300 transition-colors">
                    {cat}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    Submit photo & location for quick response from municipal maintenance crews.
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-indigo-400 font-medium pt-4 mt-2 border-t border-white/5 group-hover:translate-x-1 transition-transform">
                  <span>Report this</span>
                  <ChevronRight size={14} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (THE RESOLUTION JOURNEY) ─── */}
      <section className="py-24 px-4 relative bg-white/[0.01] border-y border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge badge-progress mb-3">Transparent 4-Step Pipeline</span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              From Report to Resolution
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
              FixMyArea bridges the gap between citizens on the street and municipal authorities at work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORKFLOW_STEPS.map((step, i) => (
              <div
                key={i}
                className="glass-card p-6 border border-white/10 relative group hover:border-indigo-500/40 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-display font-extrabold text-indigo-400/40 group-hover:text-indigo-400 transition-colors">
                      {step.step}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 border border-white/10 text-slate-300">
                      {step.badge}
                    </span>
                  </div>
                  <div className="text-4xl mb-3">{step.icon}</div>
                  <h3 className="font-display font-bold text-white text-lg mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <CheckCircle size={12} className="text-indigo-400" />
                  <span>Automated Civic Audit Trail</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLATFORM FEATURES GRID ─── */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2">
              Architecture & Features
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Engineered for Real-World Impact
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mt-3">
              Built with production-grade engineering principles to handle real community traffic and administrative operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="glass-card p-6 border border-white/10 hover:border-indigo-500/40 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-105"
                      style={{ background: `${feat.iconColor}15`, border: `1px solid ${feat.iconColor}30` }}
                    >
                      <Icon size={22} style={{ color: feat.iconColor }} />
                    </div>
                    <h3 className="font-display font-bold text-white text-lg mb-2">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── RECENT ISSUES FEED (FOR STAFF OR CITIZEN PREVIEW) ─── */}
      {user && (user.role === 'admin' || user.role === 'municipal') && (
        <section className="py-20 px-4 bg-white/[0.01] border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
              <div>
                <p className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-1">
                  Live Dispatch Feed
                </p>
                <h2 className="font-display text-3xl font-extrabold text-white">
                  Recently Reported Issues
                </h2>
              </div>
              <Link to="/issues" className="btn-ghost text-sm self-start sm:self-auto flex items-center gap-1.5">
                <span>View Full Feed</span>
                <ChevronRight size={14} />
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
              <div className="glass-card p-12 text-center border border-white/10">
                <div className="text-5xl mb-4">📭</div>
                <h3 className="text-white font-semibold mb-1">No reports pending in your sector</h3>
                <p className="text-slate-400 text-xs">All citizen tickets are up to date.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {recentIssues.map((issue) => (
                  <IssueCard key={issue._id} issue={issue} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ─── TESTIMONIALS / CIVIC VOICES ─── */}
      <section className="py-20 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="badge badge-resolved mb-3">Community Trust</span>
            <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Loved by Citizens & Authorities
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="glass-card p-6 border border-white/10 hover:border-indigo-500/30 flex flex-col justify-between"
              >
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 italic">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{t.author}</h4>
                    <p className="text-[11px] text-slate-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA BANNER ─── */}
      <section className="py-20 px-4 relative">
        <div className="max-w-4xl mx-auto">
          <div className="glass-strong rounded-3xl p-8 sm:p-14 text-center relative overflow-hidden border border-white/15 shadow-2xl">
            <div className="pointer-events-none absolute w-80 h-80 rounded-full bg-indigo-500/25 blur-[100px] top-[-80px] left-[-80px]" />
            <div className="pointer-events-none absolute w-80 h-80 rounded-full bg-purple-500/20 blur-[100px] bottom-[-80px] right-[-80px]" />

            <div className="relative z-10">
              <div className="flex justify-center gap-3 mb-6">
                {[Shield, Users, TrendingUp].map((Icon, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shadow-md"
                  >
                    <Icon size={20} />
                  </div>
                ))}
              </div>

              <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Ready to Transform Your Neighbourhood?
              </h2>

              <p className="text-slate-300 mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                Join thousands of proactive citizens and dedicated municipal officers working together to keep our cities clean, well-lit, and safe.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                {user ? (
                  <Link
                    to={user.role === 'citizen' ? '/report' : '/issues'}
                    className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2 shadow-xl shadow-indigo-600/40"
                  >
                    <Zap size={18} />
                    <span>{user.role === 'citizen' ? 'Report a Public Issue' : 'Go to Issue Queue'}</span>
                    <ArrowRight size={16} />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/auth?tab=register"
                      className="btn-primary text-base px-8 py-3.5 inline-flex items-center gap-2 shadow-xl shadow-indigo-600/40"
                    >
                      <Zap size={18} />
                      <span>Create Citizen Account</span>
                      <ArrowRight size={16} />
                    </Link>
                    <Link to="/auth" className="btn-ghost text-base px-7 py-3.5">
                      <span>Authority Sign In</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function IssueCard({ issue }) {
  const icon = CATEGORY_ICONS[issue.category] || '📋';
  const statusClass = STATUS_CLASS[issue.status] || 'badge-pending';

  return (
    <div className="glass-card p-5 flex flex-col justify-between gap-3 border border-white/10 hover:border-indigo-500/40">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">{icon}</span>
            <div>
              <h3 className="font-semibold text-white text-sm leading-tight line-clamp-1">{issue.issueTitle}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{issue.category}</p>
            </div>
          </div>
          <span className={`badge ${statusClass} whitespace-nowrap text-[11px]`}>{issue.status}</span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{issue.issueDescription}</p>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 pt-3 border-t border-white/5">
        <span className="flex items-center gap-1 truncate max-w-[70%]">
          <MapPin size={12} className="text-indigo-400 shrink-0" />
          <span className="truncate">{issue.address || 'Address recorded'}</span>
        </span>
        <span className="shrink-0">{timeAgo(issue.createdAt)}</span>
      </div>
    </div>
  );
}
