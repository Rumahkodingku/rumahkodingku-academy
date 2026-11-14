import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../src/components/ui/tabs";

describe("Tabs", () => {
  it("changes the visible panel from the keyboard", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="ringkasan">
        <TabsList aria-label="Detail kursus">
          <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
          <TabsTrigger value="kurikulum">Kurikulum</TabsTrigger>
        </TabsList>
        <TabsContent value="ringkasan">Ringkasan kursus</TabsContent>
        <TabsContent value="kurikulum">Daftar materi</TabsContent>
      </Tabs>,
    );

    const overview = screen.getByRole("tab", { name: "Ringkasan" });
    overview.focus();
    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Kurikulum" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Daftar materi")).toBeVisible();
  });
});
