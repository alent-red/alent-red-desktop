import { isBrandAgentName } from '@/features/agents/lib/is-brand-agent-name';

export function computeInitials(name: string): string {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return '?';
  }
  if (isBrandAgentName(trimmed)) {
    return 'A';
  }
  const tokens = trimmed.split(/[\s.]+/).filter((token): boolean => token.length > 0);
  const firstToken = tokens[0] ?? '';
  if (tokens.length === 0) {
    return '?';
  }
  if (tokens.length === 1) {
    return `${firstToken.charAt(0)}${firstToken.charAt(1)}`.toUpperCase();
  }
  const secondToken = tokens[1] ?? '';
  return `${firstToken.charAt(0)}${secondToken.charAt(0)}`.toUpperCase();
}
