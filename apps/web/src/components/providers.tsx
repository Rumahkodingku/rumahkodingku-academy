"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

import { createQueryClient } from "@/lib/query-client";
import { I18nProvider } from "@/lib/i18n/provider";
import type { Locale } from "@/lib/i18n/routing";
import { PostHogProvider } from "@/lib/posthog";

import { MotionProvider } from "./motion/motion-provider";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "./ui/sonner";

export default function Providers({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <I18nProvider locale={locale}>
          <MotionProvider>
            <PostHogProvider>{children}</PostHogProvider>
          </MotionProvider>
          <Toaster richColors />
        </I18nProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
