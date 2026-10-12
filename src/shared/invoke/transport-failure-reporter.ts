import type { AppError } from '@/shared/invoke/app-error';

export type TransportFailureReporter = (error: AppError, command: string) => void;

let reporter: TransportFailureReporter | null = null;

export function setTransportFailureReporter(next: TransportFailureReporter): void {
  reporter = next;
}

export function reportTransportFailure(error: AppError, command: string): void {
  if (reporter === null) {
    return;
  }
  reporter(error, command);
}
