import type { AppErrorPayload } from '@/shared/types/app-error-payload';

export function isAppErrorPayloadShape(value: unknown): value is AppErrorPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  if (!('code' in value)) {
    return false;
  }
  return typeof value.code === 'string';
}
