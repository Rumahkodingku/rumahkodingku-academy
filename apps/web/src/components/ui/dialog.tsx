"use client";

import type { ComponentProps } from "react";

import { X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from "react";

import { Button } from "./button";
import { cn } from "@/lib/utils";

type DialogContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  titleId: string;
  descriptionId: string;
  contentRef: React.RefObject<HTMLDialogElement | null>;
};

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialogContext() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("Dialog components must be used inside <Dialog>.");
  }

  return context;
}

function Dialog({
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
  const [open, setOpenState] = useState(controlledOpen ?? defaultOpen);
  const currentOpen = controlledOpen ?? open;
  const previousFocus = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const contentRef = useRef<HTMLDialogElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      if (next && !currentOpen) {
        previousFocus.current = document.activeElement as HTMLElement | null;
      }

      if (controlledOpen === undefined) {
        setOpenState(next);
      }

      onOpenChange?.(next);
    },
    [controlledOpen, currentOpen, onOpenChange],
  );

  useEffect(() => {
    if (!currentOpen) {
      previousFocus.current?.focus();
    }
  }, [currentOpen]);

  return (
    <DialogContext.Provider
      value={{ open: currentOpen, setOpen, titleId, descriptionId, contentRef }}
    >
      {children}
    </DialogContext.Provider>
  );
}

function DialogTrigger({ children, onClick, ...props }: ComponentProps<typeof Button>) {
  const { open, setOpen } = useDialogContext();

  return (
    <Button
      {...props}
      aria-haspopup="dialog"
      aria-expanded={open}
      onClick={(event) => {
        onClick?.(event);
        setOpen(!open);
      }}
    >
      {children}
    </Button>
  );
}

type DialogContentProps = ComponentProps<"dialog"> & {
  closeLabel?: string;
  dismissible?: boolean;
  role?: "dialog" | "alertdialog";
  size?: "sm" | "md" | "lg" | "full";
  variant?: "center" | "sheet";
};

function DialogContent({
  className,
  children,
  closeLabel = "Tutup",
  dismissible = true,
  role = "dialog",
  size = "md",
  variant = "center",
  ...props
}: DialogContentProps) {
  const { open, setOpen, titleId, descriptionId, contentRef } = useDialogContext();

  useEffect(() => {
    const dialog = contentRef.current;

    if (!dialog) {
      return;
    }

    if (open && !dialog.open) {
      dialog.showModal();
    }

    if (!open && dialog.open) {
      dialog.close();
    }
  }, [contentRef, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && dismissible) {
        event.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [dismissible, open, setOpen]);

  if (!open) {
    return null;
  }

  return (
    <dialog
      ref={contentRef}
      role={role}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();

        if (dismissible) {
          setOpen(false);
        }
      }}
      onClick={(event) => {
        if (dismissible && event.target === event.currentTarget) {
          setOpen(false);
        }
      }}
      className={cn(
        "m-auto w-[calc(100%-2rem)] border border-line bg-surface p-0 text-ink shadow-3 outline-none",
        size === "sm" && "max-w-sm",
        size === "md" && "max-w-lg",
        size === "lg" && "max-w-2xl",
        size === "full" && "h-[calc(100%-2rem)] max-w-none",
        variant === "sheet" && "h-[calc(100%-1rem)] max-w-none rounded-none",
        className,
      )}
      {...props}
    >
      <div className={cn("relative p-6", variant === "sheet" && "h-full overflow-y-auto")}>
        {children}
        <button
          type="button"
          aria-label={closeLabel}
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-full p-2 text-ink-muted transition-colors hover:bg-surface-sunken hover:text-ink focus-visible:ring-2 focus-visible:ring-accent"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    </dialog>
  );
}

function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("grid gap-2 pr-8 text-left", className)} {...props} />;
}

function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-8 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function DialogTitle({ className, ...props }: React.ComponentProps<"h2">) {
  const { titleId } = useDialogContext();

  return <h2 id={titleId} className={cn("text-h3 text-ink", className)} {...props} />;
}

function DialogDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { descriptionId } = useDialogContext();

  return (
    <p id={descriptionId} className={cn("text-body-sm text-ink-muted", className)} {...props} />
  );
}

function DialogClose({ children, onClick, ...props }: ComponentProps<typeof Button>) {
  const { setOpen } = useDialogContext();

  return (
    <Button
      variant="secondary"
      {...props}
      onClick={(event) => {
        onClick?.(event);
        setOpen(false);
      }}
    >
      {children}
    </Button>
  );
}

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
};
