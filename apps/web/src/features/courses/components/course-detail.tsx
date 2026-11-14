import type { Route } from "next";
import type { TFunction } from "i18next";

import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button-link";
import { Curriculum } from "@/features/courses/components/curriculum";
import { InstructorBlock } from "@/features/courses/components/instructor-block";
import { PricePanel } from "@/features/courses/components/price-panel";
import {
  courseCategoryLabels,
  courseDifficultyLabels,
  courseLanguageLabel,
} from "@/features/courses/labels";
import { formatDuration, lessonCount } from "@/features/courses/format";
import type { Course } from "@/features/courses/types";
import { localizedPath, type Locale } from "@/lib/i18n/routing";

export function CourseDetail({
  course,
  locale,
  t,
}: {
  course: Course;
  locale: Locale;
  t: TFunction;
}) {
  const lessons = lessonCount(course);

  return (
    <>
      <section className="border-b border-line pb-16 pt-10 md:pt-14">
        <Container className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="grid gap-5">
            <Link
              href={localizedPath(locale, "/courses") as Route}
              className="w-fit text-body-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              ← {t("courses.detail.back")}
            </Link>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-ink-muted">
              <span>
                {course.categories
                  .map((category) => courseCategoryLabels[category][locale])
                  .join(", ")}
              </span>
              <span aria-hidden="true">/</span>
              <span>{courseDifficultyLabels[course.difficulty][locale]}</span>
              <span aria-hidden="true">/</span>
              <span>{courseLanguageLabel(course.language)}</span>
            </div>

            <h1 className="max-w-[16ch] text-h1 text-ink">{course.title}</h1>
            <p className="max-w-[54ch] text-body-lg text-ink-muted">{course.shortDescription}</p>

            <div className="flex flex-wrap items-center gap-4 border-t border-line pt-4 text-body-sm text-ink-muted">
              <span>{course.instructor.name}</span>
              <span aria-hidden="true">/</span>
              <span>{formatDuration(course.estimatedDurationMinutes, course.language)}</span>
              <span aria-hidden="true">/</span>
              <span>{t("courses.detail.lessonsCount", { count: lessons })}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <ButtonLink href="#curriculum" variant="secondary" size="lg">
                {t("courses.detail.viewCurriculum")}
              </ButtonLink>
            </div>
          </div>

          <aside aria-label={t("courses.detail.curriculum")} className="hidden lg:block">
            <div className="border-t border-line pt-4">
              <div className="flex items-baseline justify-between gap-4">
                <p className="text-caption text-ink-muted">{t("courses.detail.curriculum")}</p>
                <p className="text-caption text-ink-muted">
                  {t("courses.detail.curriculumMeta", {
                    sections: course.sections.length,
                    lessons,
                  })}
                </p>
              </div>
              <ol className="mt-4 border-t border-line">
                {course.sections.map((section, index) => (
                  <li
                    key={section.id}
                    className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-baseline gap-3 border-b border-line py-3"
                  >
                    <span className="font-mono text-caption text-ink-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-body-sm text-ink">{section.title}</span>
                    <span className="text-caption text-ink-muted">
                      {t("courses.detail.lessonsCount", { count: section.lessons.length })}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-10">
          <section className="grid gap-4">
            <h2 className="text-h2 text-ink">{t("courses.detail.about")}</h2>
            <p className="max-w-[62ch] text-body text-ink-muted">{course.description}</p>
          </section>

          <section className="grid gap-5 border-t border-line pt-8">
            <h2 className="text-h2 text-ink">{t("courses.detail.outcomes")}</h2>
            <ul className="grid gap-3">
              {course.learningOutcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3 text-body text-ink">
                  <span
                    aria-hidden="true"
                    className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent"
                  />
                  <span className="max-w-[62ch]">{outcome}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="grid gap-5 border-t border-line pt-8">
            <h2 className="text-h2 text-ink">{t("courses.detail.prerequisites")}</h2>
            <ul className="grid gap-3">
              {course.prerequisites.map((prerequisite) => (
                <li
                  key={prerequisite}
                  className="max-w-[62ch] border-b border-line pb-3 text-body-sm text-ink-muted"
                >
                  {prerequisite}
                </li>
              ))}
            </ul>
          </section>

          <Curriculum course={course} t={t} />
          <InstructorBlock instructor={course.instructor} t={t} />

          <section className="grid gap-5 border-t border-line pt-8">
            <h2 className="text-h2 text-ink">{t("courses.detail.conditions")}</h2>
            <dl className="grid gap-0 border-y border-line">
              <div className="flex items-start justify-between gap-4 border-b border-line py-4 text-body-sm">
                <dt className="text-ink-muted">{t("courses.detail.finalProject")}</dt>
                <dd className="max-w-[34ch] text-right text-ink">
                  {course.finalProjectEnabled
                    ? t("courses.detail.finalProjectEnabled")
                    : t("courses.detail.notIncluded")}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 border-b border-line py-4 text-body-sm">
                <dt className="text-ink-muted">{t("courses.detail.certificate")}</dt>
                <dd className="max-w-[34ch] text-right text-ink">
                  {course.certificateEnabled
                    ? t("courses.detail.certificateEnabled")
                    : t("courses.detail.notIncluded")}
                </dd>
              </div>
              <div className="flex items-start justify-between gap-4 py-4 text-body-sm">
                <dt className="text-ink-muted">{t("courses.detail.lifetime")}</dt>
                <dd className="max-w-[34ch] text-right text-ink">{t("courses.detail.access")}</dd>
              </div>
            </dl>
          </section>
        </div>

        <aside className="order-first grid content-start gap-4 lg:order-none lg:sticky lg:top-28">
          <PricePanel course={course} t={t} />
          {course.sections.some((section) => section.lessons.some((lesson) => lesson.preview)) ? (
            <p className="text-caption text-ink-muted">{t("courses.detail.previewUnavailable")}</p>
          ) : null}
        </aside>
      </Container>
    </>
  );
}
