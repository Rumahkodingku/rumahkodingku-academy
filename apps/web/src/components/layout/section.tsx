import * as React from "react";

import { cn } from "@/lib/utils";

function Section({ className, ...props }: React.ComponentProps<"section">) {
  return (
    <section data-slot="section" className={cn("py-20 md:py-28 lg:py-36", className)} {...props} />
  );
}

export { Section };
