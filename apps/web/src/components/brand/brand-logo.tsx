import Image from "next/image";

import { cn } from "@/lib/utils";

const markSizes = {
  sm: "size-7",
  md: "size-9",
  lg: "size-11",
} as const;

export type BrandLogoProps = {
  className?: string;
  size?: keyof typeof markSizes;
  showProductName?: boolean;
};

export function BrandLogo({ className, size = "md", showProductName = true }: BrandLogoProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5", className)}
      role={showProductName ? undefined : "img"}
      aria-label={showProductName ? undefined : "RumahKodingku"}
    >
      {/* The official mark is blue on transparency; keep it on a white surface in both themes. */}
      <span className="inline-flex shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-1 ring-1 ring-border-default">
        <Image
          src="/brand/rumahkodingku-mark.png"
          alt=""
          width={1292}
          height={1218}
          className={cn("h-auto w-auto", markSizes[size])}
        />
      </span>
      {showProductName ? (
        <span className="flex flex-col leading-none">
          <span className="text-title tracking-tight text-foreground">RumahKodingku</span>
          <span className="mt-1 text-caption uppercase tracking-[0.18em] text-muted-foreground">
            Academy
          </span>
        </span>
      ) : null}
    </span>
  );
}
