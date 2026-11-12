# Design Brief — RumahKodingku Academy

> **Document type:** Product & UX design brief  
> **Version:** 1.0.0  
> **Status:** Baseline  
> **Product:** RumahKodingku Academy  
> **Tagline:** Learn · Build · Grow  
> **Last updated:** 2026-11-12

---

## 1. Executive Summary

RumahKodingku Academy adalah platform pembelajaran online yang berfokus pada pembelajaran keterampilan teknologi dan pemrograman melalui kursus terstruktur, materi pembelajaran, kuis, proyek akhir, roadmap belajar, komunitas, dan sertifikat.

Pengalaman produk harus membantu pengguna bergerak dari menemukan kursus hingga menyelesaikan pembelajaran dan membuktikan kemampuan melalui proyek. Desain harus terasa profesional dan tepercaya seperti produk SaaS modern, tetapi tetap memiliki karakter visual yang ekspresif agar identitas Academy tidak terasa generik.

Arah desain yang menjadi baseline:

- **Modern SaaS Learning Platform**
- **Expressive visual character**, digunakan secara terarah dan tidak mengganggu fokus belajar.
- **Light Mode dan Dark Mode** dengan kualitas desain setara.
- **Academy Blue `#2563EB`** sebagai aksen identitas Academy.
- Identitas visual dan logo resmi RumahKodingku tetap dihormati; warna atau logomark induk tidak boleh diubah sembarangan.

Dokumen ini menetapkan konteks, tujuan, pengguna, kebutuhan, ruang lingkup, dan ukuran keberhasilan desain. Detail visual dijabarkan pada `design-direction.md`, aturan token dan komponen pada `design-system.md`, serta aturan implementasi pengalaman pada `ui-ux-guidelines.md`.

## 2. Product Context

### 2.1 Product vision

Menyediakan pengalaman belajar teknologi yang terstruktur, praktis, mudah diikuti, dan berorientasi pada hasil karya sehingga peserta dapat membangun kompetensi secara bertahap.

### 2.2 Product proposition

RumahKodingku Academy menggabungkan:

1. Kursus individual yang dapat dibeli satu per satu.
2. Akses belajar seumur hidup untuk kursus yang telah dibeli.
3. Materi berupa video YouTube atau konten rich text.
4. Kuis dengan penempatan dan aturan wajib/opsional yang dapat dikonfigurasi ADMIN.
5. Proyek akhir yang dapat dikirim melalui URL repository GitHub, URL deployment, dan/atau unggahan file.
6. Riwayat versi pengumpulan proyek yang tidak ditimpa.
7. Roadmap yang menyusun beberapa kursus dalam urutan belajar; setiap kursus tetap dibeli secara individual.
8. Forum diskusi kursus dan Q&A pada tingkat lesson.
9. Sertifikat otomatis setelah persyaratan kursus terpenuhi dan proyek akhir disetujui ADMIN.

### 2.3 Product principles

- **Learning outcome first:** setiap halaman mendukung kemajuan belajar, bukan sekadar dekorasi.
- **Clarity over cleverness:** navigasi, status, harga, syarat, dan tindakan harus mudah dipahami.
- **Trust by design:** informasi pembelian, akses, progres, dan sertifikat disampaikan secara transparan.
- **Practice matters:** proyek dan hasil karya merupakan bagian penting dari perjalanan belajar.
- **Inclusive by default:** desain responsif, aksesibel, dan mendukung Light serta Dark Mode.
- **Consistent but expressive:** sistem visual konsisten dengan ekspresi visual yang terarah.

## 3. Goals

### 3.1 Business goals

- Membangun persepsi platform edukasi yang kredibel dan profesional.
- Membantu calon peserta memahami manfaat, isi, dan persyaratan kursus.
- Mengurangi hambatan dari penemuan kursus sampai pembelian.
- Mendorong peserta melanjutkan dan menyelesaikan kursus.
- Meningkatkan kepercayaan terhadap proses pembelajaran, penilaian proyek, dan sertifikat.
- Menyediakan antarmuka administrasi yang efisien untuk mengelola konten dan peserta.

### 3.2 User goals

Pengunjung ingin memahami apakah kursus relevan bagi kebutuhannya. Peserta ingin mengetahui apa yang harus dipelajari selanjutnya, melihat progres, mengakses materi dengan nyaman, mengirim proyek, dan memperoleh umpan balik. ADMIN ingin mengelola kursus, materi, kuis, pembelian, peserta, proyek, sertifikat, diskusi, dan refund dengan jelas.

### 3.3 UX goals

- Pengguna baru dapat memahami proposisi Academy tanpa harus menelusuri banyak halaman.
- Informasi penting pada halaman detail kursus mudah ditemukan.
- Peserta dapat melanjutkan lesson terakhir dengan sedikit friksi.
- Status progres, kuis, proyek, dan sertifikat selalu terlihat dan tidak ambigu.
- Pengguna memahami perbedaan antara roadmap dan hak akses pembelian kursus.
- ADMIN dapat menyelesaikan tugas operasional dengan alur yang konsisten dan aman.

## 4. Target Users

### 4.1 Prospective learner

**Kebutuhan**

- Mengetahui topik, tingkat kesulitan, prasyarat, kurikulum, dan hasil belajar.
- Memahami harga, metode pembayaran yang tersedia, dan ketentuan akses.
- Menilai apakah kursus sesuai dengan tujuan belajarnya.

**Risiko/friksi**

- Deskripsi kursus terlalu umum.
- Informasi kurikulum atau prasyarat tersembunyi.
- Ketidakjelasan apakah pembelian memberi akses permanen atau berlangganan.

### 4.2 Enrolled learner

**Kebutuhan**

- Melanjutkan materi dengan cepat.
- Melihat progres dan persyaratan penyelesaian.
- Mengikuti video atau membaca materi dengan nyaman.
- Mengerjakan kuis dan proyek akhir.
- Melihat status review dan riwayat pengumpulan.
- Berpartisipasi dalam diskusi dan Q&A.

**Risiko/friksi**

- Kehilangan konteks lesson terakhir.
- Status tugas tidak jelas.
- Proyek yang dikirim sebelumnya tertimpa.
- Tidak memahami alasan sertifikat belum tersedia.

### 4.3 ADMIN

**Kebutuhan**

- Membuat dan memperbarui kursus, section, lesson, kuis, dan roadmap.
- Mengatur apakah kuis wajib atau opsional.
- Meninjau proyek akhir dan menyetujui/menolak dengan umpan balik.
- Mengelola peserta, order, refund, sertifikat, serta komunitas.
- Memahami status dan riwayat tindakan penting.

**Risiko/friksi**

- Form terlalu panjang tanpa pengelompokan.
- Aksi destruktif tidak memiliki konfirmasi.
- Status pembayaran atau refund tidak dapat dibedakan.
- Tidak ada jejak perubahan atau versi submission.

## 5. Roles and Permissions Context

Produk menggunakan dua role:

| Role    | Fokus pengalaman                                                                                               |
| ------- | -------------------------------------------------------------------------------------------------------------- |
| `USER`  | Menjelajahi kursus, membeli kursus, belajar, mengerjakan kuis, mengirim proyek, berdiskusi, melihat sertifikat |
| `ADMIN` | Mengelola konten, pengguna, transaksi, proyek, sertifikat, diskusi, dan refund                                 |

Desain harus menampilkan navigasi dan tindakan berdasarkan izin. Jangan mengandalkan penyembunyian tombol di frontend sebagai pengganti otorisasi backend.

## 6. Scope

### 6.1 In scope

- Public landing page.
- Course catalog, pencarian/filter, dan course detail.
- Authentication screens.
- Learner dashboard.
- Course learning page/player.
- Lesson content: video dan rich text.
- Quiz flow dan hasil.
- Final project submission, review, feedback, dan version history.
- Learning roadmap.
- Course discussion dan lesson Q&A.
- Certificate view/download entry point.
- ADMIN dashboard dan modul pengelolaan terkait.
- Order/payment status dan refund request/status.
- Light/Dark theme.
- Responsive desktop, tablet, dan mobile behavior.
- Empty, loading, error, success, disabled, dan permission states.

### 6.2 Out of scope for this design baseline

Hal berikut tidak boleh diasumsikan sebagai fitur yang sudah tersedia tanpa keputusan produk terpisah:

- Subscription atau recurring billing.
- Membership yang membuka seluruh kursus.
- Multi-role hierarchy di luar USER dan ADMIN.
- Live class, video conference, atau live streaming internal.
- Native mobile application.
- Gamification kompleks seperti leaderboard global, XP economy, atau virtual currency.
- Automated AI grading untuk proyek akhir.
- Marketplace instruktur pihak ketiga.
- Integrasi komunitas eksternal tertentu yang belum diputuskan.

## 7. Key User Journeys

### 7.1 Discover and purchase a course

1. Pengunjung membuka landing page.
2. Memahami nilai Academy dan menjelajahi katalog.
3. Menggunakan pencarian/filter bila diperlukan.
4. Membuka detail kursus.
5. Memeriksa hasil belajar, kurikulum, prasyarat, harga, dan ketentuan.
6. Login/registrasi jika belum terautentikasi.
7. Membuat order dan menyelesaikan pembayaran.
8. Sistem memverifikasi status pembayaran di sisi server.
9. Kursus muncul pada dashboard setelah pembayaran terkonfirmasi.

**UX requirement:** jangan menyatakan kursus telah terbuka hanya karena pengguna kembali dari halaman pembayaran. Status akses harus mengikuti status transaksi yang tervalidasi.

### 7.2 Learn and continue

1. Peserta membuka dashboard.
2. Melihat kursus aktif dan progres.
3. Memilih aksi “Lanjutkan belajar”.
4. Masuk ke lesson terakhir atau lesson berikutnya yang tersedia.
5. Menonton video atau membaca materi.
6. Menandai/menyelesaikan lesson sesuai aturan produk.
7. Melihat progres yang diperbarui.

### 7.3 Complete quiz

1. Peserta mencapai kuis pada posisi yang ditentukan.
2. Sistem menampilkan instruksi, jumlah soal, dan aturan percobaan bila ada.
3. Peserta menjawab dan mengirim.
4. Sistem menampilkan hasil dan status kelulusan sesuai konfigurasi.
5. Peserta dapat melanjutkan sesuai aturan kursus.

### 7.4 Submit final project

1. Peserta membuka halaman proyek akhir.
2. Membaca brief, kriteria, dan format pengumpulan.
3. Mengirim satu atau lebih dari URL GitHub, URL deployment, dan/atau file.
4. Sistem menyimpan submission sebagai versi baru.
5. ADMIN meninjau dan memberikan status serta feedback.
6. Peserta dapat mengirim ulang tanpa menghapus versi terdahulu.
7. Setelah disetujui, persyaratan proyek dinyatakan terpenuhi.

### 7.5 Earn certificate

1. Peserta menyelesaikan seluruh persyaratan kursus yang dikonfigurasi.
2. Proyek akhir memperoleh persetujuan ADMIN bila diwajibkan.
3. Sistem memvalidasi seluruh kriteria.
4. Sertifikat diterbitkan otomatis.
5. Peserta dapat melihat dan mengakses sertifikat.

### 7.6 Follow a roadmap

1. Peserta membuka roadmap.
2. Melihat urutan kursus dan tujuan tiap tahap.
3. Memahami kursus mana yang sudah dimiliki dan mana yang perlu dibeli.
4. Membuka detail kursus berikutnya.
5. Melakukan pembelian individual jika belum memiliki akses.

**Critical rule:** roadmap menunjukkan urutan rekomendasi/kurikulum, bukan bundel akses gratis. UI harus mengomunikasikan hal ini secara eksplisit.

## 8. Information Architecture

### Public

- Home
- Courses
  - Course detail
- Roadmaps
  - Roadmap detail
- About / Academy information
- Authentication
- Legal and policy pages

### USER

- Dashboard
- My courses
  - Course learning
  - Sections and lessons
  - Quiz
  - Final project
  - Discussion
  - Lesson Q&A
- My roadmaps
- Certificates
- Orders / payment history
- Profile and preferences

### ADMIN

- Overview
- Courses
  - Course editor
  - Sections and lessons
  - Quiz editor
  - Final project configuration
- Roadmaps
- Users and enrollments
- Orders and payments
- Refund requests
- Project reviews
- Certificates
- Discussions and Q&A
- Platform settings

## 9. Content and Data Presentation Requirements

Setiap kursus sebaiknya menampilkan, jika datanya tersedia:

- Judul dan ringkasan.
- Deskripsi dan tujuan pembelajaran.
- Tingkat kesulitan.
- Prasyarat.
- Kurikulum/section/lesson.
- Estimasi durasi bila dapat dipertanggungjawabkan.
- Format materi.
- Harga dan informasi akses lifetime.
- Informasi proyek akhir dan sertifikat.
- Status akses pengguna.

Jangan menampilkan rating, jumlah peserta, testimoni, klaim hasil, atau metrik sosial palsu. Jika data belum tersedia, hilangkan elemen tersebut atau gunakan konten informatif yang benar.

## 10. Design Success Metrics

Metrik berikut adalah rekomendasi pengukuran, bukan baseline yang sudah terbukti. Tetapkan nilai awal setelah analytics tersedia.

| Area             | Indikator                                                                           |
| ---------------- | ----------------------------------------------------------------------------------- |
| Discovery        | Kunjungan katalog, penggunaan filter, course detail views                           |
| Purchase         | Course detail → checkout conversion, checkout completion, payment confirmation rate |
| Activation       | Pembeli yang membuka lesson pertama                                                 |
| Learning         | Lesson completion, return-to-learning rate, course completion                       |
| Assessment       | Quiz completion/pass rate                                                           |
| Project          | Submission rate, review turnaround time, approval rate                              |
| Support          | Pertanyaan berulang terkait akses, pembayaran, dan progres                          |
| Admin efficiency | Waktu menyelesaikan tugas utama, kesalahan input, jumlah langkah                    |
| Quality          | Accessibility issues, UI defects, responsive defects                                |

## 11. Constraints and Dependencies

- Payment provider awal yang dipertimbangkan adalah Midtrans, tetapi persetujuan merchant dan kelayakan kategori penjualan kursus digital masih harus dikonfirmasi. Jangan mendesain copy yang menyatakan integrasi sudah aktif sebelum benar-benar tersedia.
- Selama pengembangan, gunakan sandbox/mock. Status mock atau sandbox tidak boleh membuka enrollment produksi.
- Pembayaran harus diverifikasi melalui proses server-side/webhook; redirect browser bukan sumber kebenaran.
- Penyimpanan file menggunakan local persistent storage sesuai keputusan arsitektur saat ini.
- Konten video menggunakan YouTube; desain perlu menangani embed yang gagal atau tidak tersedia.
- Keputusan teknis detail berada pada dokumen arsitektur/engineering, bukan ditentukan ulang oleh dokumen desain ini.

## 12. Design Deliverables

1. Design brief ini.
2. Design direction.
3. Design system dan token Light/Dark.
4. UI/UX guidelines.
5. Page-level wireframes atau high-fidelity designs.
6. Component inventory dan interaction states.
7. Responsive specifications.
8. Accessibility review.
9. Developer handoff notes.

## 13. Acceptance Criteria

Desain dianggap siap untuk implementasi jika:

- Seluruh halaman utama dan alur kritis telah terpetakan.
- USER dan ADMIN memiliki navigasi yang sesuai.
- Light dan Dark Mode dirancang secara lengkap.
- State loading, empty, error, success, disabled, dan permission telah dipertimbangkan.
- Pembelian, akses lifetime, roadmap, dan refund tidak menimbulkan interpretasi keliru.
- Pengumpulan proyek dan version history dapat dipahami.
- Status sertifikat dan alasan belum terpenuhi jelas.
- Layout responsif dan dapat digunakan dengan keyboard.
- Kontras dan fokus interaktif memenuhi target WCAG 2.2 AA sejauh dapat diuji.
- Tidak ada konten sosial atau klaim produk yang dibuat-buat.

## 14. Open Decisions

Keputusan berikut harus dikonfirmasi melalui product owner sebelum implementasi terkait:

- Detail kebijakan percobaan kuis dan passing score.
- Batas ukuran/jenis file proyek.
- SLA review proyek.
- Format dan identitas visual sertifikat final.
- Aturan refund yang dipublikasikan.
- Metode pembayaran yang benar-benar aktif setelah onboarding provider.
- Apakah pengguna dapat menghapus atau mengedit posting diskusi.
- Kebijakan notifikasi dan preferensi kanal.

Jangan mengarang keputusan untuk mengisi kekosongan. Tandai sebagai `TBD` sampai disetujui.

## 15. Related Documents

- `design-direction.md`
- `design-system.md`
- `ui-ux-guidelines.md`
