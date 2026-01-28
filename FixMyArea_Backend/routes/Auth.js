import express from 'express';
import { register, login, getMe, assignRole } from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import { registerValidator, loginValidator, assignRoleValidator } from '../validators/authValidator.js';

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/me', authMiddleware(), getMe);
router.post('/assign-role', [authMiddleware(['admin']), ...assignRoleValidator], assignRole);

export default router;