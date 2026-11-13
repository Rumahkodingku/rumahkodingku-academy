import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../../../../src/components/ui/field";
import { Input } from "../../../../src/components/ui/input";

describe("Field", () => {
  it("associates a visible label with the control", () => {
    render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input type="email" />
        </FieldControl>
        <FieldDescription>Gunakan email aktif.</FieldDescription>
      </Field>,
    );

    const input = screen.getByLabelText("Email");

    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAccessibleDescription("Gunakan email aktif.");
  });

  it("marks the control invalid and exposes the error text", () => {
    render(
      <Field invalid>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <Input type="email" />
        </FieldControl>
        <FieldError>Email wajib diisi.</FieldError>
      </Field>,
    );

    const input = screen.getByLabelText("Email");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Email wajib diisi.");
    expect(screen.getByRole("alert")).toHaveTextContent("Email wajib diisi.");
  });
});
