import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Alert } from "./alert";

describe("Alert", () => {
  it("announces a successful result without color alone", () => {
    render(
      <Alert title="Berhasil" variant="success">
        Perubahan sudah disimpan.
      </Alert>,
    );

    const alert = screen.getByRole("status");

    expect(alert).toHaveTextContent("Berhasil");
    expect(alert).toHaveTextContent("Perubahan sudah disimpan.");
  });

  it("uses alert semantics for destructive feedback", () => {
    render(
      <Alert title="Gagal" variant="danger">
        Pembayaran tidak dapat diproses.
      </Alert>,
    );

    expect(screen.getByRole("alert")).toHaveTextContent("Pembayaran tidak dapat diproses.");
  });
});
