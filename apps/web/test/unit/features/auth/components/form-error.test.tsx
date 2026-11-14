import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { FormError } from "../../../../../src/features/auth/components/form-error";
import { ApiProblemError } from "../../../../../src/lib/api/problem-details";

describe("FormError", () => {
  it("shows the Problem Details message", () => {
    render(
      <FormError
        error={
          new ApiProblemError(
            {
              type: "https://rumahkodingku.com/problems/auth-invalid-credentials",
              title: "Unauthorized",
              status: 401,
              detail: "Email atau password salah.",
            },
            401,
          )
        }
      />,
    );

    expect(screen.getByText("auth.errors.title")).toBeInTheDocument();
    expect(screen.getByText("Email atau password salah.")).toBeInTheDocument();
  });

  it("falls back to a generic message for unknown errors", () => {
    render(<FormError error={{ unexpected: true }} />);

    expect(screen.getByText("auth.errors.generic")).toBeInTheDocument();
  });

  it("renders nothing without an error", () => {
    const { container } = render(<FormError error={null} />);

    expect(container).toBeEmptyDOMElement();
  });
});
