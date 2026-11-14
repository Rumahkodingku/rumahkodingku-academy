import type { ReactNode } from "react";

import { LanguageSwitch } from "@/components/language-switch";

type AuthFormPanelProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthFormPanel({ title, description, children }: AuthFormPanelProps) {
  return (
    <div className="w-full">
      <div className="mb-10 flex items-center justify-end gap-1">
        <LanguageSwitch />
      </div>

      <div className="grid gap-3">
        <h1 className="text-h2 text-ink">{title}</h1>
        <p className="max-w-[42ch] text-body-sm text-ink-muted">{description}</p>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}
