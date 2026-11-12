import type { Meta, StoryObj } from "@storybook/react";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const meta = {
  title: "Primitives/Fields",
  component: Input,
  tags: ["autodocs"],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TextInput: Story = {
  render: () => (
    <Field.Root className="max-w-sm">
      <Field.Label>Email</Field.Label>
      <Field.Control render={<Input type="email" placeholder="nama@email.com" />} />
      <Field.Description>Gunakan email aktif untuk menerima notifikasi.</Field.Description>
    </Field.Root>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field.Root className="max-w-sm" invalid>
      <Field.Label>Email</Field.Label>
      <Field.Control render={<Input type="email" defaultValue="bukan-email" />} />
      <Field.Error match>Masukkan alamat email yang valid.</Field.Error>
    </Field.Root>
  ),
};

export const LongText: Story = {
  render: () => (
    <Field.Root className="max-w-sm">
      <Field.Label>Catatan</Field.Label>
      <Field.Control render={<Textarea placeholder="Tulis catatan..." />} />
    </Field.Root>
  ),
};
