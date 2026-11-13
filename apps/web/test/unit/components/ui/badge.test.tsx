import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge } from "../../../../src/components/ui/badge";

describe("Badge", () => {
  it("keeps the status readable as text", () => {
    render(<Badge variant="success">Approved</Badge>);

    const badge = screen.getByText("Approved");

    expect(badge).toHaveClass("bg-status-success/10");
    expect(badge).toHaveClass("text-status-success");
  });
});
