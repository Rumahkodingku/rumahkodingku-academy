import type { ReactNode } from "react";

import { AuthBrandPanel } from "./auth-brand-panel";

export function AuthSplitLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-testid="auth-split"
      className="grid min-h-svh grid-cols-1 overflow-x-hidden bg-canvas lg:grid-cols-2"
    >
      <AuthBrandPanel />
      <div className="flex min-h-svh items-start justify-center border-line bg-canvas px-5 py-10 sm:px-7 lg:min-h-0 lg:items-center lg:border-l lg:px-10 xl:px-16">
        <div className="w-full max-w-[420px] animate-auth-rise">{children}</div>
      </div>
    </div>
  );
}
