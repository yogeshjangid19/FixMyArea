import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { CATEGORIES, PRIORITIES, CATEGORY_ICONS } from '../utils/helpers';
import { Upload, MapPin, Loader2, CheckCircle, X, Camera, Locate } from 'lucide-react';

export default function ReportIssue() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [preview, setPreview] = useState(null);
  const [form, setForm] = useState({
    issueTitle: '',
    issueDescription: '',
    category: '',
    priority: 'medium',
    address: '',
    landmark: '',
    photo: null,
  });
  const [locating, setLocating] = useState(false);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data && data.display_name) {
            setForm(f => ({ ...f, address: data.display_name }));
            toast.success('Location detected!');
          } else {
            setForm(f => ({ ...f, address: `${latitude}, ${longitude}` }));
            toast.success('Coordinates detected!');
          }
        } catch {
          setForm(f => ({ ...f, address: `${latitude}, ${longitude}` }));
          toast.success('Coordinates detected!');
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        toast.error('Location error: ' + error.message);
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handlePhoto = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5MB'); return; }
    setForm(f => ({ ...f, photo: file }));
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.category) { toast.error('Please select a category'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v && k !== 'photo') fd.append(k, v); });
      if (form.photo) fd.append('photo', form.photo);
      await api.post('/issues', fd);
      setDone(true);
      toast.success('Issue reported successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit issue');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="orb w-[400px] h-[400px] bg-green-500 top-0 left-0" style={{ opacity: 0.08 }} />
        <div className="glass-card p-12 text-center max-w-md w-full relative z-10">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'linear-gradient(135deg, #34d399, #059669)' }}>
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="font-display text-3xl font-bold text-white mb-3">Issue Submitted!</h2>
          <p className="text-slate-400 mb-8">
            Your report has been received. Municipal authorities will review and take action.
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setDone(false); setForm({ issueTitle:'',issueDescription:'',category:'',priority:'medium',address:'',landmark:'',photo:null }); setPreview(null); }}
              className="btn-ghost">Report Another</button>
            <button onClick={() => navigate('/dashboard/citizen')} className="btn-primary">
              View My Issues
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-24 pb-16">
      <div className="orb w-[400px] h-[400px] bg-indigo-500 top-0 right-[-100px]" />
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-2">Citizen Report</p>
          <h1 className="font-display text-4xl font-bold text-white">Report an Issue</h1>
          <p className="text-slate-400 mt-2">Submit infrastructure problems for your area</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
          {/* Category Grid */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Category <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat }))}
                  className={`p-3 rounded-xl text-xs font-medium text-center transition-all duration-200 border ${
                    form.category === cat
                      ? 'text-white border-indigo-500/50'
                      : 'text-slate-400 hover:text-slate-200 border-white/10 hover:border-white/20'
                  }`}
                  style={form.category === cat
                    ? { background: 'rgba(99,102,241,0.2)', borderColor: 'rgba(99,102,241,0.4)' }
                    : { background: 'rgba(255,255,255,0.03)' }
                  }
                >
                  <div className="text-xl mb-1">{CATEGORY_ICONS[cat]}</div>
                  <div className="leading-tight">{cat}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Issue Title <span className="text-red-400">*</span>
            </label>
            <input
              name="issueTitle"
              value={form.issueTitle}
              onChange={handleChange}
              className="input-glass"
              placeholder="e.g. Large pothole on main road near park"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="issueDescription"
              value={form.issueDescription}
              onChange={handleChange}
              rows={4}
              className="input-glass resize-none"
              placeholder="Describe the issue in detail — size, severity, how long it's been there..."
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Priority Level</label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, priority: p }))}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold capitalize transition-all duration-200 border ${
                    form.priority === p ? 'text-white' : 'text-slate-400 border-white/10'
                  }`}
                  style={form.priority === p ? {
                    background: p === 'critical' ? 'rgba(239,68,68,0.25)' : p === 'high' ? 'rgba(251,146,60,0.25)' : p === 'medium' ? 'rgba(251,191,36,0.2)' : 'rgba(148,163,184,0.15)',
                    borderColor: p === 'critical' ? 'rgba(239,68,68,0.5)' : p === 'high' ? 'rgba(251,146,60,0.5)' : p === 'medium' ? 'rgba(251,191,36,0.4)' : 'rgba(148,163,184,0.3)',
                    color: p === 'critical' ? '#f87171' : p === 'high' ? '#fb923c' : p === 'medium' ? '#fbbf24' : '#94a3b8',
                  } : { background: 'rgba(255,255,255,0.03)' }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Address / Area <span className="text-red-400">*</span>
              </label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="input-glass pl-9"
                    placeholder="Street or area name"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={locating}
                  className="px-3 rounded-xl border border-indigo-500/20 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all flex items-center justify-center shrink-0 disabled:opacity-30"
                  title="Detect Current Location"
                >
                  {locating ? <Loader2 size={16} className="animate-spin" /> : <Locate size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Landmark (Optional)</label>
              <input
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                className="input-glass"
                placeholder="Near bus stop, temple..."
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Photo Evidence
            </label>
            {preview ? (
              <div className="relative">
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
                <button type="button"
                  onClick={() => { setPreview(null); setForm(f => ({ ...f, photo: null })); }}
                  className="absolute top-2 right-2 w-8 h-8 glass rounded-full flex items-center justify-center text-white hover:bg-red-500/30">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label
                htmlFor="photo-upload"
                className="block w-full h-36 border-2 border-dashed border-white/15 rounded-xl cursor-pointer hover:border-indigo-500/40 transition-colors"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-500">
                  <Camera size={28} />
                  <p className="text-sm">Click to upload photo</p>
                  <p className="text-xs">JPG, PNG or WebP — max 5MB</p>
                </div>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhoto}
                />
              </label>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 text-base">
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
            {loading ? 'Submitting Report…' : 'Submit Issue Report'}
          </button>
        </form>
      </div>
    </div>
  );
}
