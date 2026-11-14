"use client";

import { ImagePlus, Trash2, UserRound } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useRemoveAvatar, useUploadAvatar } from "@/features/auth/api/avatar";
import type { AuthUser } from "@/features/auth/types";

import { FormError } from "./form-error";
import { validateAvatarFile } from "../avatar-validation";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function AvatarUpload({ user, disabled = false }: { user: AuthUser; disabled?: boolean }) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadAvatar();
  const remove = useRemoveAvatar();
  const [preview, setPreview] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(user.profile.avatarUrl);
  const [version, setVersion] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleFile(file: File | undefined) {
    setError(null);
    setSuccess(false);

    if (!file) {
      return;
    }

    const validationError = validateAvatarFile(file);

    if (validationError) {
      setError(t(validationError));
      return;
    }

    setPreview(URL.createObjectURL(file));
    upload.mutate(file, {
      onSuccess: (result) => {
        setAvatarUrl(result.avatarUrl);
        setVersion(Date.now());
        setPreview(null);
        setSuccess(true);
      },
    });
  }

  function handleRemove() {
    setError(null);
    setSuccess(false);
    remove.mutate(undefined, {
      onSuccess: () => {
        setAvatarUrl(null);
        setPreview(null);
        setVersion(Date.now());
        setSuccess(true);
      },
    });
  }

  const source = preview ?? (avatarUrl ? `${avatarUrl}?v=${version}` : null);

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          {source ? (
            <img
              src={source}
              alt={t("profile.avatar.currentAlt")}
              className="size-24 rounded-lg border border-line object-cover"
            />
          ) : (
            <span className="flex size-24 items-center justify-center rounded-lg border border-line bg-surface-sunken text-h3 font-semibold text-accent-strong">
              {initials(user.profile.displayName || user.email)}
            </span>
          )}
          <span className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-full border border-line bg-canvas text-ink-muted">
            <UserRound aria-hidden="true" className="size-3.5" />
          </span>
        </div>

        <div className="grid gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label={t("profile.avatar.upload")}
            className="sr-only"
            onChange={(event) => handleFile(event.target.files?.[0])}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="primary"
              loading={upload.isPending}
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus aria-hidden="true" />
              {upload.isPending ? t("profile.avatar.uploading") : t("profile.avatar.upload")}
            </Button>
            {avatarUrl ? (
              <Button
                type="button"
                variant="ghost"
                loading={remove.isPending}
                disabled={disabled}
                onClick={handleRemove}
              >
                <Trash2 aria-hidden="true" />
                {t("profile.avatar.remove")}
              </Button>
            ) : null}
          </div>
          <p className="text-caption text-ink-muted">{t("profile.avatar.hint")}</p>
        </div>
      </div>

      {error ? <Alert tone="warning">{error}</Alert> : null}
      {success ? <Alert tone="success">{t("profile.avatar.success")}</Alert> : null}
      <FormError error={upload.error ?? remove.error} />
    </div>
  );
}
