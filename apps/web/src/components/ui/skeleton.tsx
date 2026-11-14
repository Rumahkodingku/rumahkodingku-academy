import { cn } from "@/lib/utils";

function Skeleton({
  className,
  "aria-label": ariaLabel,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
      className={cn(
        "animate-pulse rounded-md bg-surface-sunken motion-reduce:animate-none",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
