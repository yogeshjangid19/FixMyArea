import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  assignRole,
  getAllUsers,
  deleteUser,
} from '../controllers/authController.js';
import { verifyToken, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name')
      .trim()
      .escape()
      .isLength({ min: 2 })
      .withMessage('Name must be at least 2 characters long'),
    body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password')
      .isStrongPassword({
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage(
        'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      ),
  ],
  register
);

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  login
);

router.get('/me', verifyToken, getMe);
router.put('/assign-role', verifyToken, requireRole('admin'), assignRole);
router.get('/users', verifyToken, requireRole('admin'), getAllUsers);
router.delete('/users/:id', verifyToken, requireRole('admin'), deleteUser);

export default router;
