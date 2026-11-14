import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Skeleton } from "../../../../src/components/ui/skeleton";

describe("Skeleton", () => {
  it("is hidden from assistive technology by default", () => {
    const { container } = render(<Skeleton data-testid="skeleton" />);

    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("can announce a labelled loading region", () => {
    render(<Skeleton aria-label="Memuat profil" aria-hidden={undefined} />);

    expect(screen.getByLabelText("Memuat profil")).toBeInTheDocument();
  });
});
