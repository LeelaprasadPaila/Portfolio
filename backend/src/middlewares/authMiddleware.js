import jwt from 'jsonwebtoken';
import { ERROR_MESSAGES } from '../config/constants.js';

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided', error: true });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: ERROR_MESSAGES.INVALID_TOKEN, error: true });
  }
};

export default verifyToken;
