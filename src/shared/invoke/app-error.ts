import type { AppErrorPayload } from '@/shared/types/app-error-payload';
import { ErrorCode } from '@/shared/types/error-code';

const KNOWN_ERROR_CODES = new Set<string>(Object.values(ErrorCode));

function coerceErrorCode(value: string): ErrorCode {
  if (KNOWN_ERROR_CODES.has(value)) {
    return value as ErrorCode;
  }
  return ErrorCode.Unknown;
}

export class AppError extends Error {
  override readonly name = 'AppError';
  readonly code: ErrorCode;
  readonly detail: string | null;

  constructor(payload: AppErrorPayload) {
    super(payload.message ?? payload.code);
    this.code = coerceErrorCode(payload.code);
    this.detail = payload.message;
  }
}
