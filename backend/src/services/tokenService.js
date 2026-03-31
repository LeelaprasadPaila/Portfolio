import jwt from 'jsonwebtoken';

export const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRY || '7d' }
  );
};

export const verifyTokenService = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

export default { generateToken, verifyTokenService };
