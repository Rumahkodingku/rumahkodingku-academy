"use client";

import type { Route } from "next";

import { ChevronDown, LogOut, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLogout } from "@/features/auth/api/auth";
import { hasPermission, PERMISSIONS } from "@/features/auth/permissions";
import type { AuthUser } from "@/features/auth/types";
import { localizedPath, type Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function UserAvatar({ user }: { user: AuthUser }) {
  if (user.profile.avatarUrl) {
    return (
      <img
        src={user.profile.avatarUrl}
        alt=""
        className="size-8 rounded-full border border-border object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-caption font-semibold text-primary"
    >
      {initials(user.profile.displayName || user.email)}
    </span>
  );
}

function SignedInMenu({ user, locale }: { user: AuthUser; locale: Locale }) {
  const { t } = useTranslation();
  const router = useRouter();
  const logout = useLogout();
  const admin = hasPermission(user, PERMISSIONS.ADMIN_ACCESS);

  function handleLogout() {
    logout.mutate(undefined, {
      onSuccess: () => {
        router.push(localizedPath(locale, "/") as Route);
        router.refresh();
      },
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="sm"
            className="h-10 gap-2 px-2"
            aria-label={t("account.menuLabel", { name: user.profile.displayName })}
          />
        }
      >
        <UserAvatar user={user} />
        <span className="hidden max-w-32 truncate text-body-sm font-medium lg:block">
          {user.profile.displayName}
        </span>
        <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="w-56">
        <div className="px-2.5 py-2">
          <p className="truncate text-body-sm font-medium text-foreground">
            {user.profile.displayName}
          </p>
          <p className="truncate text-caption text-muted-foreground">{user.email}</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={localizedPath(locale, "/me") as Route} />}>
          <UserRound aria-hidden="true" />
          {t("account.profile")}
        </DropdownMenuItem>
        {admin ? (
          <DropdownMenuItem render={<Link href={localizedPath(locale, "/admin") as Route} />}>
            <Shield aria-hidden="true" />
            {t("account.admin")}
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" disabled={logout.isPending} onClick={handleLogout}>
          <LogOut aria-hidden="true" />
          {logout.isPending ? t("account.signingOut") : t("account.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AccountMenu({ user, locale }: { user: AuthUser | null; locale: Locale }) {
  const { t } = useTranslation();

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link
          href={localizedPath(locale, "/login") as Route}
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}
        >
          {t("auth.links.signIn")}
        </Link>
        <Link
          href={localizedPath(locale, "/register") as Route}
          className={cn(buttonVariants({ size: "sm" }), "hidden sm:inline-flex")}
        >
          {t("auth.links.register")}
        </Link>
      </div>
    );
  }

  return <SignedInMenu user={user} locale={locale} />;
}
