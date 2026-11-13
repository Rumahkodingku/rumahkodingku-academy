import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

import { PasswordField } from "../../../../../src/features/auth/components/password-field";

function Harness() {
  const [value, setValue] = useState("secret-password");

  return (
    <PasswordField
      id="test-password"
      label="Password"
      value={value}
      onChange={setValue}
      autoComplete="current-password"
    />
  );
}

describe("PasswordField", () => {
  it("toggles password visibility without losing the value", async () => {
    const user = userEvent.setup();

    render(<Harness />);

    const input = screen.getByLabelText("Password");
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveValue("secret-password");

    await user.click(screen.getByRole("button", { name: "auth.actions.showPassword" }));
    expect(input).toHaveAttribute("type", "text");

    await user.click(screen.getByRole("button", { name: "auth.actions.hidePassword" }));
    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveValue("secret-password");
  });
});
