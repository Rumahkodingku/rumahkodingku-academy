import type { Meta, StoryObj } from "@storybook/react";

import { Select } from "@/components/ui/select";

const options = [
  { value: "nextjs", label: "Next.js" },
  { value: "nestjs", label: "NestJS" },
  { value: "typescript", label: "TypeScript" },
];

const meta = {
  title: "Primitives/Select",
  component: Select,
  tags: ["autodocs"],
  args: {
    options,
    placeholder: "Pilih teknologi",
    "aria-label": "Teknologi",
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Preselected: Story = {
  args: {
    defaultValue: "nestjs",
  },
};
