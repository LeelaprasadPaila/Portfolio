#!/usr/bin/env node

/**
 * Cleanup old contact submissions from the database.
 *
 * Usage:
 *   node backend/src/scripts/cleanupOldContacts.js --days=30
 *
 * If --days is not provided, it defaults to 30 days.
 */

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Contact from '../models/Contact.js';

dotenv.config();

const argvDays = process.argv.find((arg) => arg.startsWith('--days='));
const days = argvDays ? Number(argvDays.split('=')[1]) : 30;

if (!days || Number.isNaN(days) || days < 1) {
  console.error('✗ Invalid --days value. Must be a positive number.');
  process.exit(1);
}

const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

async function main() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB (cleanup older than ${days} days)`);

    const result = await Contact.deleteMany({ createdAt: { $lt: cutoff } });
    console.log(`✅ Deleted ${result.deletedCount} contact(s) older than ${days} days.`);

    process.exit(0);
  } catch (err) {
    console.error('✗ Cleanup failed:', err.message);
    process.exit(1);
  }
}

main();
