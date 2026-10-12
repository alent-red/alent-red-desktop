import { translate, type TranslationKey } from '@/shared/i18n/translate';
import { AppError } from '@/shared/invoke/app-error';
import { isAppErrorPayloadShape } from '@/shared/lib/is-app-error-payload-shape';
import { ErrorCode } from '@/shared/types/error-code';

export interface ErrorPresentation {
  code: ErrorCode;
  title: string;
  detail: string | null;
}

const ERROR_KEY_MAP: Record<ErrorCode, TranslationKey> = {
  [ErrorCode.Unknown]: 'error.unknown',
  [ErrorCode.Internal]: 'error.internal',
  [ErrorCode.InvalidArgument]: 'error.invalidArgument',
  [ErrorCode.NotSupported]: 'error.notSupported',
  [ErrorCode.NotAllowed]: 'error.notAllowed',
  [ErrorCode.NotFound]: 'error.notFound',
  [ErrorCode.Duplicated]: 'error.duplicated',
  [ErrorCode.RelationViolation]: 'error.relationViolation',
  [ErrorCode.RateLimit]: 'error.rateLimit',
  [ErrorCode.InvalidResponse]: 'error.invalidResponse',
  [ErrorCode.Timeout]: 'error.timeout',
  [ErrorCode.Transport]: 'error.transport',
};

function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }
  if (isAppErrorPayloadShape(error)) {
    return new AppError(error);
  }
  if (error instanceof Error) {
    return new AppError({ code: ErrorCode.Unknown, message: error.message });
  }
  if (typeof error === 'string') {
    return new AppError({ code: ErrorCode.Unknown, message: error });
  }
  return new AppError({ code: ErrorCode.Unknown, message: null });
}

export function presentError(error: unknown): ErrorPresentation {
  const appError = toAppError(error);
  return {
    code: appError.code,
    title: translate(ERROR_KEY_MAP[appError.code]),
    detail: appError.detail,
  };
}
