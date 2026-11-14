import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { ProfileForm } from "@/features/auth/components/profile-form";
import { VerificationBanner } from "@/features/auth/components/verification-banner";
import { hasPermission, PERMISSIONS } from "@/features/auth/permissions";
import { requireUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n/routing";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const user = await requireUser(locale);
  const access = hasPermission(user, PERMISSIONS.ADMIN_ACCESS) ? "Admin" : "Learner";

  return (
    <Container className="grid gap-10 py-20 md:py-28">
      <header className="grid max-w-[52ch] gap-4">
        <p className="text-eyebrow uppercase text-accent-strong">Profil</p>
        <h1 className="text-h1 text-ink">Kenali diri Anda di Academy.</h1>
        <p className="text-body-lg text-ink-muted">
          Atur identitas publik, kontak, tautan, dan preferensi notifikasi. Email dan status akun
          tidak dapat diubah dari sini.
        </p>
      </header>

      {!user.emailVerified ? <VerificationBanner email={user.email} /> : null}

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_280px]">
        <ProfileForm user={user} disabled={!user.emailVerified} />

        <aside className="grid content-start gap-8 lg:sticky lg:top-28">
          <section className="grid gap-4">
            <h2 className="text-eyebrow uppercase text-ink-muted">Status akun</h2>
            <dl className="border-y border-line">
              <div className="flex items-start justify-between gap-4 border-b border-line py-3 text-body-sm">
                <dt className="text-ink-muted">Email</dt>
                <dd className="max-w-40 truncate text-right font-medium text-ink">{user.email}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-line py-3 text-body-sm">
                <dt className="text-ink-muted">Status</dt>
                <dd>
                  <Badge tone={user.status === "ACTIVE" ? "success" : "warning"}>
                    {user.status}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-line py-3 text-body-sm">
                <dt className="text-ink-muted">Verifikasi</dt>
                <dd>
                  <Badge tone={user.emailVerified ? "success" : "warning"}>
                    {user.emailVerified ? "Terverifikasi" : "Belum"}
                  </Badge>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3 text-body-sm">
                <dt className="text-ink-muted">Akses</dt>
                <dd className="font-medium text-ink">{access}</dd>
              </div>
            </dl>
          </section>

          <section className="grid gap-3 border-t border-line pt-6">
            <h2 className="text-eyebrow uppercase text-ink-muted">Catatan</h2>
            <p className="text-body-sm text-ink-muted">
              Perubahan profil hanya berlaku pada data profil. Peran dan izin dikelola oleh
              administrator.
            </p>
          </section>
        </aside>
      </div>
    </Container>
  );
}
