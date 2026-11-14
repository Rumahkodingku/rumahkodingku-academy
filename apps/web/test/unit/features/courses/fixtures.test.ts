import { describe, expect, it } from "vitest";

import { courseFixtures } from "../../../../src/features/courses/fixtures";
import { publishedCourses } from "../../../../src/features/courses/catalog";

describe("course fixtures", () => {
  it("has the same published course set in both locales", () => {
    expect(courseFixtures.id).toHaveLength(12);
    expect(courseFixtures.en).toHaveLength(12);
    expect(courseFixtures.id.map((course) => course.slug)).toEqual(
      courseFixtures.en.map((course) => course.slug),
    );
  });

  it("keeps slugs unique and sections ordered", () => {
    const slugs = courseFixtures.id.map((course) => course.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const course of courseFixtures.id) {
      expect(course.sections.map((section) => section.position)).toEqual([0, 1, 2]);
      for (const section of course.sections) {
        expect(section.lessons.map((lesson) => lesson.position)).toEqual([0, 1, 2, 3]);
      }
    }
  });

  it("has one featured, one free, one draft, and one archived course", () => {
    expect(courseFixtures.id.filter((course) => course.featured)).toHaveLength(1);
    expect(courseFixtures.id.filter((course) => course.price === 0)).toHaveLength(1);
    expect(courseFixtures.id.filter((course) => course.status === "DRAFT")).toHaveLength(1);
    expect(courseFixtures.id.filter((course) => course.status === "ARCHIVED")).toHaveLength(1);
  });

  it("gives every published course a published date and full curriculum", () => {
    for (const course of publishedCourses(courseFixtures.id)) {
      expect(course.publishedAt).toBeTruthy();
      expect(course.learningOutcomes.length).toBeGreaterThanOrEqual(4);
      expect(course.prerequisites.length).toBeGreaterThanOrEqual(2);
      expect(course.sections).toHaveLength(3);
      expect(course.sections.every((section) => section.lessons.length === 4)).toBe(true);
    }
  });

  it("does not contain ratings or testimonials in the public contract", () => {
    const serialized = JSON.stringify(courseFixtures.id);
    expect(serialized).not.toContain("testimonial");
    expect(serialized).not.toContain("rating");
  });
});
