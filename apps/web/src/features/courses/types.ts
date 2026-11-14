export type CourseDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type CourseStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type CourseLanguage = "id" | "en";

export type CourseLessonType = "YOUTUBE_VIDEO" | "RICH_TEXT";

export type CourseCategory = "frontend" | "backend" | "devops" | "data";

export type CourseInstructor = {
  name: string;
  bio?: string | null;
  avatarKey?: string | null;
};

export type CourseLesson = {
  id: string;
  title: string;
  description?: string | null;
  contentType: CourseLessonType;
  videoReference?: string | null;
  richTextBody?: string | null;
  durationMinutes: number;
  required: boolean;
  preview: boolean;
  position: number;
  status: "DRAFT" | "PUBLISHED";
};

export type CourseSection = {
  id: string;
  title: string;
  description?: string | null;
  position: number;
  lessons: CourseLesson[];
};

export type Course = {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  difficulty: CourseDifficulty;
  language: CourseLanguage;
  estimatedDurationMinutes: number;
  learningOutcomes: string[];
  prerequisites: string[];
  instructor: CourseInstructor;
  price: number;
  discountPrice?: number | null;
  currency: "IDR";
  status: CourseStatus;
  featured: boolean;
  finalProjectEnabled: boolean;
  certificateEnabled: boolean;
  publishedAt?: string | null;
  sections: CourseSection[];
  categories: CourseCategory[];
};

export type CatalogFilters = {
  query: string;
  category: CourseCategory | "all";
  difficulty: CourseDifficulty | "ALL";
  language: CourseLanguage | "ALL";
  price: "all" | "free" | "paid";
  sort: "featured" | "newest" | "title";
  page: number;
  pageSize: number;
};

export type CatalogPage = {
  items: Course[];
  page: number;
  pageCount: number;
  total: number;
};

export const DEFAULT_CATALOG_FILTERS: CatalogFilters = {
  query: "",
  category: "all",
  difficulty: "ALL",
  language: "ALL",
  price: "all",
  sort: "featured",
  page: 1,
  pageSize: 6,
};
