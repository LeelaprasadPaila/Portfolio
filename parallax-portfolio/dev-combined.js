import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const projectDir = path.dirname(fileURLToPath(import.meta.url));
const viteCli = path.join(projectDir, 'node_modules', 'vite', 'bin', 'vite.js');
const servers = [
  {
    name: 'Landing Page',
    args: ['--mode', 'landing', '--port', '5174'],
  },
  {
    name: 'Portfolio',
    args: ['--mode', 'portfolio', '--port', '5173'],
  },
].map(({ name, args }) => {
  const child = spawn(process.execPath, [viteCli, ...args, '--host', '127.0.0.1'], {
    cwd: projectDir,
    stdio: 'inherit',
  });

  child.on('error', (error) => {
    console.error(`${name} server failed to start:`, error);
    stopServers(1);
  });

  child.on('exit', (code) => {
    if (!shuttingDown) {
      console.log(`${name} server exited${code === null ? '' : ` with code ${code}`}.`);
      stopServers(code ?? 1);
    }
  });

  return child;
});

let shuttingDown = false;

function stopServers(exitCode = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const server of servers) {
    if (server.exitCode === null) server.kill();
  }
  process.exitCode = exitCode;
}

process.on('SIGINT', () => stopServers());
process.on('SIGTERM', () => stopServers());

console.log('Landing Page: http://localhost:5174/');
console.log('Portfolio:    http://localhost:5174/portfolio/');
