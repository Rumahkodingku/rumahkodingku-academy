import type { LucideIcon } from "lucide-react";

import { Inbox } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = Omit<React.ComponentProps<"div">, "title"> & {
  icon?: LucideIcon;
  code?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

function EmptyState({
  className,
  icon: Icon = Inbox,
  code,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn("grid gap-6 border-t border-line pt-10", className)}
      {...props}
    >
      <div className="flex items-center gap-3">
        <Icon aria-hidden="true" className="size-5 text-accent" />
        {code ? (
          <p className="font-mono text-eyebrow uppercase tracking-[0.16em] text-accent">{code}</p>
        ) : null}
      </div>
      <div className="grid max-w-[52ch] gap-3">
        <h2 className="text-h2 text-ink">{title}</h2>
        {description ? <p className="text-body-lg text-ink-muted">{description}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </div>
  );
}

export { EmptyState };
