import express from 'express';
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
} from '../controllers/skillController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getSkills);
router.post('/', verifyToken, createSkill);
router.put('/:id', verifyToken, updateSkill);
router.delete('/:id', verifyToken, deleteSkill);

export default router;
