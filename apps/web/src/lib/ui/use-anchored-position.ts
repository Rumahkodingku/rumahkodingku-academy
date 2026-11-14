"use client";

import { useCallback, useState } from "react";

import { useIsomorphicLayoutEffect } from "./use-isomorphic-layout-effect";

export type AnchoredSide = "top" | "bottom";
export type AnchoredAlign = "start" | "center" | "end";

type RectLike = {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
};

type PositionInput = {
  triggerRect: RectLike;
  contentRect: Pick<RectLike, "width" | "height">;
  viewport: { width: number; height: number };
  side: AnchoredSide;
  align: AnchoredAlign;
  offset: number;
};

export type AnchoredPosition = {
  top: number;
  left: number;
  placement: AnchoredSide;
};

export function computeAnchoredPosition({
  triggerRect,
  contentRect,
  viewport,
  side,
  align,
  offset,
}: PositionInput): AnchoredPosition {
  const spaceBelow = viewport.height - triggerRect.bottom;
  const spaceAbove = triggerRect.top;
  const preferredSpace = side === "bottom" ? spaceBelow : spaceAbove;
  const hasRoom = preferredSpace >= contentRect.height + offset;
  const placement = hasRoom ? side : side === "bottom" ? "top" : "bottom";

  const top =
    placement === "bottom"
      ? triggerRect.bottom + offset
      : triggerRect.top - contentRect.height - offset;

  const alignLeft =
    align === "start"
      ? triggerRect.left
      : align === "center"
        ? triggerRect.left + (triggerRect.width - contentRect.width) / 2
        : triggerRect.right - contentRect.width;

  const maxLeft = Math.max(8, viewport.width - contentRect.width - 8);
  const left = Math.min(Math.max(alignLeft, 8), maxLeft);

  return {
    top: Math.max(8, top),
    left,
    placement,
  };
}

export function useAnchoredPosition({
  open,
  triggerRef,
  contentRef,
  side = "bottom",
  align = "start",
  offset = 6,
}: {
  open: boolean;
  triggerRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLElement | null>;
  side?: AnchoredSide;
  align?: AnchoredAlign;
  offset?: number;
}): { style: React.CSSProperties; placement: AnchoredSide } {
  const [position, setPosition] = useState<AnchoredPosition>(() => ({
    top: 0,
    left: 0,
    placement: side,
  }));
  const [measured, setMeasured] = useState(false);

  const update = useCallback(() => {
    const trigger = triggerRef.current;
    const content = contentRef.current;

    if (!trigger || !content) {
      return;
    }

    const next = computeAnchoredPosition({
      triggerRect: trigger.getBoundingClientRect(),
      contentRect: content.getBoundingClientRect(),
      viewport: { width: window.innerWidth, height: window.innerHeight },
      side,
      align,
      offset,
    });

    setPosition(next);
    setMeasured(true);
  }, [align, contentRef, offset, side, triggerRef]);

  useIsomorphicLayoutEffect(() => {
    if (!open) {
      setMeasured(false);
      return;
    }

    update();

    const onScroll = () => update();
    window.addEventListener("resize", onScroll);
    window.addEventListener("scroll", onScroll, true);

    return () => {
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, update]);

  return {
    style: {
      position: "fixed",
      top: position.top,
      left: position.left,
      visibility: measured ? "visible" : "hidden",
    },
    placement: position.placement,
  };
}
