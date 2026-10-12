const RED = '\x1b[0;31m';
const GREEN = '\x1b[0;32m';
const YELLOW = '\x1b[1;33m';
const BLUE = '\x1b[0;34m';
const RESET = '\x1b[0m';

export function info(message) {
  console.log(`${BLUE}${message}${RESET}`);
}

export function success(message) {
  console.log(`${GREEN}${message}${RESET}`);
}

export function warn(message) {
  console.warn(`${YELLOW}${message}${RESET}`);
}

export function abort(message) {
  console.error(`${RED}${message}${RESET}`);
  process.exit(1);
}
