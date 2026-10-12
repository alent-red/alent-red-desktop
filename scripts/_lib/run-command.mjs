import { spawn } from 'node:child_process';

// Node's spawn() on Windows can't resolve script wrappers like npm.cmd /
// rclone.cmd without a shell. We opt-in to shell on Windows only; macOS and
// Linux keep direct exec.
const NEEDS_SHELL = process.platform === 'win32';

export function runCommand(command, args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, { stdio: 'inherit', shell: NEEDS_SHELL, ...options });
    child.on('error', rejectRun);
    child.on('exit', (code) => {
      if (code === 0) {
        resolveRun();
        return;
      }
      rejectRun(new Error(`${command} exited with code ${String(code)}`));
    });
  });
}

export function captureCommand(command, args, options = {}) {
  return new Promise((resolveRun, rejectRun) => {
    const child = spawn(command, args, {
      stdio: ['ignore', 'pipe', 'pipe'],
      shell: NEEDS_SHELL,
      ...options,
    });
    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString('utf-8');
    });
    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString('utf-8');
    });
    child.on('error', rejectRun);
    child.on('exit', (code) => {
      resolveRun({ code, stdout, stderr });
    });
  });
}
