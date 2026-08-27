import express from 'express';
import multer from 'multer';
import {
  getCertificates,
  getAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../controllers/certificateController.js';
import verifyToken from '../middlewares/authMiddleware.js';
import validateFileUpload from '../middlewares/uploadMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `cert-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/all', verifyToken, getAllCertificates);
router.get('/', getCertificates);
router.post('/', verifyToken, upload.single('image'), validateFileUpload, createCertificate);
router.put('/:id', verifyToken, upload.single('image'), validateFileUpload, updateCertificate);
router.delete('/:id', verifyToken, deleteCertificate);

export default router;
