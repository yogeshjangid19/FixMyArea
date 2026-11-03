import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { CATEGORIES, PRIORITIES, CATEGORY_ICONS } from '../utils/helpers';
import {
  Upload,
  MapPin,
  Loader2,
  CheckCircle,
  X,
  Camera,
  Locate,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Info,
} from 'lucide-react';

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
            toast.success('Precise street address detected!');
          } else {
            setForm(f => ({ ...f, address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
            toast.success('Coordinates detected!');
          }
        } catch {
          setForm(f => ({ ...f, address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}` }));
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
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB');
      return;
    }
    setForm(f => ({ ...f, photo: file }));
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.category) {
      toast.error('Please select a category for your report');
      return;
    }
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v && k !== 'photo') fd.append(k, v);
      });
      if (form.photo) fd.append('photo', form.photo);

      await api.post('/issues', fd);
      setDone(true);
      toast.success('Issue reported successfully!');
    } catch (err) {
      console.error('Issue submission error details:', err.response?.data);
      const validationMsgs = err.response?.data?.errors?.map(e => e.msg).filter(Boolean);
      const errorMsg =
        (validationMsgs && validationMsgs.length > 0 ? validationMsgs.join(' • ') : null) ||
        err.response?.data?.message ||
        'Failed to submit issue';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-16">
        <div className="pointer-events-none absolute w-[400px] h-[400px] bg-emerald-500/15 rounded-full blur-[140px] top-1/4 left-1/2 -translate-x-1/2" />
        <div className="glass-strong p-8 sm:p-12 text-center max-w-lg w-full relative z-10 border border-white/15 rounded-3xl shadow-2xl">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30"
            style={{ background: 'linear-gradient(135deg, #34d399, #059669)' }}
          >
            <CheckCircle size={44} className="text-white" />
          </div>
          <span className="badge badge-resolved mb-3">Ticket Dispatched</span>
          <h2 className="font-display text-3xl font-extrabold text-white mb-3">
            Grievance Submitted!
          </h2>
          <p className="text-slate-300 text-sm mb-8 leading-relaxed">
            Your report has been logged and assigned to the municipal maintenance division. You can monitor live progress and official updates in your citizen dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => {
                setDone(false);
                setForm({
                  issueTitle: '',
                  issueDescription: '',
                  category: '',
                  priority: 'medium',
                  address: '',
                  landmark: '',
                  photo: null,
                });
                setPreview(null);
              }}
              className="btn-ghost text-sm py-3 justify-center"
            >
              Report Another Issue
            </button>
            <button
              onClick={() => navigate('/dashboard/citizen')}
              className="btn-primary text-sm py-3 justify-center flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              <span>Track on Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 pt-24 pb-20">
      <div className="pointer-events-none absolute w-[450px] h-[450px] rounded-full bg-indigo-500/15 blur-[140px] top-0 right-[-100px]" />
      <div className="pointer-events-none absolute w-[350px] h-[350px] rounded-full bg-purple-500/10 blur-[130px] bottom-10 left-[-100px]" />

      <div className="max-w-3xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles size={12} className="text-indigo-400" />
            <span>Citizen Public Grievance Portal</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Report a Civic Issue
          </h1>
          <p className="text-slate-400 mt-2 text-xs sm:text-sm max-w-xl">
            Provide the details and a photograph of the infrastructure problem. Your ticket is routed straight to municipal field workers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-10 space-y-7 border border-white/10">
          {/* Category Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-xs sm:text-sm font-semibold text-slate-200">
                1. Select Problem Category <span className="text-red-400">*</span>
              </label>
              {form.category && (
                <span className="text-xs text-indigo-400 font-medium">Selected: {form.category}</span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat }))}
                  className={`p-3.5 rounded-xl text-xs font-medium text-center transition-all duration-200 border flex flex-col items-center gap-1.5 ${
                    form.category === cat
                      ? 'text-white border-indigo-500 bg-indigo-600/25 shadow-lg shadow-indigo-500/20 scale-[1.02]'
                      : 'text-slate-400 hover:text-slate-200 border-white/10 hover:border-white/20 bg-white/[0.03]'
                  }`}
                >
                  <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                  <span className="leading-tight text-center font-medium">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-200">
                2. Issue Title <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">{form.issueTitle.length}/100</span>
            </div>
            <input
              name="issueTitle"
              value={form.issueTitle}
              onChange={handleChange}
              maxLength={100}
              className="input-glass"
              placeholder="e.g. Deep pothole causing accidents near Metro Pillar 142"
              required
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs sm:text-sm font-semibold text-slate-200">
                3. Detailed Description <span className="text-red-400">*</span>
              </label>
              <span className="text-[11px] text-slate-500">{form.issueDescription.length}/1000</span>
            </div>
            <textarea
              name="issueDescription"
              value={form.issueDescription}
              onChange={handleChange}
              maxLength={1000}
              rows={4}
              className="input-glass resize-none"
              placeholder="Describe the problem — severity, approximate depth/length, how long it has been broken, or specific safety concerns..."
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-2">
              4. Urgency / Priority Level
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRIORITIES.map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, priority: p }))}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-all border text-center ${
                    form.priority === p ? 'shadow-md scale-[1.02]' : 'text-slate-400 border-white/10 bg-white/[0.03]'
                  }`}
                  style={form.priority === p ? {
                    background:
                      p === 'critical'
                        ? 'rgba(239,68,68,0.25)'
                        : p === 'high'
                        ? 'rgba(251,146,60,0.25)'
                        : p === 'medium'
                        ? 'rgba(251,191,36,0.2)'
                        : 'rgba(148,163,184,0.15)',
                    borderColor:
                      p === 'critical'
                        ? 'rgba(239,68,68,0.6)'
                        : p === 'high'
                        ? 'rgba(251,146,60,0.6)'
                        : p === 'medium'
                        ? 'rgba(251,191,36,0.5)'
                        : 'rgba(148,163,184,0.4)',
                    color:
                      p === 'critical'
                        ? '#f87171'
                        : p === 'high'
                        ? '#fb923c'
                        : p === 'medium'
                        ? '#fbbf24'
                        : '#94a3b8',
                  } : {}}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-2">
                5. Location / Street Address <span className="text-red-400">*</span>
              </label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="input-glass pl-9 text-xs sm:text-sm"
                    placeholder="Enter street, cross road, or ward"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetCurrentLocation}
                  disabled={locating}
                  className="px-3 rounded-xl border border-indigo-500/30 text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 hover:text-indigo-300 transition-all flex items-center justify-center shrink-0 disabled:opacity-30 shadow-sm"
                  title="Detect GPS Location"
                >
                  {locating ? <Loader2 size={16} className="animate-spin" /> : <Locate size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-2">
                Landmark (Optional)
              </label>
              <input
                name="landmark"
                value={form.landmark}
                onChange={handleChange}
                className="input-glass text-xs sm:text-sm"
                placeholder="Opposite bank, bus stop, temple..."
              />
            </div>
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-slate-200 mb-2">
              6. Photographic Evidence (Recommended)
            </label>
            {preview ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-slate-900 group">
                <img src={preview} alt="Evidence Preview" className="w-full h-56 object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      setPreview(null);
                      setForm(f => ({ ...f, photo: null }));
                    }}
                    className="px-4 py-2 rounded-xl bg-red-500/80 text-white text-xs font-semibold hover:bg-red-500 flex items-center gap-1.5 transition-all shadow-lg"
                  >
                    <X size={14} /> Remove Photo
                  </button>
                </div>
              </div>
            ) : (
              <label
                htmlFor="photo-upload"
                className="block w-full h-40 border-2 border-dashed border-white/15 rounded-2xl cursor-pointer hover:border-indigo-500/50 hover:bg-white/[0.04] transition-all bg-white/[0.02]"
              >
                <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 shadow-inner">
                    <Camera size={24} />
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-slate-300">
                    Click or drag & drop photo here
                  </p>
                  <p className="text-[11px] text-slate-500">Supports JPG, PNG, WEBP — up to 5MB</p>
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

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-4 text-base shadow-xl shadow-indigo-600/30 hover:scale-[1.01] transition-transform"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Transmitting to Municipal Action Portal…</span>
                </>
              ) : (
                <>
                  <Upload size={18} />
                  <span>Submit Grievance to Municipal Portal</span>
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-500 mt-3 flex items-center justify-center gap-1.5">
              <ShieldCheck size={13} className="text-indigo-400" />
              <span>Complaints are authenticated via JWT & encrypted on MongoDB Atlas</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
