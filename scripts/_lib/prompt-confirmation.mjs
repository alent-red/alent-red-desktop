import { createInterface } from 'node:readline/promises';
import { stdin, stdout } from 'node:process';

export async function promptConfirmation(question) {
  const readline = createInterface({ input: stdin, output: stdout });
  try {
    const answer = await readline.question(`${question} `);
    return answer.trim() === 'yes';
  } finally {
    readline.close();
  }
}
