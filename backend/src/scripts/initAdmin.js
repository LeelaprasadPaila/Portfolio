#!/usr/bin/env node

/**
 * Initialize / Update Admin User
 *
 * Usage:
 *   npm run init-admin
 *
 * This script will ensure an admin user exists in the database.
 * Required env variables:
 *   - ADMIN_USERNAME
 *   - ADMIN_PASSWORD
 *   - ADMIN_EMAIL
 *
 * NOTE: This does not store credentials in code; it persists them in MongoDB.
 */

import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../models/User.js';

dotenv.config();

async function run() {
  try {
    await connectDB();

    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD;
    const email = process.env.ADMIN_EMAIL;

    if (!password) {
      throw new Error('ADMIN_PASSWORD must be set in .env');
    }
    if (!email) {
      throw new Error('ADMIN_EMAIL must be set in .env');
    }

    const existing = await User.findOne({ username });
    if (existing) {
      existing.password = password; // triggers bcrypt hash in pre-save hook
      existing.email = email;
      await existing.save();
      console.log('✓ Admin user updated (password + email).');
    } else {
      const admin = new User({ username, password, email });
      await admin.save();
      console.log('✓ Admin user created');
    }

    console.log('Admin credentials:');
    console.log('  username:', username);
    console.log('  password: (from .env)');
    console.log('\nYou can now login at: http://localhost:5173/admin');
    process.exit(0);
  } catch (err) {
    console.error('✗', err.message);
    process.exit(1);
  }
}

run();
