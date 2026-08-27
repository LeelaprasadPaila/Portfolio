import express from 'express';
import {
  trainAI,
  trainAISync,
  getStatus,
  getKnowledge,
  queryAI,
} from '../controllers/aiController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/status', getStatus);
router.post('/query', queryAI);

// Admin-only routes (require authentication)
router.post('/train', verifyToken, trainAI);
router.post('/train/sync', verifyToken, trainAISync);
router.get('/knowledge', verifyToken, getKnowledge);

export default router;

