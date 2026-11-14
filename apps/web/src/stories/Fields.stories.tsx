import type { Meta, StoryObj } from "@storybook/react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldControl,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
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
    <Field className="max-w-sm">
      <FieldLabel>Email</FieldLabel>
      <FieldControl>
        <Input type="email" placeholder="nama@email.com" />
      </FieldControl>
      <FieldDescription>Gunakan email aktif untuk menerima notifikasi.</FieldDescription>
    </Field>
  ),
};

export const Invalid: Story = {
  render: () => (
    <Field className="max-w-sm" invalid>
      <FieldLabel>Email</FieldLabel>
      <FieldControl>
        <Input type="email" defaultValue="bukan-email" />
      </FieldControl>
      <FieldError>Masukkan alamat email yang valid.</FieldError>
    </Field>
  ),
};

export const LongText: Story = {
  render: () => (
    <Field className="max-w-sm">
      <FieldLabel>Catatan</FieldLabel>
      <FieldControl>
        <Textarea placeholder="Tulis catatan..." />
      </FieldControl>
    </Field>
  ),
};

export const Controls: Story = {
  render: () => (
    <div className="grid max-w-sm gap-6">
      <Checkbox aria-label="Setuju dengan ketentuan" defaultChecked />
      <Switch aria-label="Notifikasi email" defaultChecked />
      <RadioGroup
        aria-label="Bahasa"
        defaultValue="id"
        options={[
          { value: "id", label: "Indonesia" },
          { value: "en", label: "English" },
        ]}
      />
    </div>
  ),
};
