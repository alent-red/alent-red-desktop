import { useWindowBehaviorStore } from '@/features/window-behavior/stores/window-behavior-store';

export function setIsContentProtected(value: boolean): void {
  useWindowBehaviorStore.getState().setIsContentProtected(value);
}
