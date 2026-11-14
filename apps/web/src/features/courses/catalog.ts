import { localizedPath } from "@/lib/i18n/routing";

import type { CatalogFilters, CatalogPage, Course, CourseLanguage } from "./types";
import { DEFAULT_CATALOG_FILTERS } from "./types";

export function publishedCourses(courses: Course[]): Course[] {
  return courses.filter((course) => course.status === "PUBLISHED");
}

export function featuredCourses(courses: Course[], limit = 3): Course[] {
  return publishedCourses(courses)
    .filter((course) => course.featured)
    .slice(0, limit);
}

export function courseBySlug(courses: Course[], slug: string): Course | null {
  return publishedCourses(courses).find((course) => course.slug === slug) ?? null;
}

export function filterCourses(courses: Course[], filters: CatalogFilters): Course[] {
  const query = normalizeSearch(filters.query);

  return publishedCourses(courses).filter((course) => {
    const matchesQuery =
      query.length === 0 ||
      normalizeSearch(course.title).includes(query) ||
      normalizeSearch(course.shortDescription).includes(query);

    const matchesCategory =
      filters.category === "all" || course.categories.includes(filters.category);
    const matchesDifficulty =
      filters.difficulty === "ALL" || course.difficulty === filters.difficulty;
    const matchesLanguage = filters.language === "ALL" || course.language === filters.language;
    const matchesPrice =
      filters.price === "all" || (filters.price === "free" ? course.price === 0 : course.price > 0);

    return matchesQuery && matchesCategory && matchesDifficulty && matchesLanguage && matchesPrice;
  });
}

export function sortCourses(courses: Course[], sort: CatalogFilters["sort"]): Course[] {
  return [...courses].sort((first, second) => {
    if (sort === "featured") {
      if (first.featured !== second.featured) {
        return first.featured ? -1 : 1;
      }

      return dateValue(second.publishedAt) - dateValue(first.publishedAt);
    }

    if (sort === "newest") {
      return dateValue(second.publishedAt) - dateValue(first.publishedAt);
    }

    return first.title.localeCompare(second.title);
  });
}

export function paginateCourses(
  courses: Course[],
  page: number,
  pageSize = DEFAULT_CATALOG_FILTERS.pageSize,
): CatalogPage {
  const safePageSize = Math.max(1, pageSize);
  const pageCount = Math.max(1, Math.ceil(courses.length / safePageSize));
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * safePageSize;

  return {
    items: courses.slice(start, start + safePageSize),
    page: safePage,
    pageCount,
    total: courses.length,
  };
}

export function parseCatalogFilters(searchParams: URLSearchParams): CatalogFilters {
  const category = searchParams.get("category");
  const difficulty = searchParams.get("difficulty");
  const language = searchParams.get("language");
  const price = searchParams.get("price");
  const sort = searchParams.get("sort");
  const page = Number.parseInt(searchParams.get("page") ?? "1", 10);

  return {
    query: searchParams.get("q") ?? "",
    category: isCategory(category) ? category : "all",
    difficulty:
      difficulty === "BEGINNER" || difficulty === "INTERMEDIATE" || difficulty === "ADVANCED"
        ? difficulty
        : "ALL",
    language: language === "id" || language === "en" ? language : "ALL",
    price: price === "free" || price === "paid" ? price : "all",
    sort: sort === "newest" || sort === "title" ? sort : "featured",
    page: Number.isNaN(page) || page < 1 ? 1 : page,
    pageSize: DEFAULT_CATALOG_FILTERS.pageSize,
  };
}

export function catalogHref(
  locale: CourseLanguage,
  filters: CatalogFilters,
  overrides: Partial<CatalogFilters> = {},
): string {
  const next = { ...filters, ...overrides };
  const params = new URLSearchParams();

  if (next.query) params.set("q", next.query);
  if (next.category !== "all") params.set("category", next.category);
  if (next.difficulty !== "ALL") params.set("difficulty", next.difficulty);
  if (next.language !== "ALL") params.set("language", next.language);
  if (next.price !== "all") params.set("price", next.price);
  if (next.sort !== "featured") params.set("sort", next.sort);
  if (next.page > 1) params.set("page", String(next.page));

  const base = localizedPath(locale, "/courses");
  const query = params.toString();

  return query ? `${base}?${query}` : base;
}

function normalizeSearch(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function dateValue(value: string | null | undefined): number {
  return value ? Date.parse(value) : 0;
}

function isCategory(value: string | null): value is CatalogFilters["category"] {
  return value === "frontend" || value === "backend" || value === "devops" || value === "data";
}
