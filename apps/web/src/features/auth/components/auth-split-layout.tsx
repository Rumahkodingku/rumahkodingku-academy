import type { ReactNode } from "react";

import { AuthBrandPanel } from "./auth-brand-panel";

export function AuthSplitLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-testid="auth-split"
      className="grid min-h-svh grid-cols-1 overflow-x-hidden bg-background lg:grid-cols-[minmax(0,6fr)_minmax(360px,4fr)] xl:grid-cols-[minmax(0,7fr)_minmax(360px,3fr)]"
    >
      <AuthBrandPanel />
      <div className="flex min-h-svh items-center justify-center bg-surface-subtle px-4 py-8 sm:px-6 lg:min-h-0 lg:px-3 lg:py-10">
        <div className="w-full max-w-[420px] animate-auth-rise">{children}</div>
      </div>
    </div>
  );
}
