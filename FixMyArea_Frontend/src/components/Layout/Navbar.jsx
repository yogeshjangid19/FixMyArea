import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { MapPin, Menu, X, LogOut, User, ChevronDown, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setDropOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/auth';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'municipal') return '/dashboard/municipal';
    return '/dashboard/citizen';
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    ...(user?.role === 'municipal' || user?.role === 'admin' ? [{ label: 'Issues', to: '/issues' }] : []),
    ...(user?.role === 'citizen' ? [{ label: 'Report Issue', to: '/report' }] : []),
    ...(user ? [{ label: 'Dashboard', to: getDashboardPath() }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-white/10 shadow-lg shadow-black/20'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
              <MapPin size={16} className="text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">
              Fix<span className="gradient-text">MyArea</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(link.to)
                    ? 'text-white bg-white/10 border border-white/15'
                    : 'text-slate-400 hover:text-white hover:bg-white/6'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2.5 glass px-3 py-2 rounded-xl hover:bg-white/10 transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #a78bfa)' }}>
                    {user.name?.[0]?.toUpperCase()}
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-semibold text-white leading-tight">{user.name}</div>
                    <div className="text-[10px] text-slate-400 capitalize">{user.role}</div>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl py-1 shadow-xl z-50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                      <LogOut size={14} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/auth" className="btn-ghost text-sm">Log In</Link>
                <Link to="/auth?tab=register" className="btn-primary text-sm">
                  <Zap size={14} />
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden glass p-2 rounded-lg text-slate-400"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass border-t border-white/10 px-4 py-4 space-y-2">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.to) ? 'text-white bg-white/10' : 'text-slate-400 hover:text-white'
              }`}>
              {link.label}
            </Link>
          ))}
          <hr className="border-white/10" />
          {user ? (
            <>
              <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400">
                <LogOut size={14} /> Log Out
              </button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/auth" onClick={() => setMobileOpen(false)} className="flex-1 btn-ghost justify-center">Log In</Link>
              <Link to="/auth?tab=register" onClick={() => setMobileOpen(false)} className="flex-1 btn-primary justify-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
