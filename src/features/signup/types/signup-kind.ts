export const SignupKind = {
  Individual: 'INDIVIDUAL',
  Company: 'COMPANY',
} as const;

export type SignupKind = (typeof SignupKind)[keyof typeof SignupKind];
