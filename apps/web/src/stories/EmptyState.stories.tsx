import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

const meta = {
  title: "Patterns/Empty State",
  component: EmptyState,
  tags: ["autodocs"],
  args: {
    title: "Belum ada kursus",
    description: "Kursus yang Anda beli akan muncul di sini.",
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: <Button>Jelajahi katalog</Button>,
  },
};
