import { TriangleAlert } from "lucide-react";
import * as React from "react";

import { EmptyState } from "./empty-state";

type ErrorStateProps = Omit<React.ComponentProps<typeof EmptyState>, "icon" | "title"> & {
  code?: React.ReactNode;
  title?: React.ReactNode;
};

function ErrorState({
  code = "500",
  title = "Terjadi kesalahan",
  description = "Permintaan tidak dapat diproses. Coba lagi atau kembali ke halaman sebelumnya.",
  action,
  ...props
}: ErrorStateProps) {
  return (
    <EmptyState
      role="alert"
      icon={TriangleAlert}
      code={code}
      title={title}
      description={description}
      action={action}
      {...props}
    />
  );
}

export { ErrorState };
