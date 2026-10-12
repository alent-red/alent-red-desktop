import { useWindowBehaviorStore } from '@/features/window-behavior/stores/window-behavior-store';
import type { WindowBehavior } from '@/features/window-behavior/types/window-behavior';

export function applyExternalWindowBehaviorBroadcast(behavior: WindowBehavior): void {
  const store = useWindowBehaviorStore.getState();
  store.setIsAlwaysOnTop(behavior.isAlwaysOnTop, { broadcast: false });
  store.setIsContentProtected(behavior.isContentProtected, { broadcast: false });
}
