// Mirrors the core's `TelegramUsernameStr` contract: the client strips
// the leading "@", lowercases, and trims spaces. The core then accepts
// the canonical form only (5-32 of [a-z0-9_]).
export function canonicalizeTelegramUsername(value: string): string {
  const trimmed = value.trim();
  const withoutAt = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  return withoutAt.toLowerCase();
}
