import type { VariantProps } from "class-variance-authority";

import { CircleCheck, Info, OctagonX, TriangleAlert } from "lucide-react";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative flex w-full gap-3 rounded-lg border p-4 text-body-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        info: "border-status-info/30 bg-status-info/10 text-foreground [&>svg]:text-status-info",
        success:
          "border-status-success/30 bg-status-success/10 text-foreground [&>svg]:text-status-success",
        warning:
          "border-status-warning/30 bg-status-warning/10 text-foreground [&>svg]:text-status-warning",
        danger:
          "border-status-danger/30 bg-status-danger/10 text-foreground [&>svg]:text-status-danger",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

const alertIcons = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: OctagonX,
} as const;

type AlertProps = React.ComponentProps<"div"> &
  VariantProps<typeof alertVariants> & {
    title?: React.ReactNode;
  };

function Alert({ className, variant = "info", title, children, ...props }: AlertProps) {
  const Icon = alertIcons[variant ?? "info"];

  return (
    <div
      data-slot="alert"
      role={variant === "danger" || variant === "warning" ? "alert" : "status"}
      className={cn(alertVariants({ variant, className }))}
      {...props}
    >
      <Icon aria-hidden="true" />
      <div className="grid gap-1">
        {title ? <AlertTitle>{title}</AlertTitle> : null}
        {children ? <AlertDescription>{children}</AlertDescription> : null}
      </div>
    </div>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn("font-medium leading-none text-foreground", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-body-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle, alertVariants };
