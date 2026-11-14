"use client";

import { Check } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type CheckboxProps = Omit<React.ComponentProps<"input">, "type"> & {
  onCheckedChange?: (checked: boolean) => void;
};

function Checkbox({ className, onCheckedChange, ...props }: CheckboxProps) {
  return (
    <label className={cn("inline-flex cursor-pointer items-center gap-2", className)}>
      <input
        type="checkbox"
        data-slot="checkbox"
        className="peer sr-only"
        onChange={(event) => onCheckedChange?.(event.target.checked)}
        {...props}
      />
      <span className="flex size-5 shrink-0 items-center justify-center rounded-sm border border-line-strong bg-canvas text-transparent transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-canvas peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
        <Check aria-hidden="true" className="size-3.5" />
      </span>
    </label>
  );
}

export { Checkbox };
