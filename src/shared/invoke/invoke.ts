import { invoke as tauriInvoke } from '@tauri-apps/api/core';

import { AppError } from '@/shared/invoke/app-error';
import { reportTransportFailure } from '@/shared/invoke/transport-failure-reporter';
import { isAppErrorPayloadShape } from '@/shared/lib/is-app-error-payload-shape';
import { ErrorCode } from '@/shared/types/error-code';

function toAppError(error: unknown): AppError {
  if (isAppErrorPayloadShape(error)) {
    return new AppError(error);
  }
  if (error instanceof Error) {
    return new AppError({ code: ErrorCode.Transport, message: error.message });
  }
  return new AppError({
    code: ErrorCode.Transport,
    message: typeof error === 'string' ? error : 'Unknown transport error',
  });
}

export async function invoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  try {
    return await tauriInvoke<T>(command, args);
  } catch (caught) {
    const appError = toAppError(caught);
    if (appError.code === ErrorCode.Transport) {
      reportTransportFailure(appError, command);
    }
    throw appError;
  }
}
