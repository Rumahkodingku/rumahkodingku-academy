import { describe, expect, it } from "vitest";

import { getMarketingHomepage } from "../../../src/marketing/content";
import { homepageFixtures } from "../../../src/marketing/fixtures";
import type { HomepageContent } from "../../../src/marketing/content-types";

describe("marketing content", () => {
  it("serves local homepage content for both locales", () => {
    expect(getMarketingHomepage("id")).toEqual(homepageFixtures.id);
    expect(getMarketingHomepage("en")).toEqual(homepageFixtures.en);
  });

  it("carries the editorial sections in both locales", () => {
    expect(homepageFixtures.id.statement?.title).toBeTruthy();
    expect(homepageFixtures.en.statement?.body).toBeTruthy();
    expect(homepageFixtures.id.proof?.points.length).toBeGreaterThan(0);
    expect(homepageFixtures.en.cta?.primaryCta.href).toBe("/courses");
    expect(homepageFixtures.id.hero.note).toBeTruthy();
    expect(homepageFixtures.id.hero.artifact?.media.url).toBe(
      "/imagery/home/learning-workspace.jpg",
    );
    expect(homepageFixtures.id.hero.artifact?.media.alternativeText).toBeTruthy();
  });

  it("keeps the editorial fields optional for existing content", () => {
    const existing: HomepageContent = {
      hero: homepageFixtures.id.hero,
      features: homepageFixtures.id.features,
      steps: homepageFixtures.id.steps,
    };

    expect(existing.statement).toBeUndefined();
  });
});
