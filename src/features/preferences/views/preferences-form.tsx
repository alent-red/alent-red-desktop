import * as React from 'react';

import { PREFERENCE_ENTRIES } from '@/features/preferences/constants/preference-entries';
import { groupPreferenceEntries } from '@/features/preferences/lib/group-preference-entries';
import { normalizePreferenceValue } from '@/features/preferences/lib/normalize-preference-value';
import { preferenceValuesEqual } from '@/features/preferences/lib/preference-values-equal';
import { validatePreferenceValue } from '@/features/preferences/lib/validate-preference-value';
import { useSavePreferences } from '@/features/preferences/queries/use-save-preferences';
import type { Preference } from '@/features/preferences/types/preference';
import type { PreferenceInput } from '@/features/preferences/types/preference-input';
import type { PreferenceKey } from '@/features/preferences/types/preference-key';
import type { PreferenceValue } from '@/features/preferences/types/preference-value';
import { PreferenceRow } from '@/features/preferences/views/preference-row';
import { PreferencesHeader } from '@/features/preferences/views/preferences-header';
import { toastDanger } from '@/features/toasts/actions/toast-danger';
import { toastError } from '@/features/toasts/actions/toast-error';
import { toastSuccess } from '@/features/toasts/actions/toast-success';
import { toastWarning } from '@/features/toasts/actions/toast-warning';
import { translate, type TranslationKey } from '@/shared/i18n/translate';
import { ScrollArea } from '@/shared/views/scroll-area';
import { Separator } from '@/shared/views/separator';

interface PreferencesFormProps {
  preferences: Preference[];
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const PreferencesForm = ({
  preferences,
  onRefresh,
  isRefreshing,
}: PreferencesFormProps): React.ReactElement => {
  const save = useSavePreferences();

  const [preferencesSnapshot] = React.useState(preferences);

  const [draft, setDraft] = React.useState<Record<PreferenceKey, PreferenceValue>>(
    (): Record<PreferenceKey, PreferenceValue> =>
      Object.fromEntries(
        preferencesSnapshot.map((preference): [PreferenceKey, PreferenceValue] => [
          preference.key,
          preference.value,
        ]),
      ) as Record<PreferenceKey, PreferenceValue>,
  );

  const submit = async (): Promise<void> => {
    const normalizedDraft: Record<PreferenceKey, PreferenceValue> = Object.fromEntries(
      Object.entries(draft).map(([key, value]): [string, PreferenceValue] => [
        key,
        normalizePreferenceValue(value),
      ]),
    ) as Record<PreferenceKey, PreferenceValue>;

    const invalidEntry = preferencesSnapshot.find(
      (preference): boolean => validatePreferenceValue(normalizedDraft[preference.key]) !== null,
    );
    if (invalidEntry !== undefined) {
      toastDanger(translate('preferences.someInvalid'), translate('preferences.fixHighlighted'));
      return;
    }

    const changes: PreferenceInput[] = preferencesSnapshot
      .filter(
        (preference): boolean =>
          !preferenceValuesEqual(preference.value, normalizedDraft[preference.key]),
      )
      .map(
        (preference): PreferenceInput => ({
          key: preference.key,
          value: normalizedDraft[preference.key],
        }),
      );
    if (changes.length === 0) {
      toastWarning(translate('preferences.nothingToSave'));
      return;
    }
    try {
      await save.mutateAsync(changes);
      toastSuccess(translate('preferences.preferencesSaved'));
    } catch (caught) {
      toastError(caught);
    }
  };

  const grouped = groupPreferenceEntries(PREFERENCE_ENTRIES, (entry): string => entry.groupKey);
  const groupedEntries = Object.entries(grouped);

  return (
    <>
      <PreferencesHeader
        isRefreshing={isRefreshing}
        isSaving={save.isPending}
        onRefresh={onRefresh}
        onSave={(): void => {
          void submit();
        }}
      />
      <ScrollArea className="flex-1">
        <div className="px-6 py-4 flex flex-col gap-6">
          {groupedEntries.map(
            ([group, entries], index): React.ReactElement => (
              <React.Fragment key={group}>
                <section className="flex flex-col gap-2">
                  <div className="text-[11px] font-semibold text-muted uppercase tracking-wider">
                    {translate(group as TranslationKey)}
                  </div>
                  <div className="flex flex-col gap-4">
                    {entries.map(
                      (entry): React.ReactElement => (
                        <PreferenceRow
                          key={entry.key}
                          entry={entry}
                          value={draft[entry.key]}
                          onChange={(next): void => {
                            setDraft(
                              (previous): Record<PreferenceKey, PreferenceValue> => ({
                                ...previous,
                                [entry.key]: next,
                              }),
                            );
                          }}
                          isDisabled={save.isPending}
                        />
                      ),
                    )}
                  </div>
                </section>
                {index < groupedEntries.length - 1 ? <Separator /> : null}
              </React.Fragment>
            ),
          )}
        </div>
      </ScrollArea>
    </>
  );
};
