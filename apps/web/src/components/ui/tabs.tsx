"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useControllableState } from "@/lib/ui/use-controllable-state";

type TabsContextValue = {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

function useTabs() {
  const context = React.useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs parts must be used inside <Tabs>.");
  }

  return context;
}

function Tabs({
  className,
  value,
  defaultValue = "",
  onValueChange,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}) {
  const baseId = React.useId();
  const [current, setCurrent] = useControllableState({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  return (
    <TabsContext.Provider value={{ value: current, setValue: setCurrent, baseId }}>
      <div data-slot="tabs" className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function TabsList({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="tablist"
      data-slot="tabs-list"
      className={cn("flex w-full items-center gap-6 border-b border-line", className)}
      {...props}
    />
  );
}

function TabsTrigger({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<"button"> & { value: string }) {
  const { value: current, setValue, baseId } = useTabs();
  const active = current === value;
  const triggerId = `${baseId}-tab-${value}`;

  function onKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    const list = event.currentTarget.parentElement;

    if (!list) return;

    const tabs = Array.from(list.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'));
    const index = tabs.indexOf(event.currentTarget);

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = tabs[(index + direction + tabs.length) % tabs.length];
      next?.focus();
      next?.click();
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      const next = event.key === "Home" ? tabs[0] : tabs.at(-1);
      next?.focus();
      next?.click();
    }
  }

  return (
    <button
      id={triggerId}
      type="button"
      role="tab"
      aria-selected={active}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={active ? 0 : -1}
      data-active={active || undefined}
      onClick={() => setValue(value)}
      onKeyDown={onKeyDown}
      className={cn(
        "relative -mb-px h-11 whitespace-nowrap border-b-2 border-transparent text-body-sm font-medium text-ink-muted outline-none transition-colors hover:text-ink focus-visible:ring-2 focus-visible:ring-accent aria-selected:border-accent aria-selected:text-ink",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function TabsContent({
  className,
  value,
  children,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const { value: current, baseId } = useTabs();
  const active = current === value;

  if (!active) {
    return null;
  }

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      data-slot="tabs-content"
      className={cn("mt-6 outline-none focus-visible:ring-2 focus-visible:ring-accent", className)}
      {...props}
    >
      {children}
    </div>
  );
}

/** @deprecated Use the active underline on TabsTrigger instead. */
function TabsIndicator() {
  return null;
}

export { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger };
