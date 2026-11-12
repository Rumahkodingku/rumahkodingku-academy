import type { Meta, StoryObj } from "@storybook/react";

import { BrandLogo } from "@/components/brand/brand-logo";

const meta = {
  title: "Brand/Logo",
  component: BrandLogo,
  tags: ["autodocs"],
  args: {
    size: "md",
    showProductName: true,
  },
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
} satisfies Meta<typeof BrandLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {};

export const MarkOnly: Story = {
  args: {
    showProductName: false,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-8">
      <BrandLogo size="sm" />
      <BrandLogo size="md" />
      <BrandLogo size="lg" />
    </div>
  ),
};
