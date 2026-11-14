"use client";

import type { Route } from "next";

import Link from "next/link";
import { useTranslation } from "react-i18next";

import { CategoryIllustration } from "@/features/courses/components/category-illustration";
import {
  courseCategoryLabels,
  courseDifficultyLabels,
  courseLanguageLabel,
} from "@/features/courses/labels";
import { formatCoursePrice, formatDuration, lessonCount } from "@/features/courses/format";
import type { Course } from "@/features/courses/types";
import { localizedPath, type Locale } from "@/lib/i18n/routing";

export function CourseCard({ course, locale }: { course: Course; locale: Locale }) {
  const { t } = useTranslation();
  const price = course.discountPrice ?? course.price;
  const lessons = lessonCount(course);

  return (
    <Link
      href={localizedPath(locale, `/courses/${course.slug}`) as Route}
      className="group grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 border-b border-line py-6 transition-colors hover:border-ink/40 sm:grid-cols-[7rem_minmax(0,1fr)] md:grid-cols-[9rem_minmax(0,1fr)_auto] md:gap-6 md:py-7"
    >
      <CategoryIllustration
        category={course.categories[0]}
        className="aspect-[4/3] w-full self-start"
        sizes="(min-width: 768px) 144px, 88px"
      />

      <div className="grid min-w-0 gap-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-muted">
          <span>
            {course.categories.map((category) => courseCategoryLabels[category][locale]).join(", ")}
          </span>
          <span aria-hidden="true">/</span>
          <span>{courseDifficultyLabels[course.difficulty][locale]}</span>
          <span aria-hidden="true">/</span>
          <span>{courseLanguageLabel(course.language)}</span>
        </div>

        <h2 className="max-w-[22ch] text-h3 text-ink transition-colors group-hover:text-accent-strong">
          {course.title}
        </h2>
        <p className="max-w-[58ch] text-body-sm text-ink-muted">{course.shortDescription}</p>

        <div className="flex flex-wrap items-center gap-4 pt-1 text-caption text-ink-muted">
          <span>{t("courses.lessons", { count: lessons })}</span>
          <span>{formatDuration(course.estimatedDurationMinutes, course.language)}</span>
        </div>
      </div>

      <div className="col-start-2 flex items-end justify-between gap-4 md:col-start-3 md:row-start-1 md:min-w-32 md:flex-col md:items-end">
        <span className="text-title text-ink">
          {formatCoursePrice(price, course.language, t("courses.free"))}
        </span>
        <span className="text-body-sm font-medium text-accent-strong underline-offset-4 group-hover:underline">
          {t("courses.viewCourse")}
        </span>
      </div>
    </Link>
  );
}
