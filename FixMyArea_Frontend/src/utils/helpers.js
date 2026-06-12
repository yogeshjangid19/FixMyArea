export const STATUS_LABELS = {
  Pending: 'Pending',
  'In Progress': 'In Progress',
  Resolved: 'Resolved',
  Rejected: 'Rejected',
};

export const STATUS_CLASS = {
  Pending: 'badge-pending',
  'In Progress': 'badge-progress',
  Resolved: 'badge-resolved',
  Rejected: 'badge-rejected',
};

export const PRIORITY_CLASS = {
  critical: 'badge-critical',
  high: 'badge-high',
  medium: 'badge-medium',
  low: 'badge-low',
};

export const CATEGORY_ICONS = {
  Potholes: '🕳️',
  'Broken Street Light': '💡',
  'Sewage Overflow': '🚰',
  'Illegal Waste Dumping': '🗑️',
  'Damaged Traffic Signals': '🚦',
  'Unclean Public Toilets': '🚻',
  'Water Supply': '💧',
  'Tree / Branch Fall': '🌳',
  Other: '📋',
};

export const CATEGORIES = Object.keys(CATEGORY_ICONS);

export const PRIORITIES = ['low', 'medium', 'high', 'critical'];

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(dateStr);
};
