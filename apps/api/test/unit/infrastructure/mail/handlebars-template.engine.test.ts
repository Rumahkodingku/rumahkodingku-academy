import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { HandlebarsTemplateEngine } from "../../../../src/infrastructure/mail/handlebars-template.engine";

describe("HandlebarsTemplateEngine", () => {
  it("renders the welcome template from cwd/templates", async () => {
    const engine = new HandlebarsTemplateEngine({ dir: join(process.cwd(), "templates") });

    const output = await engine.render("welcome", { name: "Riot" }, {} as never);
    const html = typeof output === "string" ? output : output.html;

    expect(html).toContain("Riot");
    expect(html).toContain("Rumah Kodingku Academy");
  });
});
