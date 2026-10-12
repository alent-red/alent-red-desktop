export const ErrorCode = {
  Unknown: 'UNKNOWN',
  Internal: 'INTERNAL',
  InvalidArgument: 'INVALID_ARGUMENT',
  NotSupported: 'NOT_SUPPORTED',
  NotAllowed: 'NOT_ALLOWED',
  NotFound: 'NOT_FOUND',
  Duplicated: 'DUPLICATED',
  RelationViolation: 'RELATION_VIOLATION',
  RateLimit: 'RATE_LIMIT',
  InvalidResponse: 'INVALID_RESPONSE',
  Timeout: 'TIMEOUT',
  Transport: 'TRANSPORT',
} as const;
export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];
