import { useWindowBehaviorStore } from '@/features/window-behavior/stores/window-behavior-store';

export function setIsAlwaysOnTop(value: boolean): void {
  useWindowBehaviorStore.getState().setIsAlwaysOnTop(value);
}
