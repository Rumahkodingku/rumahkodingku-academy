import { expect, test } from "@playwright/test";

const widths = [390, 768, 1024, 1440];
const themes = ["light", "dark"] as const;
const routes = [
  { name: "home", path: "/" },
  { name: "login", path: "/login" },
  { name: "register", path: "/register" },
  { name: "forbidden", path: "/forbidden" },
];

test.describe("visual regression", () => {
  for (const route of routes) {
    for (const theme of themes) {
      for (const width of widths) {
        test(`${route.name} ${theme} ${width}`, async ({ page, browserName }) => {
          test.skip(browserName !== "chromium", "Chromium visual baseline only");

          await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
          await page.addInitScript((value) => localStorage.setItem("theme", value), theme);
          await page.goto(route.path, { waitUntil: "networkidle" });
          await page.evaluate(() => document.fonts.ready);
          await page.addStyleTag({ content: "nextjs-portal{display:none!important}" });

          if (route.path === "/") {
            await page.evaluate(async () => {
              for (let y = 0; y < document.body.scrollHeight; y += 600) {
                window.scrollTo(0, y);
                await new Promise((resolve) => requestAnimationFrame(resolve));
              }
              window.scrollTo(0, 0);
              await new Promise((resolve) => setTimeout(resolve, 800));
            });
          }

          await expect(page).toHaveScreenshot(`${route.name}-${theme}-${width}.png`, {
            fullPage: true,
          });
        });
      }
    }
  }
});
