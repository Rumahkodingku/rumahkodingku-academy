import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ErrorState } from "../../../../src/components/ui/error-state";
import { ForbiddenState } from "../../../../src/components/ui/forbidden-state";

describe("Editorial state pages", () => {
  it("renders the error status and recovery copy", () => {
    render(<ErrorState code="500" title="Server tidak merespons" />);

    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Server tidak merespons" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders a fixed 403 for forbidden access", () => {
    render(<ForbiddenState />);

    expect(screen.getByText("403")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Akses ditolak" })).toBeInTheDocument();
  });
});
