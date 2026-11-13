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
  tone?: "default" | "inverse";
};

export function BrandLogo({
  className,
  size = "md",
  showProductName = true,
  tone = "default",
}: BrandLogoProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-2.5", className)}
      role={showProductName ? undefined : "img"}
      aria-label={showProductName ? undefined : "RumahKodingku"}
    >
      {/* The official mark is blue on transparency; keep it on a white surface in both themes. */}
      <span className="inline-flex shrink-0 items-center justify-center rounded-md bg-white p-1">
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
          <span
            className={cn(
              "text-title tracking-tight",
              tone === "inverse" ? "text-deep-foreground" : "text-ink",
            )}
          >
            RumahKodingku
          </span>
          <span
            className={cn(
              "mt-1 text-caption uppercase tracking-[0.18em]",
              tone === "inverse" ? "text-deep-muted" : "text-ink-muted",
            )}
          >
            Academy
          </span>
        </span>
      ) : null}
    </span>
  );
}
