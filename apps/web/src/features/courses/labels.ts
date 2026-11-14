import type { CourseCategory, CourseDifficulty, CourseLanguage } from "./types";

type Localized<T> = Record<CourseLanguage, T>;

export const courseCategoryLabels: Record<CourseCategory, Localized<string>> = {
  frontend: { id: "Frontend", en: "Frontend" },
  backend: { id: "Backend", en: "Backend" },
  devops: { id: "DevOps", en: "DevOps" },
  data: { id: "Data", en: "Data" },
};

export const courseDifficultyLabels: Record<CourseDifficulty, Localized<string>> = {
  BEGINNER: { id: "Pemula", en: "Beginner" },
  INTERMEDIATE: { id: "Menengah", en: "Intermediate" },
  ADVANCED: { id: "Mahir", en: "Advanced" },
};

export function courseLanguageLabel(language: CourseLanguage): string {
  return language === "id" ? "Indonesia" : "English";
}
