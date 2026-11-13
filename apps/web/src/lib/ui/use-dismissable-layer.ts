"use client";

import { useEffect, useRef } from "react";

export function useDismissableLayer({
  open,
  onDismiss,
  refs,
}: {
  open: boolean;
  onDismiss: () => void;
  refs: Array<React.RefObject<HTMLElement | null>>;
}) {
  const onDismissRef = useRef(onDismiss);
  const refsRef = useRef(refs);
  onDismissRef.current = onDismiss;
  refsRef.current = refs;

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;

      if (target && refsRef.current.some((ref) => ref.current?.contains(target))) {
        return;
      }

      onDismissRef.current();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onDismissRef.current();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);
}
