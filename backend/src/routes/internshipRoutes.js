import express from 'express';
import multer from 'multer';
import {
  getInternships,
  getAllInternships,
  createInternship,
  updateInternship,
  deleteInternship,
  reorderInternships,
} from '../controllers/internshipController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import validateFileUpload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `internship-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/all', verifyToken, getAllInternships);
router.get('/', getInternships);
router.post('/reorder', verifyToken, reorderInternships);
router.post('/', verifyToken, upload.single('image'), validateFileUpload, createInternship);
router.put('/:id', verifyToken, upload.single('image'), validateFileUpload, updateInternship);
router.delete('/:id', verifyToken, deleteInternship);

export default router;
