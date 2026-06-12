import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Eye, EyeOff, MapPin, LogIn, UserPlus, Loader2 } from 'lucide-react';

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

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20">
      {/* Background */}
      <div className="orb w-[500px] h-[500px] bg-indigo-500 top-[-100px] left-[-200px]" />
      <div className="orb w-[400px] h-[400px] bg-purple-600 bottom-[-100px] right-[-100px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
            <MapPin size={26} className="text-white" />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">
            {tab === 'login' ? 'Welcome Back' : 'Join FixMyArea'}
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            {tab === 'login' ? 'Sign in to report and track civic issues' : 'Create your citizen account'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8">
          {/* Tabs */}
          <div className="flex p-1 rounded-xl mb-8" style={{ background: 'rgba(0,0,0,0.3)' }}>
            {[
              { key: 'login', label: 'Log In', icon: LogIn },
              { key: 'register', label: 'Sign Up', icon: UserPlus },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  tab === key
                    ? 'text-white shadow-lg'
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
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  className="input-glass"
                  placeholder="you@example.com"
                  value={loginData.email}
                  onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input-glass pr-10"
                    placeholder="••••••••"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  className="input-glass"
                  placeholder="Yogesh Jangid"
                  value={regData.name}
                  onChange={e => setRegData({ ...regData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  className="input-glass"
                  placeholder="you@example.com"
                  value={regData.email}
                  onChange={e => setRegData({ ...regData, email: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    className="input-glass pr-10"
                    placeholder="Min. 6 characters"
                    value={regData.password}
                    onChange={e => setRegData({ ...regData, password: e.target.value })}
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="glass rounded-xl p-3 text-xs text-slate-400">
                <span className="text-indigo-400 font-medium">Citizen account</span> — you can report issues and track their status. Municipal officials are assigned by the admin.
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 mt-2">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          By continuing, you agree to FixMyArea's terms of service.
        </p>
      </div>
    </div>
  );
}
