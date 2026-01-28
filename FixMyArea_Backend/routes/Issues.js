import express from 'express';
import { 
  createIssue, 
  getIssues, 
  updateIssueStatus,
  getMyIssues
} from '../controllers/issueController.js';

import authMiddleware from '../middleware/authMiddleware.js';
import { createIssueValidator } from '../validators/issueValidator.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
 console.log("🚀 Issues Route Loaded - Multer before Validator");

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/issues'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${file.originalname}`);
  },
});

// File filter for images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only images are allowed'), false);
};

const upload = multer({ storage, fileFilter });

const router = express.Router();

// ================= ROUTES =================

// Citizen creates an issue
router.post(
  '/',
  authMiddleware(['citizen']),
  upload.single('photo'),
  ...createIssueValidator,
  createIssue
);

// Municipal gets all issues
router.get('/', authMiddleware(['municipal']), getIssues);

// Municipal updates issue status
router.put('/:id/status', authMiddleware(['municipal']), updateIssueStatus);

// Citizen gets only their own issues
router.get('/my', authMiddleware(['citizen']), getMyIssues);

export default router;
