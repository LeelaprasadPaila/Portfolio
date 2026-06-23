import User from '../models/User.js';
import { generateToken } from '../services/tokenService.js';

export const login = async (req, res) => {
  try {
    const { username = process.env.ADMIN_USERNAME || 'admin', password } = req.body;
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required', error: true });
    }

    // Get admin user from the database
    let user = await User.findOne({ username });
    if (!user) {
      if (username === adminUsername && adminPassword && password === adminPassword && adminEmail) {
        user = new User({ username: adminUsername, password: adminPassword, email: adminEmail });
        await user.save();
      } else {
        return res.status(401).json({
          message:
            'Admin user not found. Please run the initialization script (npm run init-admin) with ADMIN_USERNAME, ADMIN_PASSWORD and ADMIN_EMAIL set in the backend .env.',
          error: true,
        });
      }
    }

    // Compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials. Verify your password, or update ADMIN_PASSWORD and run npm run init-admin to reset the admin account.',
        error: true,
      });
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
