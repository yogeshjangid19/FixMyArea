import express from 'express';
import { body } from 'express-validator';
import {
  createIssue,
  getIssues,
  getPublicIssues,
  getMyIssues,
  getIssueById,
  updateIssueStatus,
  voteIssue,
  addComment,
  getStats,
  deleteIssue,
} from '../controllers/issueController.js';
import { verifyToken, requireRole, optionalVerifyToken } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = express.Router();

const issueValidation = [
  body('issueTitle')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('issueDescription')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('category')
    .trim()
    .escape()
    .notEmpty()
    .withMessage('Category is required')
    .isIn([
      'Potholes',
      'Broken Street Light',
      'Sewage Overflow',
      'Illegal Waste Dumping',
      'Damaged Traffic Signals',
      'Unclean Public Toilets',
      'Water Supply',
      'Tree / Branch Fall',
      'Other',
    ])
    .withMessage('Invalid category'),
  body('address').trim().escape().notEmpty().withMessage('Address is required'),
  body('landmark').optional().trim().escape(),
];

// Public
router.get('/public', verifyToken, requireRole('municipal', 'admin'), getPublicIssues);
router.get('/stats', optionalVerifyToken, getStats);

// Citizen
router.post('/', verifyToken, upload.single('photo'), issueValidation, createIssue);
router.get('/my', verifyToken, getMyIssues);
router.post('/:id/vote', verifyToken, voteIssue);
router.post('/:id/comment', verifyToken, addComment);

// Municipal + Admin
router.get('/', verifyToken, requireRole('municipal', 'admin'), getIssues);
router.put('/:id/status', verifyToken, requireRole('municipal', 'admin'), updateIssueStatus);

// Shared authenticated
router.get('/:id', verifyToken, getIssueById);

// Admin only
router.delete('/:id', verifyToken, requireRole('admin'), deleteIssue);

export default router;
