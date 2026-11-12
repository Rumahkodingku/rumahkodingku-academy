import { describe, expect, it } from "vitest";

import { redact } from "./redact";

describe("redact", () => {
  it("redacts secrets recursively", () => {
    expect(
      redact({
        password: "x",
        nested: { token: "y" },
        safe: "z",
      }),
    ).toEqual({
      password: "[REDACTED]",
      nested: { token: "[REDACTED]" },
      safe: "z",
    });
  });

  it("redacts auth headers", () => {
    expect(
      redact({
        headers: {
          authorization: "Bearer x",
          cookie: "a=b",
          "set-cookie": "c=d",
        },
      }),
    ).toEqual({
      headers: {
        authorization: "[REDACTED]",
        cookie: "[REDACTED]",
        "set-cookie": "[REDACTED]",
      },
    });
  });

  it("redacts values inside arrays", () => {
    expect(redact([{ refresh_token: "x" }, "safe"])).toEqual([
      { refresh_token: "[REDACTED]" },
      "safe",
    ]);
  });
});
