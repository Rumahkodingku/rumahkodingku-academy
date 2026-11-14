import { describe, expect, it } from "vitest";

import {
  catalogHref,
  courseBySlug,
  featuredCourses,
  filterCourses,
  paginateCourses,
  parseCatalogFilters,
  publishedCourses,
  sortCourses,
} from "../../../../src/features/courses/catalog";
import { courseFixtures } from "../../../../src/features/courses/fixtures";
import { DEFAULT_CATALOG_FILTERS } from "../../../../src/features/courses/types";

const courses = courseFixtures.id;

describe("catalog", () => {
  it("returns published courses only", () => {
    expect(publishedCourses(courses).every((course) => course.status === "PUBLISHED")).toBe(true);
    expect(
      publishedCourses(courses).some((course) => course.slug === "ai-assisted-development"),
    ).toBe(false);
  });

  it("finds a course by slug and rejects drafts", () => {
    expect(courseBySlug(courses, "nextjs-app-router")?.title).toContain("Next.js");
    expect(courseBySlug(courses, "ai-assisted-development")).toBeNull();
    expect(courseBySlug(courses, "devops-foundations")).toBeNull();
    expect(courseBySlug(courses, "missing")).toBeNull();
  });

  it("filters by search, category, difficulty, language, and price", () => {
    expect(
      filterCourses(courses, {
        ...DEFAULT_CATALOG_FILTERS,
        query: "next.js",
      }).map((course) => course.slug),
    ).toContain("nextjs-app-router");

    expect(
      filterCourses(courses, {
        ...DEFAULT_CATALOG_FILTERS,
        category: "backend",
      }).every((course) => course.categories.includes("backend")),
    ).toBe(true);

    expect(
      filterCourses(courses, {
        ...DEFAULT_CATALOG_FILTERS,
        difficulty: "ADVANCED",
      }).every((course) => course.difficulty === "ADVANCED"),
    ).toBe(true);

    expect(
      filterCourses(courses, {
        ...DEFAULT_CATALOG_FILTERS,
        language: "en",
      }).every((course) => course.language === "en"),
    ).toBe(true);

    expect(
      filterCourses(courses, {
        ...DEFAULT_CATALOG_FILTERS,
        price: "free",
      }).every((course) => course.price === 0),
    ).toBe(true);
  });

  it("sorts featured, newest, and title", () => {
    const featured = sortCourses(publishedCourses(courses), "featured");
    expect(featured[0]?.featured).toBe(true);

    const newest = sortCourses(publishedCourses(courses), "newest");
    expect(Date.parse(newest[0]?.publishedAt ?? "")).toBeGreaterThanOrEqual(
      Date.parse(newest[1]?.publishedAt ?? ""),
    );

    const title = sortCourses(publishedCourses(courses), "title");
    expect(title[0]?.title.localeCompare(title[1]?.title ?? "")).toBeLessThanOrEqual(0);
  });

  it("paginates and clamps invalid pages", () => {
    const first = paginateCourses(publishedCourses(courses), 1);
    expect(first.items).toHaveLength(6);
    expect(first.page).toBe(1);
    expect(first.pageCount).toBeGreaterThan(1);

    const last = paginateCourses(publishedCourses(courses), 999);
    expect(last.page).toBe(last.pageCount);
    expect(paginateCourses(publishedCourses(courses), 0).page).toBe(1);
  });

  it("returns featured courses with a limit", () => {
    expect(featuredCourses(courses)).toHaveLength(1);
    expect(featuredCourses(courses, 1)).toHaveLength(1);
  });

  it("parses catalog query params safely", () => {
    const parsed = parseCatalogFilters(
      new URLSearchParams(
        "q=react&category=frontend&difficulty=INTERMEDIATE&language=id&price=paid&sort=newest&page=2",
      ),
    );

    expect(parsed).toMatchObject({
      query: "react",
      category: "frontend",
      difficulty: "INTERMEDIATE",
      language: "id",
      price: "paid",
      sort: "newest",
      page: 2,
    });

    expect(parseCatalogFilters(new URLSearchParams("category=unknown&page=-1"))).toMatchObject({
      category: "all",
      page: 1,
    });
  });

  it("builds a shareable catalog href", () => {
    expect(
      catalogHref("id", DEFAULT_CATALOG_FILTERS, {
        query: "nextjs",
        category: "frontend",
        sort: "newest",
      }),
    ).toBe("/courses?q=nextjs&category=frontend&sort=newest");

    expect(catalogHref("en", DEFAULT_CATALOG_FILTERS)).toBe("/en/courses");
  });
});
