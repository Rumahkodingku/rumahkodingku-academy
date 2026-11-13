"use client";

import type { Route } from "next";
import type { ComponentProps } from "react";

import Link from "next/link";
import { createPortal } from "react-dom";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { buttonVariants } from "./button";
import { useAnchoredPosition } from "@/lib/ui/use-anchored-position";
import { useDismissableLayer } from "@/lib/ui/use-dismissable-layer";
import { useTypeahead } from "@/lib/ui/use-typeahead";
import { cn } from "@/lib/utils";

const supportsPopover =
  typeof window !== "undefined" && typeof HTMLElement.prototype.showPopover === "function";

type MenuContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
};

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext() {
  const context = useContext(MenuContext);

  if (!context) {
    throw new Error("Menu components must be used inside <Menu>.");
  }

  return context;
}

function Menu({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  children,
}: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const open = controlledOpen ?? uncontrolledOpen;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (next) {
        previousFocus.current = document.activeElement as HTMLElement | null;
      }

      if (controlledOpen === undefined) {
        setUncontrolledOpen(next);
      }

      onOpenChange?.(next);
    },
    [controlledOpen, onOpenChange],
  );

  useDismissableLayer({
    open,
    onDismiss: () => setOpen(false),
    refs: [triggerRef, contentRef],
  });

  useEffect(() => {
    if (!open) {
      previousFocus.current?.focus();
    }
  }, [open]);

  return (
    <MenuContext.Provider value={{ open, setOpen, triggerRef, contentRef }}>
      {children}
    </MenuContext.Provider>
  );
}

type MenuTriggerProps = ComponentProps<"button"> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg" | "icon" | "icon-sm";
};

function MenuTrigger({
  className,
  variant = "ghost",
  size = "icon",
  children,
  onClick,
  ...props
}: MenuTriggerProps) {
  const { open, setOpen, triggerRef } = useMenuContext();

  return (
    <button
      {...props}
      ref={triggerRef}
      type="button"
      aria-haspopup="menu"
      aria-expanded={open}
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={(event) => {
        onClick?.(event);
        setOpen(!open);
      }}
    >
      {children}
    </button>
  );
}

function MenuContent({
  className,
  align = "start",
  side = "bottom",
  offset = 8,
  children,
  ...props
}: ComponentProps<"div"> & {
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  offset?: number;
}) {
  const { open, contentRef } = useMenuContext();
  const { triggerRef } = useMenuContext();
  const { style, placement } = useAnchoredPosition({
    open,
    triggerRef,
    contentRef,
    align,
    side,
    offset,
  });
  const items = useMemo(() => [] as HTMLElement[], [open]);
  const typeahead = useTypeahead({
    items,
    getLabel: (item) => item.textContent ?? "",
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const content = contentRef.current;
    content?.showPopover?.();
    const firstItem = content?.querySelector<HTMLElement>('[role="menuitem"]:not([disabled])');
    firstItem?.focus();

    return () => {
      content?.hidePopover?.();
    };
  }, [contentRef, open]);

  useEffect(() => {
    const content = contentRef.current;

    if (!content) {
      return;
    }

    items.length = 0;
    items.push(...content.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'));
  }, [contentRef, items, open]);

  if (!open || !mounted) {
    return null;
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const content = contentRef.current;

    if (!content) {
      return;
    }

    const allItems = Array.from(
      content.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'),
    );
    const currentIndex = allItems.indexOf(document.activeElement as HTMLElement);

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const next = allItems[(currentIndex + direction + allItems.length) % allItems.length];
      next?.focus();
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      (event.key === "Home" ? allItems[0] : allItems.at(-1))?.focus();
      return;
    }

    if (event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      const matched = typeahead(event.key, currentIndex);
      if (matched !== null) {
        allItems[matched]?.focus();
      }
    }
  }

  return createPortal(
    <div
      ref={contentRef}
      role="menu"
      popover={supportsPopover ? "manual" : undefined}
      data-placement={placement}
      style={style}
      onKeyDown={onKeyDown}
      className={cn(
        "z-50 min-w-48 overflow-hidden rounded-md border border-line bg-surface p-1 text-ink shadow-3 outline-none",
        className,
      )}
      {...props}
    >
      {children}
    </div>,
    document.body,
  );
}

function MenuItem({
  className,
  href,
  onSelect,
  disabled,
  variant = "default",
  children,
  ...props
}: Omit<ComponentProps<"button">, "onSelect"> & {
  href?: string;
  onSelect?: () => void;
  variant?: "default" | "danger";
}) {
  const { setOpen } = useMenuContext();
  const shared = {
    role: "menuitem" as const,
    "data-variant": variant,
    className: cn(
      "flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-left text-body-sm outline-none transition-colors hover:bg-surface-sunken focus:bg-surface-sunken disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
      variant === "danger" && "text-danger focus:bg-danger/10",
      className,
    ),
    onClick: () => {
      onSelect?.();
      setOpen(false);
    },
  };

  if (href) {
    return (
      <Link href={href as Route} {...shared}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" disabled={disabled} {...props} {...shared}>
      {children}
    </button>
  );
}

function MenuSeparator({ className, ...props }: ComponentProps<"div">) {
  return <div role="separator" className={cn("-mx-1 my-1 h-px bg-line", className)} {...props} />;
}

function MenuLabel({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("px-2.5 py-2 text-caption font-medium text-ink-muted", className)}
      {...props}
    />
  );
}

export { Menu, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger };
