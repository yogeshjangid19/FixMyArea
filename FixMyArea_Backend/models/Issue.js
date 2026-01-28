import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  issueTitle: { type: String, required: true },
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
    ],
    required: true,
  },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending',
  },
  photo: { type: String }, // Path or URL to uploaded photo
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  address: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Issue', issueSchema);