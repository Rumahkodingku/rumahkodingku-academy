import Image from "next/image";

import { categoryIllustrations } from "@/features/courses/imagery";
import type { CourseCategory } from "@/features/courses/types";
import { cn } from "@/lib/utils";

export function CategoryIllustration({
  category,
  className,
  sizes,
}: {
  category: CourseCategory;
  className?: string;
  sizes: string;
}) {
  return (
    <div className={cn("relative overflow-hidden border border-line bg-surface-sunken", className)}>
      <Image
        src={categoryIllustrations[category]}
        alt=""
        fill
        sizes={sizes}
        className="object-contain"
        unoptimized
      />
    </div>
  );
}
