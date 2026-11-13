import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "@/features/auth/components/profile-form";
import { VerificationBanner } from "@/features/auth/components/verification-banner";
import { requireUser } from "@/lib/auth/session";
import { isLocale } from "@/lib/i18n/routing";

export default async function ProfilePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const user = await requireUser(locale);

  return (
    <Container className="grid gap-8 py-10 md:py-14">
      <div className="grid gap-3">
        <Badge tone="accent" className="w-fit">
          Profil
        </Badge>
        <h1 className="text-h1 text-foreground">Kenali diri Anda di Academy.</h1>
        <p className="max-w-2xl text-body-lg text-muted-foreground">
          Atur identitas publik, kontak, tautan, dan preferensi notifikasi. Email dan status akun
          tidak dapat diubah dari sini.
        </p>
      </div>

      {!user.emailVerified ? <VerificationBanner email={user.email} /> : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <ProfileForm user={user} disabled={!user.emailVerified} />

        <aside className="grid content-start gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Status akun</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-body-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Email</span>
                <span className="max-w-48 truncate font-medium text-foreground">{user.email}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Status</span>
                <Badge tone={user.status === "ACTIVE" ? "success" : "warning"}>{user.status}</Badge>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Verifikasi</span>
                <Badge tone={user.emailVerified ? "success" : "warning"}>
                  {user.emailVerified ? "Terverifikasi" : "Belum"}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">Akses</span>
                <span className="text-right font-medium text-foreground">
                  {user.permissions.length > 0 ? user.permissions.join(", ") : "Learner"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Catatan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-body-sm text-muted-foreground">
                Perubahan profil hanya berlaku pada data profil. Peran dan izin dikelola oleh
                administrator.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </Container>
  );
}
