import { spawn } from 'node:child_process';

// Bare `tar` on Git Bash for Windows resolves to the MSYS port, which treats
// arguments matching `C:...` as `host:path` (i.e. a remote SCP-style address)
// and tries to network-connect. The Windows-native tar at C:\Windows\System32
// parses Windows paths correctly. On macOS the BSD tar bundled with the OS
// is fine. On Linux unzip is more lenient than tar with mixed zip variants.
function extractCommand(zipPath, destinationParent) {
  if (process.platform === 'linux') {
    return { command: 'unzip', args: ['-q', zipPath, '-d', destinationParent] };
  }
  if (process.platform === 'win32') {
    return {
      command: 'C:\\Windows\\System32\\tar.exe',
      args: ['-xf', zipPath, '-C', destinationParent],
    };
  }
  return { command: 'tar', args: ['-xf', zipPath, '-C', destinationParent] };
}

export function extractZip(zipPath, destinationParent) {
  return new Promise((resolveExtract, rejectExtract) => {
    const { command, args } = extractCommand(zipPath, destinationParent);
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', rejectExtract);
    child.on('exit', (code) => {
      if (code === 0) {
        resolveExtract();
        return;
      }
      rejectExtract(new Error(`${command} exited with code ${String(code)}`));
    });
  });
}
