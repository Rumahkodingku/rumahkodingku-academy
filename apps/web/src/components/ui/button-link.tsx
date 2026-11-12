import type { VariantProps } from "class-variance-authority";
import type { Route } from "next";
import type { ComponentProps } from "react";

import Link from "next/link";

import { cn } from "@/lib/utils";

import { buttonVariants } from "./button";

type ButtonLinkProps = Omit<ComponentProps<typeof Link>, "href"> &
  VariantProps<typeof buttonVariants> & {
    href: string;
  };

function ButtonLink({ className, variant, size, href, ...props }: ButtonLinkProps) {
  return (
    <Link
      href={href as Route}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { ButtonLink };
