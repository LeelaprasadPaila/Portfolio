#!/usr/bin/env node

/**
 * Quick Development Start Script
 * Starts both frontend and backend in development mode
 * 
 * Usage: npm run dev:all
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting Portfolio Development...\n');

const backendDir = path.join(__dirname, '..', 'backend');
const frontendDir = __dirname;

let backendReady = false;
let frontendReady = false;

// Start Backend
console.log('📦 Starting Backend Server...');
const backend = spawn('npm', ['run', 'dev'], {
  cwd: backendDir,
  stdio: 'inherit',
  shell: true,
});

// Start Frontend
setTimeout(() => {
  console.log('\n📦 Starting Frontend Server...\n');
  const frontend = spawn('npm', ['run', 'dev'], {
    cwd: frontendDir,
    stdio: 'inherit',
    shell: true,
  });

  frontend.on('error', (err) => {
    console.error('Frontend error:', err);
    process.exit(1);
  });

  frontend.on('close', (code) => {
    console.log(`\nFrontend exited with code ${code}`);
    backend.kill();
    process.exit(code);
  });
}, 2000);

backend.on('error', (err) => {
  console.error('Backend error:', err);
  process.exit(1);
});

backend.on('close', (code) => {
  console.log(`\nBackend exited with code ${code}`);
  process.exit(code);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n👋 Stopping servers...');
  backend.kill();
  process.exit(0);
});

console.log('\n💡 Tip: Open these URLs in your browser:');
console.log('   Frontend: http://localhost:5173');
console.log('   Backend:  http://localhost:5000');
console.log('   Admin:    http://localhost:5173/admin\n');
