import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin,
  ArrowUp,
  Github,
  Mail,
  Send,
  Heart,
  Activity,
  PhoneCall,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  FileCode2,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Footer() {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setSubscribed(true);
    toast.success('Subscribed to community civic updates!');
    setEmail('');
  };

  const categories = [
    { name: 'Potholes & Roads', icon: '🕳️' },
    { name: 'Street Lights', icon: '💡' },
    { name: 'Sewage Overflow', icon: '🚰' },
    { name: 'Waste Dumping', icon: '🗑️' },
    { name: 'Traffic Signals', icon: '🚦' },
    { name: 'Water Supply', icon: '💧' },
  ];

  return (
    <footer className="relative border-t border-white/10 bg-slate-950/80 backdrop-blur-xl overflow-hidden mt-16">
      {/* Top Gradient Highlight Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

      {/* Ambient decorative glowing orbs */}
      <div
        className="pointer-events-none absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-violet-600/10 blur-[120px]"
        aria-hidden="true"
      />

      {/* Quick Civic Status Bar */}
      <div className="border-b border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Systems Operational
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Realtime synced with Municipal Authority Server
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
              <PhoneCall size={13} className="text-indigo-400" />
              Civic Helpline: <strong className="text-slate-200 font-semibold">1916 / 112</strong>
            </span>
            <span className="hidden md:inline text-white/10">|</span>
            <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors">
              <ShieldCheck size={13} className="text-indigo-400" />
              256-bit Encrypted Platform
            </span>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          {/* Col 1: Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3 group">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-300 group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
              >
                <MapPin size={20} className="text-white" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-display font-bold text-xl text-white tracking-tight">
                    FixMy<span className="gradient-text">Area</span>
                  </span>
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 border border-indigo-500/30 text-indigo-300">
                    v2.0
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 -mt-0.5">Civic Infrastructure Reporting</span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering citizens to report municipal problems with photo proof, track issue resolution in real-time,
              and hold civic departments accountable for faster action.
            </p>

            {/* Quick Badges / Feature Tags */}
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300 hover:border-indigo-500/40 transition-all">
                <Sparkles size={12} className="text-indigo-400" /> 60-Sec Issue Reporting
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300 hover:border-indigo-500/40 transition-all">
                <Layers size={12} className="text-indigo-400" /> Role-Based Access
              </span>
              <a
                href="http://localhost:4009/api/docs"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:border-indigo-500/40 transition-all"
              >
                <FileCode2 size={12} className="text-indigo-400" /> Swagger Docs
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub Repository"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
              >
                <Github size={16} />
              </a>
              <a
                href="mailto:contact@fixmyarea.org"
                aria-label="Contact Email"
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-all"
              >
                <Mail size={16} />
              </a>
              <span className="text-xs text-slate-500 pl-1">
                Final Year Engineering Project • IT Dept
              </span>
            </div>
          </div>

          {/* Col 2: Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={user?.role === 'citizen' ? '/report' : '/auth'}
                  className="text-slate-400 hover:text-indigo-400 transition-colors flex items-center gap-1.5"
                >
                  Report an Issue
                  <span className="px-1.5 py-0.2 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold">
                    New
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  to={user?.role === 'municipal' || user?.role === 'admin' ? '/issues' : '/auth'}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Municipal Feed
                </Link>
              </li>
              <li>
                <Link
                  to={
                    user?.role === 'admin'
                      ? '/dashboard/admin'
                      : user?.role === 'municipal'
                      ? '/dashboard/municipal'
                      : user
                      ? '/dashboard/citizen'
                      : '/auth'
                  }
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-slate-400 hover:text-white transition-colors">
                  Citizen Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Problem Categories (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {categories.map((c) => (
                <li key={c.name}>
                  <Link
                    to={user ? '/report' : '/auth'}
                    className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    <span className="text-xs group-hover:scale-110 transition-transform">{c.icon}</span>
                    <span>{c.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Newsletter / Civic Updates (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Community Updates
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to weekly ward resolution reports and civic hygiene updates in your district.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.08] transition-all"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="absolute right-1 top-1 bottom-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-all flex items-center justify-center shadow-md shadow-indigo-600/30"
                >
                  <Send size={13} />
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                  <CheckCircle2 size={12} /> You're on the civic alert list!
                </p>
              )}
            </form>

            <div className="p-3 rounded-xl bg-indigo-500/[0.07] border border-indigo-500/20 text-indigo-300 text-[11px] leading-relaxed">
              💡 <strong>Citizen Tip:</strong> High-priority issues with clear landmark photos receive 2.4× faster municipal intervention.
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-center sm:text-left">
            <span>© {new Date().getFullYear()} FixMyArea. Open Civic Platform.</span>
            <span className="hidden sm:inline text-white/10">•</span>
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart size={12} className="text-red-400 fill-red-400" /> for Smart Cities
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-[11px] text-slate-500">
              Stack: React 18 • Node.js • Express • MongoDB
            </span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-indigo-500/10 text-slate-400 hover:text-white transition-all flex items-center gap-1.5 text-xs"
              title="Back to top"
            >
              <span>Top</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

