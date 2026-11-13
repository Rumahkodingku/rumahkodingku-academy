import * as React from "react";

import { cn } from "@/lib/utils";

const containerSizes = {
  default: "max-w-page",
  wide: "max-w-[90rem]",
  prose: "max-w-[44rem]",
} as const;

type ContainerProps = React.ComponentProps<"div"> & {
  size?: keyof typeof containerSizes;
};

function Container({ className, size = "default", ...props }: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full px-5 md:px-7 xl:px-10", containerSizes[size], className)}
      {...props}
    />
  );
}

export { Container };
