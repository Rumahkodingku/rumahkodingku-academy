import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const meta = {
  title: "Primitives/Table",
  component: Table,
  tags: ["autodocs"],
} satisfies Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Orders: Story = {
  render: () => (
    <Table>
      <TableCaption>Daftar pesanan terbaru</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nomor</TableHead>
          <TableHead>Peserta</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">RK-001</TableCell>
          <TableCell>Ayu</TableCell>
          <TableCell>
            <Badge tone="success">Paid</Badge>
          </TableCell>
          <TableCell className="text-right">Rp299.000</TableCell>
        </TableRow>
        <TableRow>
          <TableCell className="font-medium">RK-002</TableCell>
          <TableCell>Bima</TableCell>
          <TableCell>
            <Badge tone="warning">Pending</Badge>
          </TableCell>
          <TableCell className="text-right">Rp199.000</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
