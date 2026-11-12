import { ShieldX } from "lucide-react";

import { EmptyState } from "./empty-state";

type ForbiddenStateProps = Omit<React.ComponentProps<typeof EmptyState>, "icon" | "title"> & {
  title?: React.ReactNode;
};

function ForbiddenState({
  title = "Akses ditolak",
  description = "Akun Anda tidak memiliki izin untuk membuka halaman ini.",
  ...props
}: ForbiddenStateProps) {
  return <EmptyState icon={ShieldX} title={title} description={description} {...props} />;
}

export { ForbiddenState };
