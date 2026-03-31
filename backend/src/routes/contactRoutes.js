import express from 'express';
import {
  getContacts,
  submitContact,
  updateContactStatus,
  deleteContact,
} from '../controllers/contactController.js';
import verifyToken from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, getContacts);
router.post('/submit', submitContact);
router.put('/:id', verifyToken, updateContactStatus);
router.delete('/:id', verifyToken, deleteContact);

export default router;
