import User from '../models/User.js';
import { generateToken } from '../services/tokenService.js';

export const login = async (req, res) => {
  try {
    const { username = process.env.ADMIN_USERNAME || 'admin', password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required', error: true });
    }

    // Get admin user from the database
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        message:
          'Admin user not found. Please run the initialization script (npm run init-admin) or create an admin user in the database.',
        error: true,
      });
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials', error: true });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT
    const token = generateToken(user._id);

    res.json({
      token,
      message: 'Login successful',
      user: { id: user._id, email: user.email, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ message: error.message, error: true });
  }
};

export const verifyAuth = (req, res) => {
  res.json({ authenticated: true });
};

export default { login, verifyAuth };
