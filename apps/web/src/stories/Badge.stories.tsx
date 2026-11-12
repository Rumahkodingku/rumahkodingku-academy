import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@/components/ui/badge";

const meta = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Draft",
    variant: "neutral",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["neutral", "info", "success", "warning", "danger", "outline"],
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
      <Badge variant="info">In progress</Badge>
      <Badge variant="success">Approved</Badge>
      <Badge variant="warning">Needs revision</Badge>
      <Badge variant="danger">Failed</Badge>
      <Badge variant="outline">Published</Badge>
    </div>
  ),
};
