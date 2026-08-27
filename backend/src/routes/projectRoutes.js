import express from 'express';
import multer from 'multer';
import {
  getProjects,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
} from '../controllers/projectController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import validateFileUpload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `project-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', getProjects);
router.get('/all', verifyToken, getAllProjects);
router.post('/reorder', verifyToken, reorderProjects);
router.post('/', verifyToken, upload.single('image'), validateFileUpload, createProject);
router.put('/:id', verifyToken, upload.single('image'), validateFileUpload, updateProject);
router.delete('/:id', verifyToken, deleteProject);

export default router;
