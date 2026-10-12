import { avatarColorVariable } from '@/features/agents/lib/avatar-color-variable';
import { computeAvatarColorIndex } from '@/features/agents/lib/compute-avatar-color-index';
import { isBrandAgentName } from '@/features/agents/lib/is-brand-agent-name';

export function computeAvatarBackground(name: string): string {
  if (isBrandAgentName(name)) {
    return 'var(--color-brand)';
  }
  return avatarColorVariable(computeAvatarColorIndex(name));
}
