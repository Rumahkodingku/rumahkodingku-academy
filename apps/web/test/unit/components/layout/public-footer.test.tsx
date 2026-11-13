import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) =>
      ({
        "footer.description": "Platform belajar teknologi.",
        "brand.tagline": "Learn · Build · Grow",
        "footer.navLabel": "Navigasi footer",
        "nav.home": "Beranda",
        "nav.program": "Program",
        "nav.howItWorks": "Cara belajar",
        "footer.rights": "© {{year}} RumahKodingku",
      })[key] ?? key,
  }),
}));

import { PublicFooter } from "../../../../src/components/layout/public-footer";

describe("PublicFooter", () => {
  it("uses the deep editorial footer surface", () => {
    render(<PublicFooter locale="id" />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("bg-deep");
    expect(footer).not.toHaveClass("bg-surface-subtle");
    expect(screen.getByText("Platform belajar teknologi.")).toBeInTheDocument();
  });
});
