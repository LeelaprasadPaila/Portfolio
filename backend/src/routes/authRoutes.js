import express from 'express';
import { login, verifyAuth } from '../controllers/authController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', login);
router.get('/verify', verifyToken, verifyAuth);

export default router;
