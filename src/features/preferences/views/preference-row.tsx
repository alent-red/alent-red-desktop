import * as React from 'react';

import { CACHE_TTL_PREFERENCE_KEYS } from '@/features/preferences/constants/cache-ttl-preference-keys';
import type { PreferenceEntry } from '@/features/preferences/constants/preference-entries';
import { validatePreferenceValue } from '@/features/preferences/lib/validate-preference-value';
import type { PreferenceValue } from '@/features/preferences/types/preference-value';
import { PreferenceValueType } from '@/features/preferences/types/preference-value-type';
import { PreferenceBoolField } from '@/features/preferences/views/preference-bool-field';
import { PreferenceCacheTtlField } from '@/features/preferences/views/preference-cache-ttl-field';
import { PreferenceFloatField } from '@/features/preferences/views/preference-float-field';
import { PreferenceIntField } from '@/features/preferences/views/preference-int-field';
import { PreferenceStringField } from '@/features/preferences/views/preference-string-field';
import { translate } from '@/shared/i18n/translate';
import { Label } from '@/shared/views/label';

interface PreferenceRowProps {
  entry: PreferenceEntry;
  value: PreferenceValue | undefined;
  onChange: (next: PreferenceValue) => void;
  isDisabled: boolean;
}

export const PreferenceRow = ({
  entry,
  value,
  onChange,
  isDisabled,
}: PreferenceRowProps): React.ReactElement | null => {
  const [isTouched, setIsTouched] = React.useState(false);
  if (value === undefined) {
    return null;
  }
  const error = isTouched ? validatePreferenceValue(value) : null;
  const markTouched = (): void => {
    setIsTouched(true);
  };
  const isCacheTtl =
    value.type === PreferenceValueType.String && CACHE_TTL_PREFERENCE_KEYS.has(entry.key);

  return (
    <div className="grid grid-cols-[200px_minmax(0,1fr)] gap-2 items-start">
      <Label className="pt-2">{translate(entry.labelKey)}</Label>
      <div className="min-w-0 w-full">
        {value.type === PreferenceValueType.String && isCacheTtl ? (
          <PreferenceCacheTtlField
            value={value.value}
            isDisabled={isDisabled}
            onChange={(next): void => {
              onChange({ type: PreferenceValueType.String, value: next });
              markTouched();
            }}
          />
        ) : null}
        {value.type === PreferenceValueType.String && !isCacheTtl ? (
          <PreferenceStringField
            value={value.value}
            error={error}
            isDisabled={isDisabled}
            onChange={(next): void => {
              onChange({ type: PreferenceValueType.String, value: next });
            }}
            onBlur={markTouched}
          />
        ) : null}
        {value.type === PreferenceValueType.Int ? (
          <PreferenceIntField
            value={value.value}
            error={error}
            isDisabled={isDisabled}
            onChange={(next): void => {
              onChange({ type: PreferenceValueType.Int, value: next });
            }}
            onBlur={markTouched}
          />
        ) : null}
        {value.type === PreferenceValueType.Float ? (
          <PreferenceFloatField
            value={value.value}
            error={error}
            isDisabled={isDisabled}
            onChange={(next): void => {
              onChange({ type: PreferenceValueType.Float, value: next });
            }}
            onBlur={markTouched}
          />
        ) : null}
        {value.type === PreferenceValueType.Bool ? (
          <PreferenceBoolField
            value={value.value}
            isDisabled={isDisabled}
            onChange={(next): void => {
              onChange({ type: PreferenceValueType.Bool, value: next });
            }}
          />
        ) : null}
      </div>
    </div>
  );
};
