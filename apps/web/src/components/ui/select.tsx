"use client";

import { Check, ChevronDown } from "lucide-react";
import { createPortal } from "react-dom";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAnchoredPosition } from "@/lib/ui/use-anchored-position";
import { useDismissableLayer } from "@/lib/ui/use-dismissable-layer";
import { useTypeahead } from "@/lib/ui/use-typeahead";
import { cn } from "@/lib/utils";

const supportsPopover =
  typeof window !== "undefined" && typeof HTMLElement.prototype.showPopover === "function";

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

type SelectProps = {
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  "aria-label"?: string;
  disabled?: boolean;
  variant?: "popover" | "sheet";
};

function Select({
  options,
  value: controlledValue,
  defaultValue = "",
  onValueChange,
  placeholder = "Pilih opsi",
  className,
  id,
  "aria-label": ariaLabel,
  disabled = false,
  variant = "popover",
}: SelectProps) {
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const value = controlledValue ?? uncontrolledValue;
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const listboxId = useRef(`select-${Math.random().toString(36).slice(2)}`).current;

  const selectedIndex = options.findIndex((option) => option.value === value);
  const selected = options[selectedIndex];
  const typeahead = useTypeahead({
    items: options,
    getLabel: (option) => option.label,
  });

  const setValue = useCallback(
    (next: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(next);
      }

      onValueChange?.(next);
    },
    [controlledValue, onValueChange],
  );

  const close = useCallback((restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) {
      triggerRef.current?.focus();
    }
  }, []);

  const openList = useCallback(() => {
    if (disabled) return;
    setOpen(true);
    const initial =
      selectedIndex >= 0 && !options[selectedIndex]?.disabled
        ? selectedIndex
        : firstEnabled(options);
    setActiveIndex(initial);
  }, [disabled, options, selectedIndex]);

  useDismissableLayer({
    open,
    onDismiss: () => close(false),
    refs: [triggerRef, listboxRef],
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const listbox = listboxRef.current;
    listbox?.showPopover?.();
    triggerRef.current?.focus();

    return () => listbox?.hidePopover?.();
  }, [open]);

  useEffect(() => {
    if (!open || activeIndex < 0) return;

    document
      .getElementById(`${listboxId}-option-${options[activeIndex]?.value}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listboxId, open]);

  const { style, placement } = useAnchoredPosition({
    open: open && variant === "popover",
    triggerRef,
    contentRef: listboxRef,
    side: "bottom",
    align: "start",
    offset: 6,
  });

  function moveActive(direction: 1 | -1) {
    if (options.length === 0) return;

    let next = activeIndex;

    for (let step = 0; step < options.length; step += 1) {
      next = (next + direction + options.length) % options.length;
      if (!options[next]?.disabled) {
        setActiveIndex(next);
        return;
      }
    }
  }

  function selectActive() {
    const option = options[activeIndex];
    if (!option || option.disabled) return;

    setValue(option.value);
    close();
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openList();
      }
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      moveActive(event.key === "ArrowDown" ? 1 : -1);
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const enabled = options
        .map((option, index) => ({ option, index }))
        .filter(({ option }) => !option.disabled);
      const target = event.key === "Home" ? enabled[0] : enabled.at(-1);
      if (target) setActiveIndex(target.index);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectActive();
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key.length === 1) {
      const matched = typeahead(event.key, activeIndex);
      if (matched !== null) setActiveIndex(matched);
    }
  }

  const content = (
    <div
      ref={listboxRef}
      id={listboxId}
      role="listbox"
      aria-label={ariaLabel}
      popover={supportsPopover ? "manual" : undefined}
      data-placement={placement}
      style={variant === "sheet" ? { position: "fixed", insetInline: 0, bottom: 0 } : style}
      className={cn(
        "z-50 max-h-72 min-w-48 overflow-y-auto rounded-md border border-line bg-surface p-1 text-ink shadow-3 outline-none",
        variant === "sheet" && "w-full rounded-b-none border-x-0 border-b-0 p-2",
      )}
    >
      {options.map((option, index) => {
        const selectedOption = option.value === value;
        const active = index === activeIndex;

        return (
          <button
            key={option.value}
            id={`${listboxId}-option-${option.value}`}
            type="button"
            role="option"
            aria-selected={selectedOption}
            aria-disabled={option.disabled || undefined}
            data-active={active || undefined}
            disabled={option.disabled}
            onPointerDown={(event) => event.preventDefault()}
            onClick={() => {
              if (option.disabled) return;
              setActiveIndex(index);
              setValue(option.value);
              close();
            }}
            className={cn(
              "flex w-full items-center justify-between gap-3 rounded-sm px-3 py-2.5 text-left text-body-sm outline-none transition-colors",
              active && "bg-surface-sunken",
              option.disabled && "cursor-not-allowed opacity-40",
              selectedOption && "text-accent-strong",
            )}
          >
            {option.label}
            {selectedOption ? <Check aria-hidden="true" className="size-4" /> : null}
          </button>
        );
      })}
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        id={id}
        type="button"
        role="combobox"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-activedescendant={
          open && activeIndex >= 0
            ? `${listboxId}-option-${options[activeIndex]?.value}`
            : undefined
        }
        disabled={disabled}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        className={cn(
          "flex h-12 w-full items-center justify-between gap-2 rounded-md border border-line-strong bg-canvas px-3 text-body-sm text-ink outline-none transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/25 disabled:cursor-not-allowed disabled:opacity-50 aria-expanded:border-accent",
          className,
        )}
      >
        <span className={cn(!selected && "text-ink-muted")}>{selected?.label ?? placeholder}</span>
        <ChevronDown aria-hidden="true" className="size-4 text-ink-muted" />
      </button>

      {open && mounted ? createPortal(content, document.body) : null}
    </>
  );
}

function firstEnabled(options: SelectOption[]): number {
  return options.findIndex((option) => !option.disabled);
}

export { Select };
