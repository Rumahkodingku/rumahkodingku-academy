import type { VariantProps } from "class-variance-authority";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-caption font-medium",
  {
    variants: {
      variant: {
        neutral: "border-border bg-muted text-muted-foreground",
        info: "border-status-info/30 bg-status-info/10 text-status-info",
        success: "border-status-success/30 bg-status-success/10 text-status-success",
        warning: "border-status-warning/30 bg-status-warning/10 text-status-warning",
        danger: "border-status-danger/30 bg-status-danger/10 text-status-danger",
        outline: "border-border-strong bg-transparent text-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span data-slot="badge" className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
