import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "../../../../src/components/ui/badge";

describe("Badge", () => {
  it("keeps the status readable as text", () => {
    render(<Badge tone="success">Approved</Badge>);

    const badge = screen.getByText("Approved");

    expect(badge).toHaveClass("text-success");
    expect(badge).toHaveClass("border-success/30");
  });

  it("supports the accent tone", () => {
    render(<Badge tone="accent">Baru</Badge>);

    expect(screen.getByText("Baru")).toHaveClass("text-accent-strong");
  });
});
