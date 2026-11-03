import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  Eye,
  EyeOff,
  MapPin,
  LogIn,
  UserPlus,
  Loader2,
  ShieldCheck,
  Sparkles,
  User,
  Building2,
  Shield,
  KeyRound,
  ArrowRight,
} from 'lucide-react';

export default function AuthPage() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'register' ? 'register' : 'login');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/dashboard/admin');
      else if (user.role === 'municipal') navigate('/dashboard/municipal');
      else navigate('/dashboard/citizen');
    }
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', loginData);
      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (regData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/register', regData);
      login(res.data.token, res.data.user);
      toast.success(`Welcome to FixMyArea, ${res.data.user.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email, password) => {
    setTab('login');
    setLoginData({ email, password });
    toast.success(`Loaded credentials for ${email}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden">
      {/* Background orbs */}
      <div className="pointer-events-none absolute w-[550px] h-[550px] rounded-full bg-indigo-500/15 blur-[150px] top-[-100px] left-[-200px]" />
      <div className="pointer-events-none absolute w-[450px] h-[450px] rounded-full bg-purple-600/15 blur-[140px] bottom-[-100px] right-[-100px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-xl shadow-indigo-500/30 group hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            <MapPin size={28} className="text-white" />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-semibold mb-2">
            <ShieldCheck size={13} className="text-indigo-400" />
            <span>Encrypted Civic Gateway</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
            {tab === 'login' ? 'Sign In to FixMyArea' : 'Create Citizen Account'}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
            {tab === 'login'
              ? 'Access your reported issues and municipal command desks'
              : 'Join thousands of citizens transforming their neighborhoods'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-3xl p-6 sm:p-8 border border-white/15 shadow-2xl">
          {/* Tabs */}
          <div className="flex p-1 rounded-2xl mb-6 bg-white/[0.04] border border-white/10">
            {[
              { key: 'login', label: 'Sign In', icon: LogIn },
              { key: 'register', label: 'Register', icon: UserPlus },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                  tab === key
                    ? 'text-white shadow-lg shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                style={tab === key ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' } : {}}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  className="input-glass"
                  placeholder="name@example.com"
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Password</label>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input-glass pr-10"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3.5 mt-2 text-sm shadow-xl shadow-indigo-600/30"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                <span>{loading ? 'Authenticating…' : 'Sign In to Portal'}</span>
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="e.g. Yogesh Jangid"
                  value={regData.name}
                  onChange={e => setRegData({ ...regData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  className="input-glass"
                  placeholder="name@example.com"
                  value={regData.email}
                  onChange={e => setRegData({ ...regData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input-glass pr-10"
                    placeholder="Min. 6 characters"
                    value={regData.password}
                    onChange={e => setRegData({ ...regData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-indigo-500/[0.08] border border-indigo-500/20 text-[11px] text-slate-300">
                <span className="text-indigo-400 font-semibold">Citizen account: </span>
                Instantly report public infrastructure problems and vote on local community issues.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center py-3.5 mt-2 text-sm shadow-xl shadow-indigo-600/30"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                <span>{loading ? 'Creating citizen account…' : 'Create Free Account'}</span>
              </button>
            </form>
          )}

          {/* Quick Demo Credentials for Reviewers / Examiners */}
          <div className="mt-8 pt-5 border-t border-white/10">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <KeyRound size={12} className="text-indigo-400" /> Demo Quick-Fill
              </span>
              <span className="text-[10px] text-slate-500">For Viva / Project Evaluation</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('citizen@fixmyarea.org', '123456')}
                className="p-2 rounded-xl text-center border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all text-xs"
              >
                <div className="text-base mb-0.5">👤</div>
                <div className="font-semibold text-white text-[11px]">Citizen</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('municipal@fixmyarea.org', '123456')}
                className="p-2 rounded-xl text-center border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all text-xs"
              >
                <div className="text-base mb-0.5">🏢</div>
                <div className="font-semibold text-white text-[11px]">Municipal</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('admin@fixmyarea.org', '123456')}
                className="p-2 rounded-xl text-center border border-white/10 bg-white/[0.02] hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all text-xs"
              >
                <div className="text-base mb-0.5">🛡️</div>
                <div className="font-semibold text-white text-[11px]">Admin</div>
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          FixMyArea v2.0 • Civic Infrastructure Platform • Secure JWT Authentication
        </p>
      </div>
    </div>
  );
}
