"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfile } from "@/features/auth/api/auth";
import type { AuthUser, ProfilePatch } from "@/features/auth/types";

import { AvatarUpload } from "./avatar-upload";
import { FormError } from "./form-error";
import { fieldErrors, profileSchema, type ProfileFormValues } from "../validation";

function initialValues(user: AuthUser): ProfileFormValues {
  return {
    displayName: user.profile.displayName,
    fullName: user.profile.fullName ?? "",
    username: user.profile.username ?? "",
    bio: user.profile.bio ?? "",
    headline: user.profile.headline ?? "",
    phone: user.profile.phone ?? "",
    countryCode: user.profile.countryCode ?? "",
    city: user.profile.city ?? "",
    timezone: user.profile.timezone ?? "",
    locale: user.profile.locale,
    websiteUrl: user.profile.websiteUrl ?? "",
    githubUrl: user.profile.githubUrl ?? "",
    linkedinUrl: user.profile.linkedinUrl ?? "",
    xUrl: user.profile.xUrl ?? "",
    instagramUrl: user.profile.instagramUrl ?? "",
    emailNotifications: user.profile.emailNotifications,
    inAppNotifications: user.profile.inAppNotifications,
  };
}

function nullify(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

type TextFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  disabled?: boolean;
};

function TextField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  placeholder,
  disabled,
}: TextFieldProps) {
  const { t } = useTranslation();

  return (
    <Field.Root invalid={Boolean(error)}>
      <Field.Label>{label}</Field.Label>
      <Field.Control
        render={
          <Input
            id={id}
            type={type}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            autoComplete={autoComplete}
            placeholder={placeholder}
            disabled={disabled}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        }
      />
      {error ? (
        <Field.Error id={`${id}-error`} match>
          {t(error)}
        </Field.Error>
      ) : null}
    </Field.Root>
  );
}

function SwitchField({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface-subtle p-4">
      <div className="grid gap-1">
        <label htmlFor={id} className="text-body-sm font-medium text-foreground">
          {label}
        </label>
        <p className="text-caption text-muted-foreground">{description}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function ProfileForm({ user, disabled = false }: { user: AuthUser; disabled?: boolean }) {
  const { t } = useTranslation();
  const update = useUpdateProfile();
  const [values, setValues] = useState<ProfileFormValues>(() => initialValues(user));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  function setValue<K extends keyof ProfileFormValues>(key: K, value: ProfileFormValues[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = profileSchema.safeParse(values);

    if (!parsed.success) {
      setErrors(fieldErrors(parsed.error));
      return;
    }

    setErrors({});
    setSuccess(false);

    const patch: ProfilePatch = {
      displayName: parsed.data.displayName,
      fullName: nullify(parsed.data.fullName ?? ""),
      username: nullify(parsed.data.username ?? "")?.toLowerCase() ?? null,
      bio: nullify(parsed.data.bio ?? ""),
      headline: nullify(parsed.data.headline ?? ""),
      phone: nullify(parsed.data.phone ?? ""),
      countryCode: nullify(parsed.data.countryCode ?? "")?.toUpperCase() ?? null,
      city: nullify(parsed.data.city ?? ""),
      timezone: nullify(parsed.data.timezone ?? ""),
      locale: parsed.data.locale,
      websiteUrl: nullify(parsed.data.websiteUrl ?? ""),
      githubUrl: nullify(parsed.data.githubUrl ?? ""),
      linkedinUrl: nullify(parsed.data.linkedinUrl ?? ""),
      xUrl: nullify(parsed.data.xUrl ?? ""),
      instagramUrl: nullify(parsed.data.instagramUrl ?? ""),
      emailNotifications: parsed.data.emailNotifications,
      inAppNotifications: parsed.data.inAppNotifications,
    };

    update.mutate(patch, { onSuccess: () => setSuccess(true) });
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit} noValidate>
      <Card>
        <CardHeader>
          <CardTitle>{t("profile.avatar.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUpload user={user} disabled={disabled} />
        </CardContent>
      </Card>

      {success ? <Alert tone="success">{t("profile.saved")}</Alert> : null}
      <FormError error={update.error} />

      <Card>
        <CardHeader>
          <CardTitle>{t("profile.sections.identity")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="profile-display-name"
            label={t("profile.fields.displayName")}
            value={values.displayName}
            onChange={(value) => setValue("displayName", value)}
            error={errors.displayName}
            autoComplete="name"
          />
          <TextField
            id="profile-full-name"
            label={t("profile.fields.fullName")}
            value={values.fullName ?? ""}
            onChange={(value) => setValue("fullName", value)}
            error={errors.fullName}
            autoComplete="name"
          />
          <TextField
            id="profile-username"
            label={t("profile.fields.username")}
            value={values.username ?? ""}
            onChange={(value) => setValue("username", value)}
            error={errors.username}
            autoComplete="username"
            placeholder="nama_pengguna"
          />
          <TextField
            id="profile-headline"
            label={t("profile.fields.headline")}
            value={values.headline ?? ""}
            onChange={(value) => setValue("headline", value)}
            error={errors.headline}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("profile.sections.about")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Field.Root invalid={Boolean(errors.bio)}>
            <Field.Label>{t("profile.fields.bio")}</Field.Label>
            <Field.Control
              render={
                <Textarea
                  value={values.bio ?? ""}
                  onChange={(event) => setValue("bio", event.target.value)}
                  placeholder={t("profile.placeholders.bio")}
                  aria-describedby={errors.bio ? "profile-bio-error" : undefined}
                />
              }
            />
            {errors.bio ? (
              <Field.Error id="profile-bio-error" match>
                {t(errors.bio)}
              </Field.Error>
            ) : null}
          </Field.Root>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("profile.sections.contact")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <TextField
            id="profile-phone"
            label={t("profile.fields.phone")}
            value={values.phone ?? ""}
            onChange={(value) => setValue("phone", value)}
            error={errors.phone}
            autoComplete="tel"
          />
          <TextField
            id="profile-country"
            label={t("profile.fields.countryCode")}
            value={values.countryCode ?? ""}
            onChange={(value) => setValue("countryCode", value)}
            error={errors.countryCode}
            placeholder="ID"
          />
          <TextField
            id="profile-city"
            label={t("profile.fields.city")}
            value={values.city ?? ""}
            onChange={(value) => setValue("city", value)}
            error={errors.city}
            autoComplete="address-level2"
          />
          <TextField
            id="profile-timezone"
            label={t("profile.fields.timezone")}
            value={values.timezone ?? ""}
            onChange={(value) => setValue("timezone", value)}
            error={errors.timezone}
            placeholder="Asia/Jakarta"
          />
          <div className="grid gap-2 sm:col-span-2">
            <label className="text-body-sm font-medium text-foreground" htmlFor="profile-locale">
              {t("profile.fields.locale")}
            </label>
            <Select
              id="profile-locale"
              value={values.locale}
              onValueChange={(value) => setValue("locale", value as "id" | "en")}
              options={[
                { value: "id", label: t("language.id") },
                { value: "en", label: t("language.en") },
              ]}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("profile.sections.links")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["websiteUrl", "profile.fields.websiteUrl", "https://"],
              ["githubUrl", "profile.fields.githubUrl", "https://github.com/"],
              ["linkedinUrl", "profile.fields.linkedinUrl", "https://linkedin.com/in/"],
              ["xUrl", "profile.fields.xUrl", "https://x.com/"],
              ["instagramUrl", "profile.fields.instagramUrl", "https://instagram.com/"],
            ] as const
          ).map(([key, label, placeholder]) => (
            <TextField
              key={key}
              id={`profile-${key}`}
              label={t(label)}
              value={values[key] ?? ""}
              onChange={(value) => setValue(key, value)}
              error={errors[key]}
              type="url"
              placeholder={placeholder}
            />
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("profile.sections.preferences")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <SwitchField
            id="profile-email-notifications"
            label={t("profile.fields.emailNotifications")}
            description={t("profile.fields.emailNotificationsDescription")}
            checked={values.emailNotifications}
            onCheckedChange={(checked) => setValue("emailNotifications", checked)}
          />
          <SwitchField
            id="profile-in-app-notifications"
            label={t("profile.fields.inAppNotifications")}
            description={t("profile.fields.inAppNotificationsDescription")}
            checked={values.inAppNotifications}
            onCheckedChange={(checked) => setValue("inAppNotifications", checked)}
          />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" size="lg" loading={update.isPending} disabled={disabled}>
          {update.isPending ? t("profile.saving") : t("profile.save")}
        </Button>
        <p className="text-caption text-muted-foreground">{t("profile.readOnlyHint")}</p>
      </div>
    </form>
  );
}
