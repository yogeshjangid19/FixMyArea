import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const issueSchema = new mongoose.Schema({
  issueTitle: { type: String, required: true, trim: true },
  issueDescription: { type: String, required: true },
  category: {
    type: String,
    enum: [
      'Potholes',
      'Broken Street Light',
      'Sewage Overflow',
      'Illegal Waste Dumping',
      'Damaged Traffic Signals',
      'Unclean Public Toilets',
      'Water Supply',
      'Tree / Branch Fall',
      'Other',
    ],
    required: true,
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low',
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved', 'Rejected'],
    default: 'Pending',
  },
  photo: { type: String, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  landmark: { type: String, default: null },
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  resolvedAt: { type: Date, default: null },
  assignedTo: { type: String, default: null },
  officialNote: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

// Create indexes for optimization
issueSchema.index({ status: 1 });
issueSchema.index({ category: 1 });
issueSchema.index({ priority: 1 });
issueSchema.index({ userId: 1 });
issueSchema.index({ createdAt: -1 });

export default mongoose.model('Issue', issueSchema);
