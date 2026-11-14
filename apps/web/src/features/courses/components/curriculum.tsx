import type { TFunction } from "i18next";
import { PlayCircle } from "lucide-react";

import { formatDuration, lessonCount } from "@/features/courses/format";
import type { Course } from "@/features/courses/types";

export function Curriculum({ course, t }: { course: Course; t: TFunction }) {
  const lessons = lessonCount(course);

  return (
    <section id="curriculum" className="grid scroll-mt-24 gap-6 border-t border-line pt-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 className="text-h2 text-ink">{t("courses.detail.curriculum")}</h2>
        <p className="text-caption text-ink-muted">
          {t("courses.detail.curriculumMeta", {
            sections: course.sections.length,
            lessons,
          })}
        </p>
      </div>

      <div className="grid gap-8">
        {course.sections.map((section) => (
          <section
            key={section.id}
            className="grid gap-3 border-t border-line pt-5 first:border-t-0 first:pt-0"
          >
            <div className="grid gap-1">
              <h3 className="text-h4 text-ink">{section.title}</h3>
              {section.description ? (
                <p className="text-body-sm text-ink-muted">{section.description}</p>
              ) : null}
            </div>
            <ol className="grid gap-0">
              {section.lessons.map((lesson, index) => (
                <li
                  key={lesson.id}
                  className="grid grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-3 border-t border-line py-3"
                >
                  <span className="pt-0.5 font-mono text-caption text-ink-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="grid gap-1">
                    <p className="text-body-sm font-medium text-ink">{lesson.title}</p>
                    <div className="flex flex-wrap items-center gap-2 text-caption text-ink-muted">
                      <span>
                        {lesson.contentType === "YOUTUBE_VIDEO"
                          ? t("courses.detail.video")
                          : t("courses.detail.text")}
                      </span>
                      <span aria-hidden="true">/</span>
                      <span>{formatDuration(lesson.durationMinutes, course.language)}</span>
                      <span aria-hidden="true">/</span>
                      <span>
                        {lesson.required
                          ? t("courses.detail.required")
                          : t("courses.detail.optional")}
                      </span>
                    </div>
                  </div>
                  {lesson.preview ? (
                    <span className="inline-flex items-center gap-1 text-caption text-accent-strong">
                      <PlayCircle aria-hidden="true" className="size-4" />
                      {t("courses.detail.preview")}
                    </span>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </section>
  );
}
