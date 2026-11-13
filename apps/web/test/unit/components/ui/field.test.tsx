import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Field } from "../../../../src/components/ui/field";
import { Input } from "../../../../src/components/ui/input";

describe("Field", () => {
  it("associates a visible label with the control", () => {
    render(
      <Field.Root>
        <Field.Label>Email</Field.Label>
        <Field.Control render={<Input />} type="email" />
        <Field.Description>Gunakan email aktif.</Field.Description>
      </Field.Root>,
    );

    const input = screen.getByLabelText("Email");

    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAccessibleDescription("Gunakan email aktif.");
  });

  it("marks the control invalid and exposes the error text", () => {
    render(
      <Field.Root invalid>
        <Field.Label>Email</Field.Label>
        <Field.Control render={<Input />} type="email" />
        <Field.Error match>Email wajib diisi.</Field.Error>
      </Field.Root>,
    );

    const input = screen.getByLabelText("Email");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Email wajib diisi.");
  });
});
