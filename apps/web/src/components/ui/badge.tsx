import type { VariantProps } from "class-variance-authority";

import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-caption font-medium",
  {
    variants: {
      tone: {
        neutral: "border-line bg-transparent text-ink-muted",
        accent: "border-accent/30 bg-accent-soft text-accent-strong",
        success: "border-success/30 bg-transparent text-success",
        warning: "border-warning/30 bg-transparent text-warning",
        danger: "border-danger/30 bg-transparent text-danger",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

function Badge({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ tone, className }))} {...props} />;
}

export { Badge, badgeVariants };
