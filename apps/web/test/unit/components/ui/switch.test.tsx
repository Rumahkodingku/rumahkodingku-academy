import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Switch } from "../../../../src/components/ui/switch";

describe("Switch", () => {
  it("toggles from the keyboard", async () => {
    const user = userEvent.setup();

    render(<Switch aria-label="Notifikasi email" />);

    const control = screen.getByRole("switch", { name: "Notifikasi email" });
    expect(control).not.toBeChecked();

    control.focus();
    await user.keyboard(" ");

    expect(control).toBeChecked();
  });
});
