"use client";

import { useCallback, useEffect, useRef } from "react";

export function useTypeahead<T>({
  items,
  getLabel,
  timeout = 500,
}: {
  items: readonly T[];
  getLabel: (item: T) => string;
  timeout?: number;
}): (key: string, currentIndex?: number) => number | null {
  const buffer = useRef("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, []);

  return useCallback(
    (key: string, currentIndex = -1) => {
      if (key.length !== 1) {
        return null;
      }

      if (timer.current) {
        clearTimeout(timer.current);
      }

      const nextBuffer = `${buffer.current}${key.toLowerCase()}`;
      const labels = items.map((item) => getLabel(item).toLowerCase());
      const repeated = nextBuffer.split("").every((character) => character === nextBuffer[0]);
      let matches = labels
        .map((label, index) => (label.startsWith(nextBuffer) ? index : -1))
        .filter((index) => index >= 0);

      if (repeated && matches.length === 0) {
        matches = labels
          .map((label, index) => (label.startsWith(nextBuffer[0] ?? "") ? index : -1))
          .filter((index) => index >= 0);
      }

      if (matches.length === 0) {
        buffer.current = "";
        return null;
      }

      const match =
        repeated && matches.length > 1
          ? (matches.find((index) => index > currentIndex) ?? matches[0])
          : matches[0];

      buffer.current = nextBuffer;
      timer.current = setTimeout(() => {
        buffer.current = "";
      }, timeout);

      return match ?? null;
    },
    [getLabel, items, timeout],
  );
}
