import * as React from 'react';

export interface UseFieldErrorsResult {
  errors: Record<string, string>;
  touched: Set<string>;
  isShowingAll: boolean;
  touch: (name: string) => void;
  touchAll: () => void;
  errorFor: (name: string) => string | null;
  isValid: boolean;
}

export function useFieldErrors<TValues>(
  values: TValues,
  validate: (values: TValues) => Record<string, string>,
): UseFieldErrorsResult {
  const [touched, setTouched] = React.useState<Set<string>>(new Set());
  const [isShowingAll, setIsShowingAll] = React.useState(false);

  const errors = React.useMemo((): Record<string, string> => validate(values), [values, validate]);

  const touch = React.useCallback((name: string): void => {
    setTouched((previous): Set<string> => {
      if (previous.has(name)) {
        return previous;
      }
      const next = new Set(previous);
      next.add(name);
      return next;
    });
  }, []);

  const touchAll = React.useCallback((): void => {
    setIsShowingAll(true);
  }, []);

  const errorFor = React.useCallback(
    (name: string): string | null => {
      const message = errors[name];
      if (message === undefined || message.length === 0) {
        return null;
      }
      if (isShowingAll) {
        return message;
      }
      return touched.has(name) ? message : null;
    },
    [errors, isShowingAll, touched],
  );

  return {
    errors,
    touched,
    isShowingAll,
    touch,
    touchAll,
    errorFor,
    isValid: Object.keys(errors).length === 0,
  };
}
