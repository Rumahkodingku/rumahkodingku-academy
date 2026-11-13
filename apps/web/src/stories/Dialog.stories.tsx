import type { Meta, StoryObj } from "@storybook/react";

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
  args: { children: null },
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger>Buka dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Konfirmasi perubahan</DialogTitle>
          <DialogDescription>Periksa data sebelum melanjutkan.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>Batal</DialogClose>
          <DialogClose variant="primary">Simpan</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
