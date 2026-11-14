"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

export type RadioOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type RadioGroupProps = Omit<React.ComponentProps<"div">, "onChange" | "defaultValue"> & {
  name?: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
};

function RadioGroup({
  className,
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  ...props
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const current = value ?? internalValue;
  const groupName = name ?? React.useId();

  function select(next: string) {
    if (value === undefined) {
      setInternalValue(next);
    }

    onValueChange?.(next);
  }

  return (
    <div role="radiogroup" className={cn("grid gap-3", className)} {...props}>
      {options.map((option) => (
        <label key={option.value} className="inline-flex cursor-pointer items-center gap-3">
          <input
            type="radio"
            name={groupName}
            value={option.value}
            checked={current === option.value}
            disabled={option.disabled}
            onChange={() => select(option.value)}
            className="peer sr-only"
          />
          <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-line-strong bg-canvas transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:[&>span]:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-accent/30 peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
            <span className="size-2 rounded-full bg-canvas opacity-0" />
          </span>
          <span className="text-body-sm text-ink">{option.label}</span>
        </label>
      ))}
    </div>
  );
}

export { RadioGroup };
