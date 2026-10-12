import * as React from 'react';

import { Logo } from '@/shared/views/logo';

interface OnboardingShellProps {
  children: React.ReactNode;
}

export const OnboardingShell = ({ children }: OnboardingShellProps): React.ReactElement => (
  <div className="relative h-full w-full overflow-y-auto bg-app">
    <div
      data-tauri-drag-region
      aria-hidden
      className="sticky top-0 left-0 right-0 z-10 bg-app"
      style={{ height: 'var(--titlebar-safe-area)' }}
    />
    <div className="min-h-[calc(100%-var(--titlebar-safe-area))] flex flex-col items-center justify-center py-8">
      <div className="flex flex-col items-center gap-5 max-w-[440px] w-full px-8">
        <Logo size={48} />
        {children}
      </div>
    </div>
  </div>
);
