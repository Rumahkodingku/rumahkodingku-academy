import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";

describe("Table", () => {
  it("keeps column labels and a caption for context", () => {
    render(
      <Table>
        <TableCaption>Daftar pesanan terbaru</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Nomor</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>RK-001</TableCell>
            <TableCell>Paid</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("table", { name: "Daftar pesanan terbaru" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Nomor" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Paid" })).toBeInTheDocument();
  });
});
