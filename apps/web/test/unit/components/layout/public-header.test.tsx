import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("next-themes", () => ({
  useTheme: () => ({ setTheme: vi.fn() }),
}));

const labels: Record<string, string> = {
  "nav.label": "Navigasi utama",
  "nav.home": "Beranda",
  "nav.program": "Program",
  "nav.howItWorks": "Cara belajar",
  "actions.openMenu": "Buka menu",
  "actions.closeMenu": "Tutup menu",
  "menu.title": "Menu",
  "menu.description": "Pilih halaman yang ingin dibuka.",
  "theme.label": "Tema",
  "theme.light": "Terang",
  "theme.dark": "Gelap",
  "theme.system": "Sistem",
  "language.label": "Bahasa",
  "language.id": "Indonesia",
  "language.en": "English",
};

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => labels[key] ?? key,
  }),
}));

import { PublicHeader } from "../../../../src/components/layout/public-header";

describe("PublicHeader", () => {
  it("shows the brand, navigation, and mobile menu", async () => {
    const user = userEvent.setup();

    render(<PublicHeader locale="id" user={null} />);

    expect(screen.getByRole("link", { name: "RumahKodingku Academy" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("navigation", { name: "Navigasi utama" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Buka menu" }));

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByRole("link", { name: "Program" })).toHaveAttribute(
      "href",
      "/#program",
    );
  });
});
