import type { Meta, StoryObj } from "@storybook/react";

import { LogOut, Shield, UserRound } from "lucide-react";

import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from "@/components/ui/menu";

const meta = {
  title: "Primitives/Menu",
  component: Menu,
  tags: ["autodocs"],
  args: { children: null },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Account: Story = {
  render: () => (
    <Menu>
      <MenuTrigger variant="secondary" size="sm">
        Buka menu
      </MenuTrigger>
      <MenuContent align="start" className="w-56">
        <MenuItem href="/me">
          <UserRound aria-hidden="true" />
          Profil
        </MenuItem>
        <MenuItem href="/admin">
          <Shield aria-hidden="true" />
          Admin
        </MenuItem>
        <MenuSeparator />
        <MenuItem variant="danger">
          <LogOut aria-hidden="true" />
          Keluar
        </MenuItem>
      </MenuContent>
    </Menu>
  ),
};
