import { Container } from "@/components/layout/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function LocaleLoading() {
  return (
    <div className="border-b border-border bg-gradient-to-b from-accent/60 to-background">
      <Container className="grid gap-12 py-20 md:py-28 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="grid gap-5">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-14 w-full max-w-2xl" />
          <Skeleton className="h-14 w-4/5 max-w-xl" />
          <Skeleton className="h-5 w-full max-w-xl" />
          <Skeleton className="h-5 w-3/4 max-w-md" />
          <div className="flex gap-3 pt-2">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
        <Skeleton className="h-80 rounded-2xl" />
      </Container>
    </div>
  );
}
