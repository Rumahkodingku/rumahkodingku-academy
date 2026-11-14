import type { TFunction } from "i18next";

import { Button } from "@/components/ui/button";
import { formatCoursePrice } from "@/features/courses/format";
import type { Course } from "@/features/courses/types";

export function PricePanel({ course, t }: { course: Course; t: TFunction }) {
  const price = course.discountPrice ?? course.price;

  return (
    <div className="grid gap-5 bg-deep p-6 text-deep-foreground">
      <p className="text-body-sm text-deep-muted">{t("courses.detail.priceLabel")}</p>
      <p className="text-h2 text-deep-foreground">
        {formatCoursePrice(price, course.language, t("courses.free"))}
      </p>
      <p className="border-t border-deep-muted/30 pt-4 text-body-sm text-deep-muted">
        {t("courses.detail.access")}
      </p>
      <Button disabled className="w-full bg-canvas text-ink hover:bg-canvas/90">
        {t("courses.detail.cta")}
      </Button>
      <p className="text-caption text-deep-muted">{t("courses.detail.checkoutSoon")}</p>
    </div>
  );
}
