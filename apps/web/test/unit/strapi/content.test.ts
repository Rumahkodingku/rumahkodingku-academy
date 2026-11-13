import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

const strapiMocks = vi.hoisted(() => ({
  strapiServerFetch: vi.fn(),
  strapiServerFetchSingle: vi.fn(),
}));

vi.mock("../../../src/strapi/lib/server-client", () => strapiMocks);

import { getHomepage, isMarketingCollection, isMarketingSingle } from "../../../src/strapi/content";
import { homepageFixtures } from "../../../src/strapi/fixtures";

describe("Strapi marketing boundary", () => {
  beforeEach(() => {
    strapiMocks.strapiServerFetch.mockReset();
    strapiMocks.strapiServerFetchSingle.mockReset();
  });

  it("accepts only marketing content types", () => {
    expect(isMarketingCollection("marketing-pages")).toBe(true);
    expect(isMarketingCollection("courses")).toBe(false);
    expect(isMarketingSingle("homepage")).toBe(true);
    expect(isMarketingSingle("orders")).toBe(false);
  });

  it("falls back to local fixtures outside production", async () => {
    strapiMocks.strapiServerFetchSingle.mockRejectedValueOnce(new Error("Strapi offline"));

    await expect(getHomepage("id")).resolves.toEqual(homepageFixtures.id);
  });
});
