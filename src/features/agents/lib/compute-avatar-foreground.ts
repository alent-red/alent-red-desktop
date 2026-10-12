import { isBrandAgentName } from '@/features/agents/lib/is-brand-agent-name';

// Pairs with computeAvatarBackground: the 12 palette colors are all dark enough
// for white text, but the brand agent's background is the brand red, so its
// text must follow --color-brand-foreground to stay legible in both themes.
export function computeAvatarForeground(name: string): string {
  if (isBrandAgentName(name)) {
    return 'var(--color-brand-foreground)';
  }
  return '#ffffff';
}
