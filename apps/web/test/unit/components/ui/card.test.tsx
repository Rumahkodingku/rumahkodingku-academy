import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Card, CardContent, CardHeader, CardTitle } from "../../../../src/components/ui/card";

describe("Card", () => {
  it("uses a flat hairline surface instead of a shadowed template card", () => {
    render(
      <Card data-testid="card">
        <CardHeader>
          <CardTitle>Status</CardTitle>
        </CardHeader>
        <CardContent>Aktif</CardContent>
      </Card>,
    );

    const card = screen.getByTestId("card");
    expect(card).toHaveClass("rounded-md");
    expect(card).toHaveClass("border-line");
    expect(card).not.toHaveClass("shadow-1");
    expect(screen.getByText("Status")).toBeInTheDocument();
  });
});
