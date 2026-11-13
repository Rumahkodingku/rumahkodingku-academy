# Design Direction — RumahKodingku Academy

> **Document type:** Visual & experience direction  
> **Version:** 1.0.0  
> **Status:** Approved baseline  
> **Selected direction:** Editorial Academy — paper/ink, Academy Blue signal, Space Grotesk + Manrope  
> **Last updated:** 2026-11-12

---

## 1. Design Direction Summary

RumahKodingku Academy menggunakan arah **Editorial Academy**: permukaan paper/ink, aksen Academy Blue yang terbatas, tipografi Space Grotesk + Manrope, tombol pill, dan garis hairline. Light Mode dan Dark Mode memiliki kualitas yang setara. Bagian “Modern SaaS” di bawah adalah catatan historis dan tidak lagi menjadi arah implementasi.

Hasil yang dituju adalah platform edukasi yang terlihat modern, profesional, tepercaya, dan mudah digunakan, tetapi tidak dingin atau generik. Ekspresi visual digunakan untuk membangun identitas dan menarik perhatian pada area yang tepat; antarmuka belajar tetap tenang, fokus, dan minim distraksi.

### Direction statement

> A modern, expressive, and trustworthy learning platform that helps people discover practical technology courses, stay focused while learning, and demonstrate their skills through real projects.

## 2. Chosen Design Pillars

### 2.1 Modern SaaS

Karakter:

- Struktur layout rapi dan konsisten.
- Navigasi jelas.
- Informasi disusun dengan hierarki yang kuat.
- Dashboard dan area ADMIN berorientasi pada tugas.
- Komponen reusable dan konsisten.
- Status sistem mudah dipindai.

Penerapan:

- Grid responsif.
- Sidebar atau top navigation sesuai konteks.
- Card digunakan untuk mengelompokkan informasi, bukan membungkus semua elemen.
- Tabel dan filter untuk pengelolaan data.
- Form memiliki label, helper text, validasi, dan feedback.

### 2.2 Expressive Visual Character

Ekspresif berarti memiliki karakter, bukan ramai.

Gunakan:

- Headline yang tegas pada landing page.
- Komposisi hero yang lebih dinamis.
- Ilustrasi, screenshot produk, diagram, atau visual kode yang relevan.
- Aksen warna dan gradient secara selektif.
- Ikon dan micro-interaction yang memiliki tujuan.
- Highlight untuk hasil belajar dan proyek.

Hindari:

- Gradient pada hampir semua permukaan.
- Animasi dekoratif terus-menerus.
- Ornamen yang mengurangi keterbacaan.
- Penggunaan warna biru secara berlebihan.
- Ilustrasi generik yang tidak berhubungan dengan materi.

### 2.3 Focused Learning

Area belajar harus lebih tenang daripada halaman pemasaran.

Prioritas:

- Materi menjadi fokus utama.
- Navigasi section/lesson mudah diakses.
- Progres terlihat tanpa mendominasi.
- Kontrol video dan konten terbaca.
- Aksi berikutnya jelas.
- Diskusi dan Q&A tidak mengganggu pembacaan materi.

### 2.4 Light and Dark Mode

Kedua tema merupakan pengalaman resmi, bukan tema utama dan tema tambahan yang sekadar dibalik.

- Light Mode menjadi tampilan awal yang direkomendasikan untuk halaman publik.
- Dark Mode harus dirancang dengan surface, border, text, dan elevation tersendiri.
- Preferensi OS dapat digunakan saat kunjungan awal.
- Pilihan eksplisit pengguna harus dipertahankan.
- Semua komponen, state, chart, editor, modal, dan embed state perlu diuji pada kedua tema.

## 3. Brand Integration

### 3.1 Brand hierarchy

- Parent brand: RumahKodingku.
- Product/education sub-brand: RumahKodingku Academy.
- Tagline: **Learn · Build · Grow**.
- Academy accent: **`#2563EB`**.

Logo resmi RumahKodingku dan warna brand induk harus dipertahankan. Identitas Academy boleh memiliki sistem pendukung, tetapi tidak boleh mengubah logomark induk secara sembarangan.

### 3.2 Logo usage

- Gunakan aset logo resmi yang disediakan pemilik brand.
- Jangan menggambar ulang, memodifikasi proporsi, memiringkan, atau mengubah warna logo induk tanpa persetujuan.
- Sediakan clear space yang konsisten.
- Pastikan logo memiliki kontras memadai pada latar Light dan Dark.
- Jika versi logo untuk latar gelap belum tersedia, minta aset resmi; jangan membuat versi recolor sendiri.
- Kombinasi wordmark “RumahKodingku Academy” harus menjaga hierarki dan keterbacaan.

### 3.3 Color strategy

Academy Blue `#2563EB` adalah aksen utama Academy. Warna parent brand tetap mengikuti panduan resmi yang diberikan pemilik brand. Warna netral menjadi fondasi mayoritas interface.

Gunakan biru untuk:

- Primary action.
- Link.
- Focus indicator (dengan penyesuaian kontras bila diperlukan).
- Selected state.
- Progress emphasis yang relevan.

Jangan gunakan biru sebagai warna seluruh background atau setiap elemen.

## 4. Visual Language

### 4.1 Layout

- Gunakan container dan grid yang konsisten.
- Berikan whitespace yang cukup untuk mengurangi beban kognitif.
- Gunakan asimetri secara terarah pada hero/marketing sections.
- Gunakan struktur yang lebih sistematis pada dashboard, player, dan ADMIN.
- Hindari nested cards yang berlebihan.
- Pastikan konten utama memiliki prioritas visual yang jelas.

### 4.2 Typography

- Gunakan sans-serif modern untuk antarmuka.
- Heading marketing boleh lebih besar dan ekspresif.
- Body text harus nyaman untuk dibaca dalam durasi panjang.
- Gunakan monospace untuk code snippet, command, dan data teknis.
- Hindari terlalu banyak ukuran dan weight.
- Jangan menggunakan ukuran kecil untuk informasi penting.

### 4.3 Shape and depth

- Radius konsisten dan memiliki fungsi.
- Border halus untuk memisahkan surface.
- Shadow digunakan seperlunya untuk elevation.
- Gunakan gradient hanya pada area yang memang membutuhkan penekanan.
- Hindari glassmorphism sebagai gaya dominan.
- Jangan mengandalkan shadow saja untuk membedakan komponen.

### 4.4 Imagery

Prioritaskan visual yang membantu pemahaman:

- Preview kursus yang nyata.
- Cuplikan kode atau editor.
- Diagram konsep.
- Screenshot produk.
- Hasil proyek peserta dengan izin dan konteks yang benar.

Hindari stok foto generik yang tidak menambah informasi. Jangan menggunakan testimoni, rating, atau hasil peserta fiktif.

### 4.5 Iconography

- Gunakan satu keluarga ikon yang konsisten.
- Ikon harus mudah dikenali dan memiliki ukuran optis konsisten.
- Jangan menggunakan ikon tanpa label untuk tindakan yang tidak universal.
- Ikon dekoratif tidak boleh mengalahkan teks utama.

## 5. Page-Level Direction

### 5.1 Landing page

**Mood:** expressive, confident, welcoming.

- Hero dengan headline jelas, supporting copy singkat, dan CTA utama.
- Visual pendukung harus menjelaskan pengalaman belajar atau hasil proyek.
- Tampilkan kategori/kurus unggulan hanya jika data tersedia.
- Jelaskan alur belajar, manfaat, dan cara kerja Academy.
- Hindari klaim pekerjaan, gaji, atau hasil belajar yang tidak dapat dibuktikan.

### 5.2 Course catalog

**Mood:** organized, discoverable, efficient.

- Course card memiliki hierarchy konsisten.
- Judul, ringkasan, level, harga, dan status akses mudah dipindai.
- Search dan filter tidak mendominasi.
- Sediakan empty state yang membantu pengguna mengubah filter.

### 5.3 Course detail

**Mood:** editorial, informative, trustworthy.

- Judul dan manfaat utama di bagian awal.
- Informasi kurikulum mudah ditemukan.
- Prasyarat, level, materi, proyek, sertifikat, harga, dan ketentuan akses disampaikan jelas.
- CTA pembelian memiliki label yang spesifik.
- Jangan menyamarkan bahwa kursus dibeli satu per satu.

### 5.4 Learner dashboard

**Mood:** supportive, motivating, calm.

- Prioritaskan “Lanjutkan belajar”.
- Tampilkan progres dengan konteks yang jelas.
- Kursus aktif, roadmap, proyek yang menunggu review, dan sertifikat dapat dipindai.
- Hindari dashboard yang dipenuhi metrik tanpa tindakan.

### 5.5 Learning player

**Mood:** focused, minimal, content-first.

- Materi menjadi area terbesar.
- Navigasi lesson tersedia tanpa menutupi konten.
- Progres dan status lesson ringkas.
- Kontrol video dan teks mudah digunakan.
- Sediakan layout yang tetap nyaman pada layar kecil.

### 5.6 Quiz

**Mood:** focused, reassuring.

- Tampilkan instruksi dan aturan sebelum mulai.
- Satu pertanyaan atau kelompok pertanyaan ditampilkan dengan hierarchy jelas.
- Status jawaban dan navigasi mudah dipahami.
- Hasil menjelaskan status kelulusan dan langkah berikutnya.

### 5.7 Final project

**Mood:** practical, structured, accountable.

- Brief, kriteria, dan format submission dipisahkan.
- URL GitHub, URL deployment, dan upload file ditampilkan sebagai opsi sesuai konfigurasi.
- Riwayat versi mudah ditemukan.
- Status review dan feedback ADMIN terlihat jelas.

### 5.8 Roadmap

**Mood:** directional, progressive.

- Tahapan divisualisasikan sebagai urutan yang jelas.
- Status kursus: dimiliki, belum dibeli, sedang dipelajari, selesai.
- Jelaskan bahwa roadmap tidak memberikan akses gratis ke kursus.
- Setiap langkah memiliki CTA sesuai status.

### 5.9 Community

**Mood:** open, readable, respectful.

- Thread dan balasan memiliki hierarchy yang jelas.
- Q&A lesson terkait langsung dengan materi.
- Status pertanyaan/jawaban dapat dikenali.
- Moderation/reporting controls tidak mengganggu diskusi normal.

### 5.10 Certificate

**Mood:** elegant, restrained, credible.

- Sertifikat memiliki tampilan formal dan mudah dibaca.
- Nama peserta, kursus, tanggal, dan identifikasi sertifikat ditampilkan sesuai data.
- Jangan menjanjikan verifikasi publik sebelum fitur verifikasi tersedia.

### 5.11 ADMIN

**Mood:** precise, data-oriented, efficient.

- Navigasi modul konsisten.
- Tabel memiliki filter, sort, pagination, dan empty state yang jelas.
- Status transaksi/proyek/refund menggunakan label yang tidak ambigu.
- Form dikelompokkan berdasarkan tugas.
- Aksi destruktif memerlukan konfirmasi.

## 6. Motion and Interaction Direction

Motion harus membantu orientasi, feedback, dan pemahaman.

Gunakan:

- Hover/focus feedback singkat.
- Transisi state yang halus.
- Progress animation seperlunya.
- Expand/collapse yang mempertahankan konteks.
- Loading skeleton untuk area yang memerlukan waktu.

Hindari:

- Animasi yang menghalangi tugas.
- Parallax berat.
- Auto-playing motion yang tidak dapat dihentikan.
- Motion penting yang tidak memiliki alternatif reduced-motion.

## 7. Responsive Direction

- Mobile-first untuk alur belajar dan pembelian.
- Navigasi desktop dapat berubah menjadi drawer/bottom navigation sesuai kebutuhan.
- Card stack pada layar sempit.
- Tabel ADMIN dapat menggunakan horizontal scroll terkontrol atau tampilan record/card.
- Target sentuh minimal 44×44 CSS px sebagai sasaran desain.
- Jangan menyembunyikan fungsi penting hanya karena viewport kecil.

## 8. Accessibility Direction

Target: **WCAG 2.2 AA**.

- Kontras teks dan kontrol memadai.
- Semua fungsi dapat dioperasikan dengan keyboard.
- Focus indicator terlihat.
- Form memiliki label yang terhubung.
- Error tidak hanya dibedakan dengan warna.
- Heading mengikuti struktur semantik.
- Konten tidak bergantung pada hover.
- Motion menghormati preferensi reduced motion.
- Zoom dan reflow tidak merusak fungsi.

## 9. Do / Don't

| Do                                             | Don't                                   |
| ---------------------------------------------- | --------------------------------------- |
| Gunakan hierarchy yang jelas                   | Membuat semua elemen sama menonjol      |
| Gunakan ekspresi visual pada tempat yang tepat | Membuat seluruh halaman ramai           |
| Prioritaskan fokus pada learning player        | Memenuhi player dengan widget dekoratif |
| Rancang kedua tema secara native               | Sekadar invert warna                    |
| Gunakan data dan testimoni nyata               | Membuat social proof palsu              |
| Gunakan Academy Blue sebagai aksen             | Menjadikan semua elemen biru            |
| Jaga konsistensi komponen                      | Membuat varian tanpa aturan             |
| Berikan feedback state                         | Membiarkan aksi tanpa respons           |

## 10. Design Handoff Requirements

Setiap desain final harus menyertakan:

- Page/frame name yang konsisten.
- Breakpoint atau behavior responsif.
- Theme Light dan Dark.
- Component states.
- Empty/loading/error/success states.
- Interaksi dan navigasi.
- Spacing dan token yang digunakan.
- Catatan aksesibilitas.
- Asset dan sumber gambar yang sah.
- Catatan perilaku yang tidak dapat disimpulkan dari tampilan statis.

## 11. Related Documents

- `design-brief.md`
- `design-system.md`
- `ui-ux-guidelines.md`
