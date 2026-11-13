import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Button } from "../../../../src/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "../../../../src/components/ui/dialog";

describe("Dialog", () => {
  it("opens, closes with Escape, and restores focus", async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <DialogTrigger render={<Button>Buka dialog</Button>} />
        <DialogContent>
          <DialogTitle>Konfirmasi</DialogTitle>
          <DialogDescription>Periksa data sebelum melanjutkan.</DialogDescription>
          <DialogClose render={<Button variant="secondary">Tutup</Button>} />
        </DialogContent>
      </Dialog>,
    );

    const trigger = screen.getByRole("button", { name: "Buka dialog" });
    await user.click(trigger);

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Konfirmasi" })).toBeInTheDocument();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });
});
