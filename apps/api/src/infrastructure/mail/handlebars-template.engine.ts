import { readFile } from "node:fs/promises";
import { join } from "node:path";

import {
  MailTemplateEngine,
  type MailTemplateOutput,
  type MailTemplateRenderOptions,
} from "@nestjs/mail";
import Handlebars from "handlebars";

type HandlebarsTemplateEngineOptions = {
  dir: string;
};

export class HandlebarsTemplateEngine extends MailTemplateEngine {
  private readonly dir: string;
  private readonly cache = new Map<string, HandlebarsTemplateDelegate>();

  constructor(options: HandlebarsTemplateEngineOptions) {
    super();
    this.dir = options.dir;
  }

  async render(
    name: string,
    context: object,
    _options: MailTemplateRenderOptions,
  ): Promise<MailTemplateOutput> {
    let template = this.cache.get(name);

    if (!template) {
      const source = await readFile(join(this.dir, `${name}.hbs`), "utf8");
      template = Handlebars.compile(source);
      this.cache.set(name, template);
    }

    return { html: template(context) };
  }
}
