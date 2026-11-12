import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const meta = {
  title: "Primitives/Dialog",
  component: Dialog,
  tags: ["autodocs"],
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Buka dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi perubahan</DialogTitle>
          <DialogDescription>Periksa data sebelum melanjutkan.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary">Batal</Button>} />
          <DialogClose render={<Button>Simpan</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
