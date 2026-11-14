import type { VariantProps } from "class-variance-authority";

import { CircleCheck, Info, OctagonX, TriangleAlert } from "lucide-react";
import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "relative flex w-full gap-3 border border-line bg-surface/70 p-4 text-body-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0",
  {
    variants: {
      tone: {
        info: "text-ink [&>svg]:text-info",
        success: "text-ink [&>svg]:text-success",
        warning: "text-ink [&>svg]:text-warning",
        danger: "text-ink [&>svg]:text-danger",
      },
    },
    defaultVariants: {
      tone: "info",
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

function Alert({ className, tone = "info", title, children, ...props }: AlertProps) {
  const Icon = alertIcons[tone ?? "info"];

  return (
    <div
      data-slot="alert"
      role={tone === "danger" || tone === "warning" ? "alert" : "status"}
      className={cn(alertVariants({ tone, className }))}
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
      className={cn("font-medium leading-none text-ink", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn("text-body-sm text-ink-muted", className)}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle, alertVariants };
