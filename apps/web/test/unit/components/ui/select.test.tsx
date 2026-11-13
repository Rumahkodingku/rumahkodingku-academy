import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Select } from "../../../../src/components/ui/select";

const options = [
  { value: "nextjs", label: "Next.js" },
  { value: "nestjs", label: "NestJS" },
];

describe("Select", () => {
  it("selects an option with the keyboard", async () => {
    const user = userEvent.setup();

    render(<Select aria-label="Framework" options={options} placeholder="Pilih framework" />);

    const trigger = screen.getByRole("combobox", { name: "Framework" });
    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: "NestJS" }));

    expect(trigger).toHaveTextContent("NestJS");
  });
});
