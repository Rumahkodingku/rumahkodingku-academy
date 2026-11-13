"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type PasswordFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  error?: string;
  description?: string;
};

export function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  error,
  description,
}: PasswordFieldProps) {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  return (
    <Field.Root invalid={Boolean(error)}>
      <Field.Label>{label}</Field.Label>
      <div className="relative">
        <Field.Control
          render={
            <Input
              id={id}
              type={visible ? "text" : "password"}
              value={value}
              onChange={(event) => onChange(event.target.value)}
              autoComplete={autoComplete}
              className="pr-12"
              aria-describedby={error ? `${id}-error` : undefined}
            />
          }
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
          aria-label={visible ? t("auth.actions.hidePassword") : t("auth.actions.showPassword")}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? (
            <EyeOff aria-hidden="true" className="size-4" />
          ) : (
            <Eye aria-hidden="true" className="size-4" />
          )}
        </Button>
      </div>
      {description ? <Field.Description>{description}</Field.Description> : null}
      {error ? (
        <Field.Error id={`${id}-error`} match>
          {t(error)}
        </Field.Error>
      ) : null}
    </Field.Root>
  );
}
