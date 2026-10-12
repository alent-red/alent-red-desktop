import { en } from '@/shared/i18n/dictionaries/en';

type Dictionary = typeof en;
type Path<T, Prefix extends string = ''> = {
  [K in keyof T & string]: T[K] extends string
    ? `${Prefix}${K}`
    : T[K] extends object
      ? Path<T[K], `${Prefix}${K}.`>
      : never;
}[keyof T & string];

export type TranslationKey = Path<Dictionary>;

function resolve(dict: unknown, segments: string[]): unknown {
  return segments.reduce<unknown>((node, segment): unknown => {
    if (node !== null && typeof node === 'object' && segment in node) {
      return (node as Record<string, unknown>)[segment];
    }
    return undefined;
  }, dict);
}

export function translate(key: TranslationKey, params?: Record<string, string | number>): string {
  const value = resolve(en, key.split('.'));
  if (typeof value !== 'string') {
    if (import.meta.env.DEV) {
      console.warn(`Missing translation: ${key}`);
    }
    return key;
  }
  if (params === undefined) {
    return value;
  }
  return value.replace(/\{(\w+)\}/g, (_, name: string): string =>
    name in params ? String(params[name]) : `{${name}}`,
  );
}
