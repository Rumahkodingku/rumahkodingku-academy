"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

type SwitchProps = Omit<React.ComponentProps<"input">, "type" | "onChange"> & {
  onCheckedChange?: (checked: boolean) => void;
};

function Switch({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  ...props
}: SwitchProps) {
  const [internalChecked, setInternalChecked] = React.useState(defaultChecked);
  const current = checked ?? internalChecked;

  function toggle(next: boolean) {
    if (checked === undefined) {
      setInternalChecked(next);
    }

    onCheckedChange?.(next);
  }

  return (
    <label className={cn("inline-flex cursor-pointer items-center", className)}>
      <input
        type="checkbox"
        role="switch"
        data-slot="switch"
        className="peer sr-only"
        checked={current}
        onChange={(event) => toggle(event.target.checked)}
        {...props}
      />
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-line-strong bg-surface-sunken transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:[&>span]:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
        <span className="absolute left-0.5 size-5 rounded-full bg-canvas shadow-1 transition-transform" />
      </span>
    </label>
  );
}

export { Switch };
