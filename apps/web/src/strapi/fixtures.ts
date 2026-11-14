import type { Locale } from "@/lib/i18n/routing";

import type { HomepageContent, MarketingPageContent, SiteSettingsContent } from "./content-types";

export const homepageFixtures = {
  id: {
    hero: {
      eyebrow: "Learn · Build · Grow",
      title: "Belajar teknologi dengan praktik nyata.",
      description:
        "Kursus terstruktur, proyek nyata, dan sertifikat untuk membantu Anda membangun kemampuan yang bisa dibuktikan.",
      primaryCta: { label: "Jelajahi kursus", href: "/courses" },
      secondaryCta: { label: "Cara belajar", href: "#cara-belajar" },
      note: "Kursus dibeli satu per satu. Akses belajar seumur hidup.",
      artifact: undefined,
    },
    features: [
      {
        icon: "course",
        title: "Kursus terstruktur",
        description:
          "Materi disusun bertahap, dari dasar sampai praktik, agar Anda tahu langkah berikutnya.",
      },
      {
        icon: "project",
        title: "Proyek nyata",
        description:
          "Setiap jalur belajar diakhiri dengan proyek yang melatih cara berpikir dan membangun portofolio.",
      },
      {
        icon: "certificate",
        title: "Sertifikat",
        description:
          "Bukti penyelesaian yang bisa diverifikasi setelah syarat belajar dan proyek terpenuhi.",
      },
    ],
    steps: [
      {
        title: "Pilih jalur belajar",
        description: "Tentukan kursus atau roadmap yang sesuai dengan tujuan Anda.",
      },
      {
        title: "Bangun proyek",
        description: "Praktikkan materi melalui latihan, kuis, dan proyek akhir.",
      },
      {
        title: "Buktikan kemampuan",
        description: "Selesaikan syarat belajar dan dapatkan sertifikat yang bisa diverifikasi.",
      },
    ],
    statement: {
      title: "Belajar yang berujung pada bukti.",
      body: "Academy menyusun materi, latihan, dan proyek dalam satu alur. Anda selalu tahu apa yang sedang dipelajari, apa yang sedang dibangun, dan bukti apa yang akan dihasilkan.",
    },
    proof: {
      eyebrow: "Bukti kemampuan",
      title: "Sertifikat bukan klaim kosong.",
      description:
        "Sertifikat diterbitkan setelah syarat belajar dan proyek terpenuhi, lalu dapat diverifikasi melalui halaman publik.",
      points: [
        "Kursus terstruktur dengan progres yang terlihat.",
        "Proyek nyata sebagai bagian dari penilaian.",
        "Sertifikat dengan halaman verifikasi.",
      ],
    },
    cta: {
      title: "Mulai dari satu langkah yang bisa Anda lihat hasilnya.",
      description: "Pilih program, kerjakan proyek pertama, lalu buktikan kemampuan Anda.",
      primaryCta: { label: "Jelajahi kursus", href: "/courses" },
      secondaryCta: { label: "Cara belajar", href: "#cara-belajar" },
    },
  },
  en: {
    hero: {
      eyebrow: "Learn · Build · Grow",
      title: "Learn technology through real practice.",
      description:
        "Structured courses, real projects, and certificates that help you build skills you can prove.",
      primaryCta: { label: "Explore courses", href: "/courses" },
      secondaryCta: { label: "How it works", href: "#cara-belajar" },
      note: "Courses are bought one at a time. Learning access is lifelong.",
      artifact: undefined,
    },
    features: [
      {
        icon: "course",
        title: "Structured courses",
        description:
          "Lessons build step by step, from foundations to practice, so you always know what comes next.",
      },
      {
        icon: "project",
        title: "Real projects",
        description:
          "Every learning path ends with a project that trains your thinking and builds a portfolio.",
      },
      {
        icon: "certificate",
        title: "Certificates",
        description:
          "Verifiable proof of completion after you meet the learning and project requirements.",
      },
    ],
    steps: [
      {
        title: "Choose a learning path",
        description: "Pick the course or roadmap that matches your goal.",
      },
      {
        title: "Build a project",
        description: "Practice through exercises, quizzes, and a final project.",
      },
      {
        title: "Prove your skills",
        description: "Complete the requirements and earn a verifiable certificate.",
      },
    ],
    statement: {
      title: "Learning that ends in proof.",
      body: "Academy connects lessons, practice, and projects into one path. You always know what you are learning, what you are building, and what evidence you will produce.",
    },
    proof: {
      eyebrow: "Proof of skill",
      title: "A certificate is not an empty claim.",
      description:
        "Certificates are issued after the learning and project requirements are met, then verified on a public page.",
      points: [
        "Structured courses with visible progress.",
        "Real projects as part of assessment.",
        "Certificates with a verification page.",
      ],
    },
    cta: {
      title: "Start with one step whose result you can see.",
      description: "Choose a program, build your first project, and prove what you can do.",
      primaryCta: { label: "Explore courses", href: "/courses" },
      secondaryCta: { label: "How it works", href: "#cara-belajar" },
    },
  },
} satisfies Record<Locale, HomepageContent>;

export const siteSettingsFixtures = {
  id: {
    siteName: "RumahKodingku Academy",
    tagline: "Learn · Build · Grow",
    description: "Platform belajar teknologi dengan kursus, proyek, dan sertifikat.",
    nav: [
      { label: "Beranda", href: "/" },
      { label: "Program", href: "/#program" },
      { label: "Cara belajar", href: "/#cara-belajar" },
    ],
    footerText: "Belajar, bangun, dan tumbuhkan kemampuan teknologi Anda.",
  },
  en: {
    siteName: "RumahKodingku Academy",
    tagline: "Learn · Build · Grow",
    description: "A technology learning platform with courses, projects, and certificates.",
    nav: [
      { label: "Home", href: "/" },
      { label: "Programs", href: "/#program" },
      { label: "How it works", href: "/#cara-belajar" },
    ],
    footerText: "Learn, build, and grow your technology skills.",
  },
} satisfies Record<Locale, SiteSettingsContent>;

export const marketingPageFixtures = [
  {
    title: "Tentang RumahKodingku Academy",
    slug: "tentang",
    blocks: [
      {
        __component: "blocks.rich-text",
        body: "RumahKodingku Academy membantu orang belajar teknologi melalui kursus terstruktur dan proyek nyata.",
      },
    ],
  },
] satisfies MarketingPageContent[];
