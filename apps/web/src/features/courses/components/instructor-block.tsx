import type { TFunction } from "i18next";

import type { CourseInstructor } from "@/features/courses/types";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function InstructorBlock({ instructor, t }: { instructor: CourseInstructor; t: TFunction }) {
  return (
    <section className="grid gap-5 border-t border-line pt-8">
      <h2 className="text-h2 text-ink">{t("courses.detail.instructor")}</h2>
      <div className="flex max-w-[52ch] items-start gap-4">
        <span
          aria-hidden="true"
          className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent-soft text-title font-semibold text-accent-strong"
        >
          {initials(instructor.name)}
        </span>
        <div className="grid gap-2">
          <p className="text-title text-ink">{instructor.name}</p>
          {instructor.bio ? <p className="text-body-sm text-ink-muted">{instructor.bio}</p> : null}
        </div>
      </div>
    </section>
  );
}
