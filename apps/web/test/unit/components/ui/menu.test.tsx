import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuSeparator,
  MenuTrigger,
} from "../../../../src/components/ui/menu";

function renderMenu(onSelect = vi.fn()) {
  render(
    <Menu>
      <MenuTrigger>Menu akun</MenuTrigger>
      <MenuContent align="end">
        <MenuItem onSelect={() => onSelect("profile")}>Profil</MenuItem>
        <MenuItem onSelect={() => onSelect("admin")}>Admin</MenuItem>
        <MenuSeparator />
        <MenuItem onSelect={() => onSelect("logout")}>Keluar</MenuItem>
      </MenuContent>
    </Menu>,
  );

  return onSelect;
}

describe("Menu", () => {
  it("opens, moves with the keyboard, and activates an item", async () => {
    const user = userEvent.setup();
    const onSelect = renderMenu();

    await user.click(screen.getByRole("button", { name: "Menu akun" }));
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledWith("logout");
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    renderMenu();

    const trigger = screen.getByRole("button", { name: "Menu akun" });
    await user.click(trigger);
    await screen.findByRole("menu");

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("selects by typeahead", async () => {
    const user = userEvent.setup();
    const onSelect = renderMenu();

    await user.click(screen.getByRole("button", { name: "Menu akun" }));
    await screen.findByRole("menu");

    await user.keyboard("k");
    await user.keyboard("{Enter}");

    expect(onSelect).toHaveBeenCalledWith("logout");
  });
});
