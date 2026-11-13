import type { ReactNode } from "react";

import { LanguageSwitch } from "@/components/language-switch";
import { ModeToggle } from "@/components/mode-toggle";
import { Card } from "@/components/ui/card";

type AuthFormPanelProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthFormPanel({ title, description, children }: AuthFormPanelProps) {
  return (
    <Card className="overflow-visible border-border/80 bg-surface-default/95 p-0 shadow-3 backdrop-blur-sm">
      <div className="flex items-center justify-end gap-1 border-b border-border px-5 py-4 sm:px-6">
        <LanguageSwitch />
        <ModeToggle />
      </div>

      <div className="p-5 sm:p-7">
        <div className="grid gap-2">
          <h1 className="text-h2 text-foreground">{title}</h1>
          <p className="text-body-sm text-muted-foreground">{description}</p>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </Card>
  );
}
