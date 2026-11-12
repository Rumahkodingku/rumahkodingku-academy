export const LOCALES = ["id", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "id";

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function stripLocale(pathname: string): string {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const match = normalized.match(/^\/(id|en)(?=\/|$)/);

  if (!match) {
    return normalized;
  }

  return normalized.slice(match[0].length) || "/";
}

export function localizedPath(locale: Locale, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;

  if (locale === DEFAULT_LOCALE) {
    return normalized;
  }

  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export function isProtectedPath(path: string): boolean {
  const normalized = path.replace(/\/+$/, "") || "/";
  const protectedPrefixes = ["/learn", "/me", "/admin", "/checkout"];

  return protectedPrefixes.some(
    (prefix) => normalized === prefix || normalized.startsWith(`${prefix}/`),
  );
}
