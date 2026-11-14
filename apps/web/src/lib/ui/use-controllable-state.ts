"use client";

import { useCallback, useRef, useState } from "react";

type Updater<T> = T | ((previous: T) => T);

export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: Updater<T>) => void] {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internalValue;
  const currentRef = useRef(current);
  currentRef.current = current;

  const setValue = useCallback(
    (next: Updater<T>) => {
      const resolved =
        typeof next === "function" ? (next as (previous: T) => T)(currentRef.current) : next;

      currentRef.current = resolved;

      if (!controlled) {
        setInternalValue(resolved);
      }

      onChange?.(resolved);
    },
    [controlled, onChange],
  );

  return [current, setValue];
}
