import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { BrandLogo } from "./brand-logo";

describe("BrandLogo", () => {
  it("renders the official mark without recoloring it", () => {
    render(<BrandLogo />);

    const mark = screen.getByRole("presentation");

    expect(mark).toHaveAttribute("src", expect.stringContaining("rumahkodingku-mark.png"));
    expect(mark.className).not.toMatch(/invert|filter/);
    expect(screen.getByText("RumahKodingku")).toBeInTheDocument();
    expect(screen.getByText("Academy")).toBeInTheDocument();
  });

  it("can render without the wordmark", () => {
    render(<BrandLogo showProductName={false} />);

    expect(screen.queryByText("RumahKodingku")).not.toBeInTheDocument();
  });
});
