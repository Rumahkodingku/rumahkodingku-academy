import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../../../../src/components/ui/button";

describe("Button", () => {
  it("renders a native button and activates from the keyboard", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={onClick}>Simpan</Button>);

    const button = screen.getByRole("button", { name: "Simpan" });
    expect(button.tagName).toBe("BUTTON");

    button.focus();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("blocks activation while loading", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button loading onClick={onClick}>
        Simpan
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Simpan" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button.querySelector("svg")).toHaveAttribute("aria-hidden", "true");

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("uses ink, not blue, for the primary action", () => {
    render(<Button variant="primary">Mulai</Button>);

    const button = screen.getByRole("button", { name: "Mulai" });
    expect(button).toHaveClass("bg-ink");
    expect(button).toHaveClass("text-canvas");
  });
});
