import type { CourseLanguage } from "./types";

export function formatPrice(price: number, language: CourseLanguage): string {
  return new Intl.NumberFormat(language === "id" ? "id-ID" : "en-US", {
    style: "currency",
    currency: "IDR",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: 0,
  })
    .format(price)
    .replace(/\s/g, "");
}

export function formatCoursePrice(
  price: number,
  language: CourseLanguage,
  freeLabel: string,
): string {
  return price === 0 ? freeLabel : formatPrice(price, language);
}

export function formatDuration(minutes: number, language: CourseLanguage): string {
  if (minutes < 60) {
    return language === "id" ? `${minutes} menit` : `${minutes} min`;
  }

  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;

  if (remainder === 0) {
    return language === "id" ? `${hours} jam` : `${hours} hr`;
  }

  return language === "id" ? `${hours} jam ${remainder} menit` : `${hours} hr ${remainder} min`;
}

export function lessonCount(course: { sections: { lessons: unknown[] }[] }): number {
  return course.sections.reduce((total, section) => total + section.lessons.length, 0);
}
