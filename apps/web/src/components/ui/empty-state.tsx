import type { LucideIcon } from "lucide-react";

import { Inbox } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type EmptyStateProps = Omit<React.ComponentProps<"div">, "title"> & {
  icon?: LucideIcon;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
};

function EmptyState({
  className,
  icon: Icon = Inbox,
  title,
  description,
  action,
  ...props
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-surface-subtle px-6 py-12 text-center",
        className,
      )}
      {...props}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon aria-hidden="true" className="size-5" />
      </span>
      <div className="grid max-w-md gap-1.5">
        <h3 className="text-h4 text-foreground">{title}</h3>
        {description ? <p className="text-body-sm text-muted-foreground">{description}</p> : null}
      </div>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}

export { EmptyState };
