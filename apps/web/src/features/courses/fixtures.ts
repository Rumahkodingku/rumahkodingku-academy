import type {
  Course,
  CourseCategory,
  CourseDifficulty,
  CourseLanguage,
  CourseLesson,
  CourseLessonType,
  CourseSection,
} from "./types";

type Localized<T> = Record<CourseLanguage, T>;

type LessonSeed = {
  title: Localized<string>;
  durationMinutes: number;
  contentType?: CourseLessonType;
  required?: boolean;
  preview?: boolean;
};

type SectionSeed = {
  title: Localized<string>;
  description?: Localized<string>;
  lessons: LessonSeed[];
};

type CourseSeed = {
  slug: string;
  title: Localized<string>;
  shortDescription: Localized<string>;
  description: Localized<string>;
  difficulty: CourseDifficulty;
  estimatedDurationMinutes: number;
  learningOutcomes: Localized<string[]>;
  prerequisites: Localized<string[]>;
  instructorBio: Localized<string>;
  price: number;
  discountPrice?: number | null;
  status: Course["status"];
  featured: boolean;
  finalProjectEnabled: boolean;
  certificateEnabled: boolean;
  publishedAt?: string | null;
  categories: CourseCategory[];
  sections: SectionSeed[];
};

const seeds: CourseSeed[] = [
  {
    slug: "nextjs-app-router",
    title: {
      id: "Next.js App Router: Fondasi ke Produksi",
      en: "Next.js App Router: Foundations to Production",
    },
    shortDescription: {
      id: "Bangun aplikasi Next.js yang cepat, terstruktur, dan siap di-deploy.",
      en: "Build fast, structured Next.js applications that are ready to deploy.",
    },
    description: {
      id: "Kursus ini membahas App Router dari fondasi sampai pola produksi. Anda akan membangun route, layout, data fetching, cache, metadata, dan error boundary dalam satu proyek nyata.",
      en: "This course covers the App Router from foundations to production patterns. You will build routes, layouts, data fetching, caching, metadata, and error boundaries in one real project.",
    },
    difficulty: "INTERMEDIATE",
    estimatedDurationMinutes: 420,
    learningOutcomes: {
      id: [
        "Menyusun route dan layout App Router dengan batas server-client yang jelas.",
        "Memilih strategi rendering dan cache yang sesuai kebutuhan data.",
        "Menambahkan metadata, error boundary, dan loading state.",
        "Menyiapkan build produksi dan deployment yang dapat diulang.",
      ],
      en: [
        "Structure App Router routes and layouts with clear server-client boundaries.",
        "Choose rendering and caching strategies that match the data.",
        "Add metadata, error boundaries, and loading states.",
        "Prepare a repeatable production build and deployment.",
      ],
    },
    prerequisites: {
      id: ["React dasar", "JavaScript modern", "Terminal dan Git"],
      en: ["React fundamentals", "Modern JavaScript", "Terminal and Git"],
    },
    instructorBio: {
      id: "Tim kurikulum Academy yang menyusun materi dari praktik produk nyata.",
      en: "The Academy curriculum team, building lessons from real product practice.",
    },
    price: 249000,
    status: "PUBLISHED",
    featured: true,
    finalProjectEnabled: true,
    certificateEnabled: true,
    publishedAt: "2026-10-15",
    categories: ["frontend"],
    sections: [
      {
        title: { id: "Fondasi App Router", en: "App Router foundations" },
        description: {
          id: "Memahami struktur route dan model komponen.",
          en: "Understand route structure and the component model.",
        },
        lessons: [
          {
            title: { id: "Struktur route", en: "Route structure" },
            durationMinutes: 18,
            preview: true,
          },
          {
            title: { id: "Server dan Client Components", en: "Server and Client Components" },
            durationMinutes: 24,
          },
          { title: { id: "Layout dan loading", en: "Layouts and loading" }, durationMinutes: 21 },
          { title: { id: "Data fetching", en: "Data fetching" }, durationMinutes: 26 },
        ],
      },
      {
        title: { id: "Rendering dan cache", en: "Rendering and caching" },
        description: {
          id: "Memilih rendering yang tepat untuk setiap layar.",
          en: "Choose the right rendering mode for each screen.",
        },
        lessons: [
          { title: { id: "Static rendering", en: "Static rendering" }, durationMinutes: 19 },
          { title: { id: "Dynamic rendering", en: "Dynamic rendering" }, durationMinutes: 22 },
          {
            title: { id: "Cache dan revalidasi", en: "Caching and revalidation" },
            durationMinutes: 25,
          },
          { title: { id: "Streaming", en: "Streaming" }, durationMinutes: 20 },
        ],
      },
      {
        title: { id: "Produksi", en: "Production" },
        description: {
          id: "Menyiapkan aplikasi untuk pengguna nyata.",
          en: "Prepare the application for real users.",
        },
        lessons: [
          { title: { id: "Metadata dan SEO", en: "Metadata and SEO" }, durationMinutes: 18 },
          { title: { id: "Error boundaries", en: "Error boundaries" }, durationMinutes: 16 },
          { title: { id: "Testing route", en: "Route testing" }, durationMinutes: 24 },
          { title: { id: "Deploy Next.js", en: "Deploying Next.js" }, durationMinutes: 22 },
        ],
      },
    ],
  },
  {
    slug: "react-19-patterns",
    title: {
      id: "React 19: Composition dan Performance",
      en: "React 19: Composition and Performance",
    },
    shortDescription: {
      id: "Tulis komponen React yang fleksibel, mudah diuji, dan tidak boros render.",
      en: "Write React components that stay flexible, testable, and render-efficient.",
    },
    description: {
      id: "Fokus pada komposisi komponen, state yang terukur, dan pola performa React 19. Anda akan membangun UI kompleks tanpa menumpuk props boolean atau efek yang tidak perlu.",
      en: "Focus on component composition, measured state, and React 19 performance patterns. You will build complex UI without piling up boolean props or unnecessary effects.",
    },
    difficulty: "INTERMEDIATE",
    estimatedDurationMinutes: 360,
    learningOutcomes: {
      id: [
        "Merancang API komponen dengan komposisi, bukan boolean.",
        "Memisahkan server state dan UI state secara jelas.",
        "Menghindari render dan efek yang tidak perlu.",
        "Mengukur dan memperbaiki jalur render yang lambat.",
      ],
      en: [
        "Design component APIs with composition instead of booleans.",
        "Separate server state from UI state clearly.",
        "Avoid unnecessary renders and effects.",
        "Measure and fix slow render paths.",
      ],
    },
    prerequisites: {
      id: ["React dasar", "TypeScript dasar"],
      en: ["React fundamentals", "Basic TypeScript"],
    },
    instructorBio: {
      id: "Tim kurikulum Academy yang fokus pada pola UI produk.",
      en: "The Academy curriculum team focused on product UI patterns.",
    },
    price: 229000,
    status: "PUBLISHED",
    featured: false,
    finalProjectEnabled: true,
    certificateEnabled: true,
    publishedAt: "2026-10-02",
    categories: ["frontend"],
    sections: [
      {
        title: { id: "Model komposisi", en: "Composition model" },
        lessons: [
          {
            title: { id: "Komponen compound", en: "Compound components" },
            durationMinutes: 22,
            preview: true,
          },
          { title: { id: "Context dan state", en: "Context and state" }, durationMinutes: 20 },
          {
            title: { id: "Menghindari props boolean", en: "Avoiding boolean props" },
            durationMinutes: 18,
          },
          {
            title: { id: "API komponen yang jelas", en: "Clear component APIs" },
            durationMinutes: 24,
          },
        ],
      },
      {
        title: { id: "State dan efek", en: "State and effects" },
        lessons: [
          { title: { id: "State turunan", en: "Derived state" }, durationMinutes: 19 },
          { title: { id: "Efek yang terukur", en: "Measured effects" }, durationMinutes: 21 },
          { title: { id: "Transisi UI", en: "UI transitions" }, durationMinutes: 18 },
          { title: { id: "Reset state", en: "Resetting state" }, durationMinutes: 16 },
        ],
      },
      {
        title: { id: "Performance", en: "Performance" },
        lessons: [
          { title: { id: "Profiling render", en: "Render profiling" }, durationMinutes: 21 },
          { title: { id: "Memo yang berguna", en: "Useful memoization" }, durationMinutes: 20 },
          { title: { id: "Code splitting", en: "Code splitting" }, durationMinutes: 19 },
          { title: { id: "Audit komponen", en: "Component audit" }, durationMinutes: 22 },
        ],
      },
    ],
  },
  {
    slug: "typescript-real-projects",
    title: { id: "TypeScript untuk Proyek Nyata", en: "TypeScript for Real Projects" },
    shortDescription: {
      id: "Gunakan TypeScript untuk membuat batas data yang aman dan mudah dirawat.",
      en: "Use TypeScript to create data boundaries that are safe and maintainable.",
    },
    description: {
      id: "Kursus pengantar yang menghubungkan tipe dengan pekerjaan sehari-hari: API response, form, error handling, dan refactor yang tidak merusak konsumen.",
      en: "An introductory course that connects types to daily work: API responses, forms, error handling, and refactors that do not break consumers.",
    },
    difficulty: "BEGINNER",
    estimatedDurationMinutes: 300,
    learningOutcomes: {
      id: [
        "Membaca dan menulis tipe untuk data produk.",
        "Membuat validasi runtime yang selaras dengan tipe.",
        "Menangani error dan state yang tidak lengkap.",
        "Melakukan refactor dengan percaya diri.",
      ],
      en: [
        "Read and write types for product data.",
        "Build runtime validation that matches types.",
        "Handle errors and incomplete states.",
        "Refactor with confidence.",
      ],
    },
    prerequisites: {
      id: ["JavaScript dasar", "HTML dan CSS dasar"],
      en: ["JavaScript fundamentals", "HTML and CSS basics"],
    },
    instructorBio: {
      id: "Tim kurikulum Academy yang menyusun latihan dari kasus aplikasi nyata.",
      en: "The Academy curriculum team, building exercises from real application cases.",
    },
    price: 0,
    status: "PUBLISHED",
    featured: false,
    finalProjectEnabled: false,
    certificateEnabled: true,
    publishedAt: "2026-09-20",
    categories: ["frontend"],
    sections: [
      {
        title: { id: "Type system", en: "Type system" },
        lessons: [
          {
            title: { id: "Tipe dasar dan union", en: "Basic types and unions" },
            durationMinutes: 18,
            preview: true,
          },
          {
            title: { id: "Object dan interface", en: "Objects and interfaces" },
            durationMinutes: 20,
          },
          { title: { id: "Generic dasar", en: "Basic generics" }, durationMinutes: 22 },
          { title: { id: "Type narrowing", en: "Type narrowing" }, durationMinutes: 19 },
        ],
      },
      {
        title: { id: "Batas data", en: "Data boundaries" },
        lessons: [
          { title: { id: "API response", en: "API responses" }, durationMinutes: 21 },
          { title: { id: "Validasi runtime", en: "Runtime validation" }, durationMinutes: 23 },
          { title: { id: "Form dan error", en: "Forms and errors" }, durationMinutes: 20 },
          { title: { id: "Null dan undefined", en: "Null and undefined" }, durationMinutes: 17 },
        ],
      },
      {
        title: { id: "Refactor", en: "Refactoring" },
        lessons: [
          {
            title: { id: "Membaca error compiler", en: "Reading compiler errors" },
            durationMinutes: 18,
          },
          { title: { id: "Memecah tipe besar", en: "Splitting large types" }, durationMinutes: 19 },
          { title: { id: "Migrasi bertahap", en: "Incremental migration" }, durationMinutes: 21 },
          { title: { id: "Studi kasus", en: "Case study" }, durationMinutes: 24 },
        ],
      },
    ],
  },
  {
    slug: "tailwind-design-system",
    title: { id: "Tailwind CSS 4: Design System", en: "Tailwind CSS 4: Design System" },
    shortDescription: {
      id: "Ubah utility Tailwind menjadi sistem visual yang konsisten dan mudah dirawat.",
      en: "Turn Tailwind utilities into a consistent, maintainable visual system.",
    },
    description: {
      id: "Bangun token, komponen, dan pola responsif dengan Tailwind 4. Fokus pada keputusan desain yang dapat diulang, bukan kumpulan class yang tumbuh tanpa kendali.",
      en: "Build tokens, components, and responsive patterns with Tailwind 4. Focus on repeatable design decisions instead of uncontrolled class growth.",
    },
    difficulty: "INTERMEDIATE",
    estimatedDurationMinutes: 330,
    learningOutcomes: {
      id: [
        "Menyusun token warna, tipe, dan spacing.",
        "Membangun komponen yang konsisten dengan utility.",
        "Mengelola state responsif dan dark mode.",
        "Menjaga class tetap terbaca dan mudah diubah.",
      ],
      en: [
        "Define color, type, and spacing tokens.",
        "Build consistent components with utilities.",
        "Manage responsive states and themes.",
        "Keep classes readable and easy to change.",
      ],
    },
    prerequisites: {
      id: ["CSS dasar", "React dasar"],
      en: ["CSS fundamentals", "React fundamentals"],
    },
    instructorBio: {
      id: "Tim kurikulum Academy yang fokus pada sistem desin dan implementasi.",
      en: "The Academy curriculum team focused on design systems and implementation.",
    },
    price: 179000,
    status: "PUBLISHED",
    featured: false,
    finalProjectEnabled: true,
    certificateEnabled: true,
    publishedAt: "2026-09-05",
    categories: ["frontend"],
    sections: [
      {
        title: { id: "Token dan theme", en: "Tokens and themes" },
        lessons: [
          {
            title: { id: "Primitive dan semantic token", en: "Primitive and semantic tokens" },
            durationMinutes: 20,
            preview: true,
          },
          { title: { id: "Theme di CSS", en: "Theme in CSS" }, durationMinutes: 18 },
          {
            title: { id: "Tipografi responsif", en: "Responsive typography" },
            durationMinutes: 19,
          },
          { title: { id: "Spacing dan radius", en: "Spacing and radius" }, durationMinutes: 16 },
        ],
      },
      {
        title: { id: "Komponen", en: "Components" },
        lessons: [
          { title: { id: "Button dan form", en: "Buttons and forms" }, durationMinutes: 21 },
          { title: { id: "State interaktif", en: "Interactive states" }, durationMinutes: 22 },
          { title: { id: "Komposisi komponen", en: "Component composition" }, durationMinutes: 20 },
          { title: { id: "Audit visual", en: "Visual audit" }, durationMinutes: 18 },
        ],
      },
      {
        title: { id: "Responsif", en: "Responsive" },
        lessons: [
          { title: { id: "Mobile-first layout", en: "Mobile-first layout" }, durationMinutes: 17 },
          { title: { id: "Grid dan container", en: "Grids and containers" }, durationMinutes: 19 },
          { title: { id: "Overflow dan zoom", en: "Overflow and zoom" }, durationMinutes: 18 },
          { title: { id: "Studi kasus", en: "Case study" }, durationMinutes: 23 },
        ],
      },
    ],
  },
  {
    slug: "nestjs-api-architecture",
    title: { id: "NestJS: Arsitektur API Produksi", en: "NestJS: Production API Architecture" },
    shortDescription: {
      id: "Rancang API NestJS yang aman, teruji, dan mudah tumbuh.",
      en: "Design NestJS APIs that stay secure, tested, and easy to grow.",
    },
    description: {
      id: "Dari module dan dependency injection sampai validasi, error handling, authorization, dan observability. Kursus ini menekankan batas domain yang jelas dan keputusan yang dapat dipertanggungjawabkan.",
      en: "From modules and dependency injection to validation, error handling, authorization, and observability. This course emphasizes clear domain boundaries and accountable decisions.",
    },
    difficulty: "INTERMEDIATE",
    estimatedDurationMinutes: 450,
    learningOutcomes: {
      id: [
        "Menyusun module dan provider yang terpisah berdasarkan domain.",
        "Membuat kontrak request dan response yang konsisten.",
        "Menerapkan validasi, error, dan authorization di batas API.",
        "Menambahkan logging dan health check untuk produksi.",
      ],
      en: [
        "Structure modules and providers by domain.",
        "Create consistent request and response contracts.",
        "Apply validation, errors, and authorization at the API boundary.",
        "Add logging and health checks for production.",
      ],
    },
    prerequisites: {
      id: ["TypeScript dasar", "HTTP dan REST", "Node.js dasar"],
      en: ["Basic TypeScript", "HTTP and REST", "Node.js fundamentals"],
    },
    instructorBio: {
      id: "Tim kurikulum Academy yang membangun API untuk produk internal.",
      en: "The Academy curriculum team building APIs for internal products.",
    },
    price: 279000,
    status: "PUBLISHED",
    featured: false,
    finalProjectEnabled: true,
    certificateEnabled: true,
    publishedAt: "2026-08-28",
    categories: ["backend"],
    sections: [
      {
        title: { id: "Arsitektur modul", en: "Module architecture" },
        lessons: [
          {
            title: { id: "Module dan provider", en: "Modules and providers" },
            durationMinutes: 21,
            preview: true,
          },
          {
            title: { id: "Dependency injection", en: "Dependency injection" },
            durationMinutes: 19,
          },
          { title: { id: "Batas domain", en: "Domain boundaries" }, durationMinutes: 23 },
          {
            title: { id: "Konfigurasi aplikasi", en: "Application configuration" },
            durationMinutes: 18,
          },
        ],
      },
      {
        title: { id: "Request lifecycle", en: "Request lifecycle" },
        lessons: [
          { title: { id: "DTO dan validasi", en: "DTOs and validation" }, durationMinutes: 22 },
          { title: { id: "Exception filter", en: "Exception filters" }, durationMinutes: 20 },
          { title: { id: "Response envelope", en: "Response envelopes" }, durationMinutes: 17 },
          { title: { id: "Request context", en: "Request context" }, durationMinutes: 19 },
        ],
      },
      {
        title: { id: "Produksi", en: "Production" },
        lessons: [
          { title: { id: "Authorization guard", en: "Authorization guards" }, durationMinutes: 24 },
          { title: { id: "Logging dan audit", en: "Logging and audit" }, durationMinutes: 21 },
          { title: { id: "Health dan metrics", en: "Health and metrics" }, durationMinutes: 18 },
          { title: { id: "Deploy API", en: "API deployment" }, durationMinutes: 22 },
        ],
      },
    ],
  },
  {
    slug: "mysql-typeorm",
    title: {
      id: "MySQL dan TypeORM untuk Product Team",
      en: "MySQL and TypeORM for Product Teams",
    },
    shortDescription: {
      id: "Model data yang rapi, query yang terukur, dan migrasi yang aman.",
      en: "Clean data models, measured queries, and safe migrations.",
    },
    description: {
      id: "Pelajari desain tabel, relasi, indeks, transaksi, dan migrasi dengan MySQL dan TypeORM. Fokus pada keputusan yang menjaga integritas data saat produk berkembang.",
      en: "Learn table design, relations, indexes, transactions, and migrations with MySQL and TypeORM. Focus on decisions that protect data integrity as the product grows.",
    },
    difficulty: "BEGINNER",
    estimatedDurationMinutes: 360,
    learningOutcomes: {
      id: [
        "Menerjemahkan kebutuhan produk menjadi skema yang jelas.",
        "Memilih relasi dan indeks yang sesuai.",
        "Menjaga konsistensi data dengan transaksi.",
        "Menulis migrasi yang dapat diuji dan dipulihkan.",
      ],
      en: [
        "Translate product needs into a clear schema.",
        "Choose appropriate relations and indexes.",
        "Protect data consistency with transactions.",
        "Write migrations that can be tested and reversed.",
      ],
    },
    prerequisites: {
      id: ["SQL dasar", "TypeScript dasar"],
      en: ["Basic SQL", "Basic TypeScript"],
    },
    instructorBio: {
      id: "Tim kurikulum Academy yang menangani data produk dan integrasi.",
      en: "The Academy curriculum team working on product data and integrations.",
    },
    price: 199000,
    status: "PUBLISHED",
    featured: false,
    finalProjectEnabled: false,
    certificateEnabled: true,
    publishedAt: "2026-08-12",
    categories: ["backend", "data"],
    sections: [
      {
        title: { id: "Schema", en: "Schema" },
        lessons: [
          {
            title: { id: "Entitas dan kolom", en: "Entities and columns" },
            durationMinutes: 20,
            preview: true,
          },
          { title: { id: "Relasi", en: "Relations" }, durationMinutes: 22 },
          { title: { id: "Normalisasi", en: "Normalization" }, durationMinutes: 18 },
          {
            title: { id: "Soft delete dan audit", en: "Soft delete and audit" },
            durationMinutes: 19,
          },
        ],
      },
      {
        title: { id: "Query", en: "Queries" },
        lessons: [
          { title: { id: "Query builder", en: "Query builder" }, durationMinutes: 21 },
          { title: { id: "Indeks", en: "Indexes" }, durationMinutes: 20 },
          { title: { id: "Pagination", en: "Pagination" }, durationMinutes: 17 },
          { title: { id: "Query lambat", en: "Slow queries" }, durationMinutes: 23 },
        ],
      },
      {
        title: { id: "Transaksi", en: "Transactions" },
        lessons: [
          { title: { id: "Atomic operation", en: "Atomic operations" }, durationMinutes: 19 },
          { title: { id: "Locking", en: "Locking" }, durationMinutes: 21 },
          { title: { id: "Migrasi", en: "Migrations" }, durationMinutes: 22 },
          { title: { id: "Studi kasus", en: "Case study" }, durationMinutes: 24 },
        ],
      },
    ],
  },
  {
    slug: "auth-rbac-nestjs",
    title: {
      id: "Authentication dan RBAC dengan NestJS",
      en: "Authentication and RBAC with NestJS",
    },
    shortDescription: {
      id: "Bangun sesi, peran, izin, dan perlindungan API yang dapat diuji.",
      en: "Build sessions, roles, permissions, and testable API protection.",
    },
    description: {
      id: "Kursus lanjutan tentang autentikasi cookie, rotasi refresh token, CSRF, permission policy, dan audit. Anda akan menguji jalur serangan yang paling sering terlewat.",
      en: "An advanced course on cookie authentication, refresh rotation, CSRF, permission policies, and audit. You will test the attack paths that are most often missed.",
    },
    difficulty: "ADVANCED",
    estimatedDurationMinutes: 480,
    learningOutcomes: {
      id: [
        "Merancang sesi dengan cookie HttpOnly dan rotasi refresh.",
        "Menerapkan permission policy, bukan perbandingan nama role.",
        "Melindungi mutasi dengan CSRF dan rate limit.",
        "Mengaudit akses dan menguji jalur serangan.",
      ],
      en: [
        "Design sessions with HttpOnly cookies and refresh rotation.",
        "Apply permission policies instead of role-name comparisons.",
        "Protect mutations with CSRF and rate limits.",
        "Audit access and test attack paths.",
      ],
    },
    prerequisites: {
      id: ["NestJS dasar", "HTTP dan cookie", "TypeScript"],
      en: ["Basic NestJS", "HTTP and cookies", "TypeScript"],
    },
    instructorBio: {
      id: "Tim kurikulum Academy yang fokus pada keamanan aplikasi.",
      en: "The Academy curriculum team focused on application security.",
    },
    price: 299000,
    status: "PUBLISHED",
    featured: false,
    finalProjectEnabled: true,
    certificateEnabled: true,
    publishedAt: "2026-07-30",
    categories: ["backend"],
    sections: [
      {
        title: { id: "Identitas", en: "Identity" },
        lessons: [
          {
            title: { id: "Registrasi dan login", en: "Registration and login" },
            durationMinutes: 22,
            preview: true,
          },
          { title: { id: "Password hashing", en: "Password hashing" }, durationMinutes: 20 },
          { title: { id: "Email verification", en: "Email verification" }, durationMinutes: 18 },
          { title: { id: "Reset password", en: "Password reset" }, durationMinutes: 21 },
        ],
      },
      {
        title: { id: "Otorisasi", en: "Authorization" },
        lessons: [
          { title: { id: "Permission policy", en: "Permission policies" }, durationMinutes: 24 },
          { title: { id: "Ownership", en: "Ownership" }, durationMinutes: 19 },
          {
            title: { id: "Guard dan decorator", en: "Guards and decorators" },
            durationMinutes: 20,
          },
          { title: { id: "Audit akses", en: "Access audit" }, durationMinutes: 18 },
        ],
      },
      {
        title: { id: "Sesi", en: "Sessions" },
        lessons: [
          { title: { id: "Refresh rotation", en: "Refresh rotation" }, durationMinutes: 23 },
          { title: { id: "Reuse detection", en: "Reuse detection" }, durationMinutes: 21 },
          { title: { id: "CSRF", en: "CSRF" }, durationMinutes: 19 },
          { title: { id: "Pengujian keamanan", en: "Security testing" }, durationMinutes: 25 },
        ],
      },
    ],
  },
  {
    slug: "docker-deployment",
    title: {
      id: "Docker dan Deployment untuk Developer",
      en: "Docker and Deployment for Developers",
    },
    shortDescription: {
      id: "Bawa aplikasi dari laptop ke server dengan proses yang dapat diulang.",
      en: "Take an application from laptop to server with a repeatable process.",
    },
    description: {
      id: "Pelajari image, container, compose, environment, volume, dan deployment. Fokus pada reproducibility, bukan sekadar perintah yang berhasil sekali.",
      en: "Learn images, containers, compose, environment, volumes, and deployment. Focus on reproducibility, not commands that happened to work once.",
    },
    difficulty: "INTERMEDIATE",
    estimatedDurationMinutes: 390,
    learningOutcomes: {
      id: [
        "Membuat image yang kecil dan dapat diulang.",
        "Menjalankan layanan lokal dengan compose.",
        "Mengelola environment dan volume dengan aman.",
        "Menyiapkan deployment dan rollback dasar.",
      ],
      en: [
        "Build small, repeatable images.",
        "Run local services with compose.",
        "Manage environments and volumes safely.",
        "Prepare a basic deployment and rollback.",
      ],
    },
    prerequisites: {
      id: ["Terminal", "Dasar jaringan", "Git"],
      en: ["Terminal", "Networking basics", "Git"],
    },
    instructorBio: {
      id: "Tim kurikulum Academy yang mengelola deployment produk.",
      en: "The Academy curriculum team managing product deployments.",
    },
    price: 249000,
    status: "PUBLISHED",
    featured: false,
    finalProjectEnabled: true,
    certificateEnabled: true,
    publishedAt: "2026-07-10",
    categories: ["devops"],
    sections: [
      {
        title: { id: "Image", en: "Images" },
        lessons: [
          { title: { id: "Dockerfile", en: "Dockerfile" }, durationMinutes: 21, preview: true },
          { title: { id: "Layer dan cache", en: "Layers and cache" }, durationMinutes: 19 },
          { title: { id: "Multi-stage build", en: "Multi-stage builds" }, durationMinutes: 22 },
          { title: { id: "Image security", en: "Image security" }, durationMinutes: 20 },
        ],
      },
      {
        title: { id: "Compose", en: "Compose" },
        lessons: [
          {
            title: { id: "Service dan network", en: "Services and networks" },
            durationMinutes: 18,
          },
          { title: { id: "Environment", en: "Environment" }, durationMinutes: 17 },
          { title: { id: "Volume", en: "Volumes" }, durationMinutes: 19 },
          { title: { id: "Healthcheck", en: "Healthchecks" }, durationMinutes: 20 },
        ],
      },
      {
        title: { id: "Deploy", en: "Deploy" },
        lessons: [
          { title: { id: "Registry", en: "Registry" }, durationMinutes: 18 },
          { title: { id: "Server setup", en: "Server setup" }, durationMinutes: 22 },
          { title: { id: "Rollback", en: "Rollback" }, durationMinutes: 20 },
          { title: { id: "Observability", en: "Observability" }, durationMinutes: 21 },
        ],
      },
    ],
  },
  {
    slug: "testing-web-apps",
    title: {
      id: "Testing Web Apps dengan Vitest dan Playwright",
      en: "Testing Web Apps with Vitest and Playwright",
    },
    shortDescription: {
      id: "Uji perilaku, bukan implementasi, dari unit sampai browser.",
      en: "Test behavior, not implementation, from unit to browser.",
    },
    description: {
      id: "Bangun piramida test yang berguna: unit untuk logika, komponen untuk interaksi, dan Playwright untuk alur pengguna. Termasuk fixture, mocking, dan CI.",
      en: "Build a useful test pyramid: unit tests for logic, component tests for interaction, and Playwright for user flows. Includes fixtures, mocking, and CI.",
    },
    difficulty: "INTERMEDIATE",
    estimatedDurationMinutes: 375,
    learningOutcomes: {
      id: [
        "Memilih level test yang tepat.",
        "Menulis test yang stabil dan mudah dibaca.",
        "Menguji aksesibilitas dan keyboard.",
        "Menjalankan test di CI tanpa flaky.",
      ],
      en: [
        "Choose the right test level.",
        "Write stable, readable tests.",
        "Test accessibility and keyboard use.",
        "Run tests in CI without flakiness.",
      ],
    },
    prerequisites: {
      id: ["React dasar", "JavaScript modern"],
      en: ["React fundamentals", "Modern JavaScript"],
    },
    instructorBio: {
      id: "Tim kurikulum Academy yang menguji aplikasi web setiap hari.",
      en: "The Academy curriculum team testing web applications every day.",
    },
    price: 219000,
    status: "PUBLISHED",
    featured: false,
    finalProjectEnabled: true,
    certificateEnabled: true,
    publishedAt: "2026-06-22",
    categories: ["frontend", "devops"],
    sections: [
      {
        title: { id: "Unit", en: "Unit" },
        lessons: [
          {
            title: { id: "Test perilaku", en: "Behavior tests" },
            durationMinutes: 19,
            preview: true,
          },
          {
            title: { id: "Fixture dan factory", en: "Fixtures and factories" },
            durationMinutes: 18,
          },
          { title: { id: "Mock yang jujur", en: "Honest mocks" }, durationMinutes: 21 },
          { title: { id: "Coverage", en: "Coverage" }, durationMinutes: 17 },
        ],
      },
      {
        title: { id: "Integration", en: "Integration" },
        lessons: [
          { title: { id: "Testing Library", en: "Testing Library" }, durationMinutes: 22 },
          { title: { id: "Form dan error", en: "Forms and errors" }, durationMinutes: 20 },
          { title: { id: "Keyboard", en: "Keyboard" }, durationMinutes: 19 },
          { title: { id: "Axe", en: "Axe" }, durationMinutes: 21 },
        ],
      },
      {
        title: { id: "E2E", en: "E2E" },
        lessons: [
          { title: { id: "Alur pengguna", en: "User flows" }, durationMinutes: 23 },
          { title: { id: "Fixture server", en: "Server fixtures" }, durationMinutes: 20 },
          { title: { id: "Browser matrix", en: "Browser matrix" }, durationMinutes: 18 },
          { title: { id: "CI yang stabil", en: "Stable CI" }, durationMinutes: 22 },
        ],
      },
    ],
  },
  {
    slug: "data-visualization",
    title: { id: "Data Visualization untuk Dashboard", en: "Data Visualization for Dashboards" },
    shortDescription: {
      id: "Ubah data menjadi keputusan dengan chart yang jujur dan terbaca.",
      en: "Turn data into decisions with honest, readable charts.",
    },
    description: {
      id: "Belajar memilih chart, menyusun hierarki data, dan menulis label yang membantu. Fokus pada pertanyaan yang dijawab dashboard, bukan dekorasi visual.",
      en: "Learn to choose charts, structure data hierarchy, and write labels that help. Focus on the question a dashboard answers, not visual decoration.",
    },
    difficulty: "INTERMEDIATE",
    estimatedDurationMinutes: 330,
    learningOutcomes: {
      id: [
        "Memilih chart berdasarkan pertanyaan pengguna.",
        "Menyusun hierarki dan label yang jelas.",
        "Menangani data kosong dan error.",
        "Membuat dashboard yang aksesibel.",
      ],
      en: [
        "Choose charts based on the user's question.",
        "Structure clear hierarchy and labels.",
        "Handle empty and error data.",
        "Build accessible dashboards.",
      ],
    },
    prerequisites: {
      id: ["JavaScript dasar", "Dasar data"],
      en: ["Basic JavaScript", "Data fundamentals"],
    },
    instructorBio: {
      id: "Tim kurikulum Academy yang membangun dashboard produk.",
      en: "The Academy curriculum team building product dashboards.",
    },
    price: 259000,
    status: "PUBLISHED",
    featured: false,
    finalProjectEnabled: true,
    certificateEnabled: true,
    publishedAt: "2026-06-05",
    categories: ["data", "frontend"],
    sections: [
      {
        title: { id: "Data", en: "Data" },
        lessons: [
          {
            title: { id: "Pertanyaan sebelum chart", en: "Question before chart" },
            durationMinutes: 18,
            preview: true,
          },
          { title: { id: "Tipe data", en: "Data types" }, durationMinutes: 17 },
          { title: { id: "Agregasi", en: "Aggregation" }, durationMinutes: 21 },
          { title: { id: "Data kosong", en: "Empty data" }, durationMinutes: 19 },
        ],
      },
      {
        title: { id: "Chart", en: "Charts" },
        lessons: [
          { title: { id: "Bar dan line", en: "Bars and lines" }, durationMinutes: 22 },
          { title: { id: "Skala dan axis", en: "Scales and axes" }, durationMinutes: 20 },
          { title: { id: "Warna dan kontras", en: "Color and contrast" }, durationMinutes: 18 },
          { title: { id: "Label langsung", en: "Direct labels" }, durationMinutes: 17 },
        ],
      },
      {
        title: { id: "Dashboard", en: "Dashboard" },
        lessons: [
          { title: { id: "Hierarki metrik", en: "Metric hierarchy" }, durationMinutes: 21 },
          { title: { id: "Filter dan state", en: "Filters and state" }, durationMinutes: 19 },
          { title: { id: "Aksesibilitas", en: "Accessibility" }, durationMinutes: 22 },
          { title: { id: "Studi kasus", en: "Case study" }, durationMinutes: 24 },
        ],
      },
    ],
  },
  {
    slug: "ai-assisted-development",
    title: { id: "AI-Assisted Development Workflow", en: "AI-Assisted Development Workflow" },
    shortDescription: {
      id: "Gunakan AI untuk mempercepat kerja tanpa menyerahkan kendali kualitas.",
      en: "Use AI to speed up work without giving up quality control.",
    },
    description: {
      id: "Kursus draft tentang prompt, review, dan batas aman penggunaan AI dalam pengembangan produk. Menekankan verifikasi, bukan klaim otomatisasi.",
      en: "A draft course on prompts, review, and safe boundaries for AI in product development. It emphasizes verification, not automation claims.",
    },
    difficulty: "BEGINNER",
    estimatedDurationMinutes: 240,
    learningOutcomes: {
      id: [
        "Menyusun prompt yang spesifik",
        "Mereview output AI",
        "Menjaga batas keamanan",
        "Memutuskan kapan verifikasi manual diperlukan",
      ],
      en: [
        "Write specific prompts",
        "Review AI output",
        "Keep security boundaries",
        "Decide when manual verification is required",
      ],
    },
    prerequisites: {
      id: ["Pengalaman coding dasar", "Dasar Git"],
      en: ["Basic coding experience", "Git basics"],
    },
    instructorBio: {
      id: "Tim kurikulum Academy yang menguji alur kerja AI secara internal.",
      en: "The Academy curriculum team testing AI workflows internally.",
    },
    price: 149000,
    status: "DRAFT",
    featured: false,
    finalProjectEnabled: false,
    certificateEnabled: false,
    publishedAt: null,
    categories: ["frontend"],
    sections: [
      {
        title: { id: "Prompt", en: "Prompts" },
        lessons: [
          { title: { id: "Konteks", en: "Context" }, durationMinutes: 16, preview: true },
          { title: { id: "Batasan", en: "Constraints" }, durationMinutes: 18 },
          { title: { id: "Contoh", en: "Examples" }, durationMinutes: 17 },
          { title: { id: "Iterasi", en: "Iteration" }, durationMinutes: 19 },
        ],
      },
      {
        title: { id: "Review", en: "Review" },
        lessons: [
          { title: { id: "Membaca diff", en: "Reading diffs" }, durationMinutes: 20 },
          { title: { id: "Test pertama", en: "Test first" }, durationMinutes: 18 },
          { title: { id: "Keamanan", en: "Security" }, durationMinutes: 21 },
          { title: { id: "Batas otomatisasi", en: "Automation limits" }, durationMinutes: 17 },
        ],
      },
      {
        title: { id: "Workflow", en: "Workflow" },
        lessons: [
          { title: { id: "Rencana", en: "Planning" }, durationMinutes: 18 },
          { title: { id: "Eksekusi", en: "Execution" }, durationMinutes: 20 },
          { title: { id: "Verifikasi", en: "Verification" }, durationMinutes: 19 },
          { title: { id: "Retrospektif", en: "Retrospective" }, durationMinutes: 16 },
        ],
      },
    ],
  },
  {
    slug: "devops-foundations",
    title: {
      id: "DevOps Foundations: CI/CD dan Observability",
      en: "DevOps Foundations: CI/CD and Observability",
    },
    shortDescription: {
      id: "Dasar pipeline, environment, log, dan alert yang dapat dipercaya.",
      en: "Foundations for trustworthy pipelines, environments, logs, and alerts.",
    },
    description: {
      id: "Kursus arsip tentang dasar CI/CD, environment, observability, dan incident response. Materi dipertahankan sebagai referensi, tetapi tidak lagi menerima pembaruan.",
      en: "An archived course on CI/CD, environments, observability, and incident response. The material remains as reference but is no longer updated.",
    },
    difficulty: "BEGINNER",
    estimatedDurationMinutes: 300,
    learningOutcomes: {
      id: [
        "Menyusun pipeline dasar",
        "Membaca log",
        "Menyiapkan alert",
        "Menulis runbook untuk gangguan umum",
      ],
      en: [
        "Build a basic pipeline",
        "Read logs",
        "Set up alerts",
        "Write a runbook for common incidents",
      ],
    },
    prerequisites: {
      id: ["Git dasar", "Terminal"],
      en: ["Basic Git", "Terminal"],
    },
    instructorBio: {
      id: "Tim kurikulum Academy yang mengelola operasi produk.",
      en: "The Academy curriculum team managing product operations.",
    },
    price: 189000,
    status: "ARCHIVED",
    featured: false,
    finalProjectEnabled: false,
    certificateEnabled: true,
    publishedAt: "2026-04-10",
    categories: ["devops"],
    sections: [
      {
        title: { id: "CI", en: "CI" },
        lessons: [
          {
            title: { id: "Pipeline dasar", en: "Basic pipeline" },
            durationMinutes: 18,
            preview: true,
          },
          { title: { id: "Build dan test", en: "Build and test" }, durationMinutes: 20 },
          { title: { id: "Artefak", en: "Artifacts" }, durationMinutes: 17 },
          { title: { id: "Cache", en: "Caching" }, durationMinutes: 16 },
        ],
      },
      {
        title: { id: "Observability", en: "Observability" },
        lessons: [
          { title: { id: "Log", en: "Logs" }, durationMinutes: 19 },
          { title: { id: "Metric", en: "Metrics" }, durationMinutes: 18 },
          { title: { id: "Trace", en: "Traces" }, durationMinutes: 20 },
          { title: { id: "Alert", en: "Alerts" }, durationMinutes: 17 },
        ],
      },
      {
        title: { id: "Incident", en: "Incident" },
        lessons: [
          { title: { id: "Runbook", en: "Runbook" }, durationMinutes: 18 },
          { title: { id: "Rollback", en: "Rollback" }, durationMinutes: 19 },
          { title: { id: "Postmortem", en: "Postmortem" }, durationMinutes: 21 },
          { title: { id: "Studi kasus", en: "Case study" }, durationMinutes: 22 },
        ],
      },
    ],
  },
];

function buildSections(seed: CourseSeed, language: CourseLanguage): CourseSection[] {
  return seed.sections.map((section, sectionIndex) => ({
    id: `${seed.slug}-section-${sectionIndex + 1}`,
    title: section.title[language],
    description: section.description?.[language] ?? null,
    position: sectionIndex,
    lessons: section.lessons.map((lesson, lessonIndex) =>
      buildLesson(seed, lesson, language, sectionIndex, lessonIndex),
    ),
  }));
}

function buildLesson(
  seed: CourseSeed,
  lesson: LessonSeed,
  language: CourseLanguage,
  sectionIndex: number,
  lessonIndex: number,
): CourseLesson {
  const lessonNumber = sectionIndex * 4 + lessonIndex + 1;

  return {
    id: `${seed.slug}-lesson-${lessonNumber}`,
    title: lesson.title[language],
    description: null,
    contentType: lesson.contentType ?? (lessonIndex === 3 ? "RICH_TEXT" : "YOUTUBE_VIDEO"),
    videoReference: null,
    richTextBody: null,
    durationMinutes: lesson.durationMinutes,
    required: lesson.required ?? true,
    preview: lesson.preview ?? false,
    position: lessonIndex,
    status: seed.status === "DRAFT" ? "DRAFT" : "PUBLISHED",
  };
}

function buildCourse(seed: CourseSeed, language: CourseLanguage): Course {
  return {
    id: seed.slug,
    slug: seed.slug,
    title: seed.title[language],
    shortDescription: seed.shortDescription[language],
    description: seed.description[language],
    difficulty: seed.difficulty,
    language,
    estimatedDurationMinutes: seed.estimatedDurationMinutes,
    learningOutcomes: seed.learningOutcomes[language],
    prerequisites: seed.prerequisites[language],
    instructor: {
      name: language === "id" ? "Tim Academy" : "Academy Team",
      bio: seed.instructorBio[language],
      avatarKey: null,
    },
    price: seed.price,
    discountPrice: seed.discountPrice ?? null,
    currency: "IDR",
    status: seed.status,
    featured: seed.featured,
    finalProjectEnabled: seed.finalProjectEnabled,
    certificateEnabled: seed.certificateEnabled,
    publishedAt: seed.publishedAt ?? null,
    sections: buildSections(seed, language),
    categories: seed.categories,
  };
}

export const courseFixtures: Record<CourseLanguage, Course[]> = {
  id: seeds.map((seed) => buildCourse(seed, "id")),
  en: seeds.map((seed) => buildCourse(seed, "en")),
};
