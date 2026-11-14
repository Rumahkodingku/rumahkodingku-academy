import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ButtonLink } from "../../../../src/components/ui/button-link";

describe("ButtonLink", () => {
  it("renders a link with the selected visual variant", () => {
    render(
      <ButtonLink href="/program" variant="secondary">
        Program
      </ButtonLink>,
    );

    const link = screen.getByRole("link", { name: "Program" });

    expect(link).toHaveAttribute("href", "/program");
    expect(link).toHaveClass("border-line-strong");
  });
});
