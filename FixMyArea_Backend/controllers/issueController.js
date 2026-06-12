import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import Issue from '../models/Issue.js';

// CREATE ISSUE
export const createIssue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ message: 'Validation failed', errors: errors.array() });

  const { issueTitle, issueDescription, category, priority, address, landmark } = req.body;
  const userId = req.user.userId;

  try {
    const issue = await Issue.create({
      issueTitle,
      issueDescription,
      category,
      priority,
      address,
      landmark,
      userId,
      photo: req.file ? `/uploads/issues/${req.file.filename}` : null,
    });
    res.status(201).json({ message: 'Issue reported successfully', issue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// GET ALL ISSUES (Municipal/Admin) with filters
export const getIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;
    if (req.query.priority) filter.priority = req.query.priority;

    const totalIssues = await Issue.countDocuments(filter);
    const issues = await Issue.find(filter)
      .populate('userId', 'name email area')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      issues,
      totalPages: Math.ceil(totalIssues / limit),
      currentPage: page,
      totalIssues,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET PUBLIC ISSUES (feed for homepage)
export const getPublicIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const totalIssues = await Issue.countDocuments(filter);
    const issues = await Issue.find(filter)
      .populate('userId', 'name area')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-comments');

    res.json({
      issues,
      totalPages: Math.ceil(totalIssues / limit),
      currentPage: page,
      totalIssues,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET MY ISSUES
export const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ userId: req.user.userId }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// GET SINGLE ISSUE
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('userId', 'name area')
      .populate('comments.userId', 'name role');
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // Privacy check: citizens can only view their own reported issues
    if (req.user.role === 'citizen' && issue.userId?._id?.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied. You can only view your own reported issues.' });
    }

    res.json(issue);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// UPDATE STATUS
export const updateIssueStatus = async (req, res) => {
  const { status, officialNote, assignedTo } = req.body;
  const validStatuses = ['Pending', 'In Progress', 'Resolved', 'Rejected'];
  if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });

  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.status = status;
    if (officialNote) issue.officialNote = officialNote;
    if (assignedTo) issue.assignedTo = assignedTo;
    if (status === 'Resolved') issue.resolvedAt = new Date();

    await issue.save();
    res.json({ message: 'Status updated', issue });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// VOTE ON ISSUE
export const voteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // Privacy check: citizens can only vote on their own reported issues
    if (req.user.role === 'citizen' && issue.userId?.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied. You can only vote on your own reported issues.' });
    }

    const userId = req.user.userId;
    const alreadyVoted = issue.votes.includes(userId);

    if (alreadyVoted) {
      issue.votes = issue.votes.filter((v) => v.toString() !== userId);
    } else {
      issue.votes.push(userId);
    }
    await issue.save();
    res.json({ votes: issue.votes.length, voted: !alreadyVoted });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ADD COMMENT
export const addComment = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    // Privacy check: citizens can only comment on their own reported issues
    if (req.user.role === 'citizen' && issue.userId?.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied. You can only comment on your own reported issues.' });
    }

    issue.comments.push({ userId: req.user.userId, text: req.body.text });
    await issue.save();

    const updated = await Issue.findById(req.params.id).populate('comments.userId', 'name role');
    res.json(updated.comments);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// STATS (for dashboards)
export const getStats = async (req, res) => {
  try {
    const filter = {};
    if (req.user && req.user.role === 'citizen') {
      filter.userId = req.user.userId;
    }

    const total = await Issue.countDocuments(filter);
    const pending = await Issue.countDocuments({ ...filter, status: 'Pending' });
    const inProgress = await Issue.countDocuments({ ...filter, status: 'In Progress' });
    const resolved = await Issue.countDocuments({ ...filter, status: 'Resolved' });
    const rejected = await Issue.countDocuments({ ...filter, status: 'Rejected' });

    const matchStage = Object.keys(filter).length > 0
      ? [{ $match: { userId: new mongoose.Types.ObjectId(req.user.userId) } }]
      : [];

    const byCategory = await Issue.aggregate([
      ...matchStage,
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const byPriority = await Issue.aggregate([
      ...matchStage,
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]);

    res.json({ total, pending, inProgress, resolved, rejected, byCategory, byPriority });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// DELETE ISSUE (Admin only)
export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    await issue.deleteOne();
    res.json({ message: 'Issue deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
