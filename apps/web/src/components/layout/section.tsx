import * as React from "react";

import { cn } from "@/lib/utils";

function Section({ className, ...props }: React.ComponentProps<"section">) {
  return <section data-slot="section" className={cn("py-16 md:py-24", className)} {...props} />;
}

export { Section };
