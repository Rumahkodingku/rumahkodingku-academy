import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Checkbox } from "../../../../src/components/ui/checkbox";
import { RadioGroup } from "../../../../src/components/ui/radio-group";
import { Switch } from "../../../../src/components/ui/switch";

describe("native form controls", () => {
  it("toggles a switch with Space", async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();

    render(<Switch aria-label="Notifikasi email" onCheckedChange={onCheckedChange} />);

    const control = screen.getByRole("switch", { name: "Notifikasi email" });
    expect(control).not.toBeChecked();

    control.focus();
    await user.keyboard(" ");

    expect(control).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it("toggles a native checkbox", async () => {
    const user = userEvent.setup();

    render(<Checkbox aria-label="Setuju" />);

    const control = screen.getByRole("checkbox", { name: "Setuju" });
    await user.click(control);

    expect(control).toBeChecked();
  });

  it("moves through native radios with arrow keys", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <RadioGroup
        aria-label="Bahasa"
        defaultValue="id"
        onValueChange={onValueChange}
        options={[
          { value: "id", label: "Indonesia" },
          { value: "en", label: "English" },
        ]}
      />,
    );

    const indonesia = screen.getByRole("radio", { name: "Indonesia" });
    indonesia.focus();
    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("radio", { name: "English" })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith("en");
  });
});
