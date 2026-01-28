import { validationResult } from 'express-validator';
import Issue from '../models/Issue.js';
import { fileURLToPath } from 'url';
import path from 'path';

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= CREATE ISSUE =================
export const createIssue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { issueTitle, issueDescription, category, priority, address } = req.body;
  const userId = req.user.userId;

  try {
    const issue = new Issue({
      issueTitle,
      issueDescription,
      category,
      priority,
      address,
      userId,
      photo: req.file ? `/uploads/issues/${req.file.filename}` : null,
    });

    await issue.save();
    res.status(201).json({ message: 'Issue reported successfully', issue });
  } catch (error) {
    console.error('Issue creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= GET ALL ISSUES (Municipal) =================
export const getIssues = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const totalIssues = await Issue.countDocuments();
    const issues = await Issue.find()
      .populate('userId', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      issues,
      totalPages: Math.ceil(totalIssues / limit),
      currentPage: page,
      totalIssues,
    });
  } catch (error) {
    console.error('Error fetching issues:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= UPDATE ISSUE STATUS =================
export const updateIssueStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!['Pending', 'In Progress', 'Resolved'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    issue.status = status;
    await issue.save();

    res.json({ message: 'Status updated successfully', issue });
  } catch (error) {
    console.error('Update issue status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ================= GET LOGGED-IN USER'S ISSUES =================
export const getMyIssues = async (req, res) => {
  try {
    const userId = req.user.userId;
    const issues = await Issue.find({ userId }).sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    console.error("Error fetching user issues:", error);
    res.status(500).json({ message: "Server error" });
  }
};
