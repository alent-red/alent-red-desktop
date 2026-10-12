export const PreferenceValueType = {
  String: 'STRING',
  Int: 'INT',
  Float: 'FLOAT',
  Bool: 'BOOL',
} as const;
export type PreferenceValueType = (typeof PreferenceValueType)[keyof typeof PreferenceValueType];
