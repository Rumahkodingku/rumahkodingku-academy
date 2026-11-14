import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function LocaleLoading() {
  return (
    <div className="border-b border-line bg-canvas">
      <Container className="grid gap-12 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
        <div className="grid gap-6">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-20 w-full max-w-2xl md:h-28" />
          <Skeleton className="h-20 w-4/5 max-w-xl md:h-24" />
          <Skeleton className="h-5 w-full max-w-xl" />
          <Skeleton className="h-5 w-3/4 max-w-md" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-13 w-40" />
            <Skeleton className="h-13 w-32" />
          </div>
        </div>
        <Skeleton className="h-80 rounded-md border border-line" />
      </Container>
    </div>
  );
}
