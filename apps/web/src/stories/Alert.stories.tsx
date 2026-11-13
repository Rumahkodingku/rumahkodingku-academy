import type { Meta, StoryObj } from "@storybook/react";

import { Alert } from "@/components/ui/alert";

const meta = {
  title: "Primitives/Alert",
  component: Alert,
  tags: ["autodocs"],
  args: {
    title: "Informasi",
    children: "Periksa kembali data sebelum melanjutkan.",
    tone: "info",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["info", "success", "warning", "danger"],
    },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Success: Story = {
  args: {
    tone: "success",
    title: "Berhasil",
    children: "Perubahan sudah disimpan.",
  },
};

export const Warning: Story = {
  args: {
    tone: "warning",
    title: "Periksa kembali",
    children: "Beberapa data belum lengkap.",
  },
};

export const Danger: Story = {
  args: {
    tone: "danger",
    title: "Gagal",
    children: "Pembayaran tidak dapat diproses.",
  },
};
