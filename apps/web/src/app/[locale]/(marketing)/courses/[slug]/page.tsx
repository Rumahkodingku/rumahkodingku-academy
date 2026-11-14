import type { Metadata } from "next";

import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { CourseCard } from "@/features/courses/components/course-card";
import { CourseDetail } from "@/features/courses/components/course-detail";
import { courseBySlug, publishedCourses } from "@/features/courses/catalog";
import { courseFixtures } from "@/features/courses/fixtures";
import { getServerI18n } from "@/lib/i18n/server";
import { isLocale } from "@/lib/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    return {};
  }

  const course = courseBySlug(courseFixtures[locale], slug);

  if (!course) {
    return {};
  }

  return {
    title: course.title,
    description: course.shortDescription,
    openGraph: {
      title: course.title,
      description: course.shortDescription,
      type: "article",
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const course = courseBySlug(courseFixtures[locale], slug);

  if (!course) {
    notFound();
  }

  const i18n = await getServerI18n(locale);
  const related = publishedCourses(courseFixtures[locale])
    .filter(
      (candidate) =>
        candidate.slug !== course.slug &&
        candidate.categories.some((category) => course.categories.includes(category)),
    )
    .slice(0, 3);

  return (
    <>
      <CourseDetail course={course} locale={locale} t={i18n.t} />

      {related.length > 0 ? (
        <section className="border-t border-line py-16 md:py-20">
          <Container className="grid gap-6">
            <h2 className="text-h2 text-ink">{i18n.t("courses.detail.related")}</h2>
            <div>
              {related.map((relatedCourse) => (
                <CourseCard key={relatedCourse.id} course={relatedCourse} locale={locale} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
