import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button } from "./button";
import { EmptyState } from "./empty-state";

describe("EmptyState", () => {
  it("explains what is empty and offers a next action", () => {
    render(
      <EmptyState
        title="Belum ada kursus"
        description="Kursus yang Anda beli akan muncul di sini."
        action={<Button>Jelajahi katalog</Button>}
      />,
    );

    expect(screen.getByRole("heading", { name: "Belum ada kursus" })).toBeInTheDocument();
    expect(screen.getByText("Kursus yang Anda beli akan muncul di sini.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Jelajahi katalog" })).toBeInTheDocument();
  });
});
