import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Select } from "../../../../src/components/ui/select";

const options = [
  { value: "id", label: "Indonesia" },
  { value: "en", label: "English" },
  { value: "fr", label: "Français", disabled: true },
];

describe("Select", () => {
  it("selects an option with the keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(
      <Select
        aria-label="Bahasa"
        options={options}
        placeholder="Pilih bahasa"
        onValueChange={onValueChange}
      />,
    );

    const trigger = screen.getByRole("combobox", { name: "Bahasa" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(await screen.findByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(trigger).toHaveTextContent("English");
    expect(onValueChange).toHaveBeenCalledWith("en");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("skips disabled options and supports typeahead", async () => {
    const user = userEvent.setup();

    render(<Select aria-label="Bahasa" options={options} defaultValue="id" />);

    const trigger = screen.getByRole("combobox", { name: "Bahasa" });
    await user.click(trigger);
    await user.keyboard("e");

    expect(trigger).toHaveAttribute("aria-activedescendant", expect.stringContaining("en"));
    await user.keyboard("{Enter}");
    expect(trigger).toHaveTextContent("English");

    await user.click(trigger);
    await user.keyboard("{End}");
    expect(trigger).toHaveAttribute("aria-activedescendant", expect.stringContaining("en"));
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Select aria-label="Bahasa" options={options} />);

    const trigger = screen.getByRole("combobox", { name: "Bahasa" });
    await user.click(trigger);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
