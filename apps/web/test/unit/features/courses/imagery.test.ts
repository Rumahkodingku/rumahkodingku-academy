import { existsSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { courseFixtures } from "../../../../src/features/courses/fixtures";
import { categoryIllustrations } from "../../../../src/features/courses/imagery";

describe("course imagery", () => {
  it("maps every category to a local illustration", () => {
    for (const [category, source] of Object.entries(categoryIllustrations)) {
      expect(source.startsWith("/illustrations/categories/")).toBe(true);
      expect(source.endsWith(".svg")).toBe(true);
      expect(existsSync(join(process.cwd(), "public", source))).toBe(true);
      expect(category.length).toBeGreaterThan(0);
    }
  });

  it("ships the editorial images used by the public pages", () => {
    for (const source of [
      "/imagery/home/learning-workspace.jpg",
      "/imagery/auth/architecture.jpg",
    ]) {
      expect(existsSync(join(process.cwd(), "public", source))).toBe(true);
    }
  });

  it("covers every category used by the fixtures", () => {
    for (const course of courseFixtures.id) {
      for (const category of course.categories) {
        expect(categoryIllustrations[category]).toBeTruthy();
      }
    }
  });
});
