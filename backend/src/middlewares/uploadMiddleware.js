import { FILE_LIMITS, ERROR_MESSAGES } from '../config/constants.js';

export const validateFileUpload = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  // Check file size
  if (req.file.size > FILE_LIMITS.MAX_FILE_SIZE) {
    return res.status(400).json({
      message: ERROR_MESSAGES.FILE_TOO_LARGE,
      error: true,
    });
  }

  // Check file type
  if (!FILE_LIMITS.ALLOWED_TYPES.includes(req.file.mimetype)) {
    return res.status(400).json({
      message: ERROR_MESSAGES.INVALID_FILE_TYPE,
      error: true,
    });
  }

  next();
};

export default validateFileUpload;
