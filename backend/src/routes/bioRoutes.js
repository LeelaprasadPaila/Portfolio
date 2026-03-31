import express from 'express';
import { getBio, updateBio } from '../controllers/bioController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getBio);
router.put('/', verifyToken, updateBio);

export default router;
