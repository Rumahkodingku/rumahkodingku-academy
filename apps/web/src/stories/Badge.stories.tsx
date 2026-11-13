import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@/components/ui/badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Draft",
    tone: "neutral",
  },
  argTypes: {
    tone: {
      control: "select",
      options: ["neutral", "accent", "success", "warning", "danger"],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Neutral: Story = {};

export const Statuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Draft</Badge>
      <Badge tone="accent">In progress</Badge>
      <Badge tone="success">Approved</Badge>
      <Badge tone="warning">Needs revision</Badge>
      <Badge tone="danger">Failed</Badge>
      <Badge tone="neutral">Published</Badge>
    </div>
  ),
};
