import { type PreferenceValueType } from '@/features/preferences/types/preference-value-type';

export type PreferenceValue =
  | { type: typeof PreferenceValueType.String; value: string }
  | { type: typeof PreferenceValueType.Int; value: number }
  | { type: typeof PreferenceValueType.Float; value: number }
  | { type: typeof PreferenceValueType.Bool; value: boolean };
