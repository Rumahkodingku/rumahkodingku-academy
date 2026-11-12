import type { Meta, StoryObj } from "@storybook/react";

import { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger } from "@/components/ui/tabs";

const meta = {
  title: "Primitives/Tabs",
  component: Tabs,
  tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Tabs defaultValue="ringkasan" className="max-w-xl">
      <TabsList aria-label="Detail kursus">
        <TabsTrigger value="ringkasan">Ringkasan</TabsTrigger>
        <TabsTrigger value="kurikulum">Kurikulum</TabsTrigger>
        <TabsTrigger value="proyek">Proyek</TabsTrigger>
        <TabsIndicator />
      </TabsList>
      <TabsContent value="ringkasan">
        <p className="text-body-sm text-muted-foreground">
          Ringkasan materi, prasyarat, dan hasil belajar.
        </p>
      </TabsContent>
      <TabsContent value="kurikulum">
        <p className="text-body-sm text-muted-foreground">Daftar section dan lesson.</p>
      </TabsContent>
      <TabsContent value="proyek">
        <p className="text-body-sm text-muted-foreground">Ketentuan proyek akhir.</p>
      </TabsContent>
    </Tabs>
  ),
};
