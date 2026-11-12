# UI/UX Guidelines — RumahKodingku Academy

> **Document type:** Product interface and interaction guidelines  
> **Version:** 1.0.0  
> **Status:** Baseline  
> **Applies to:** Public, USER, and ADMIN experiences  
> **Last updated:** 2026-11-12

---

## 1. Purpose

Dokumen ini menjelaskan bagaimana prinsip dan design system diterapkan dalam pengalaman nyata. Dokumen ini menjadi panduan untuk desain halaman, alur pengguna, interaksi, state, responsivitas, aksesibilitas, dan handoff implementasi.

Jika ada konflik:

1. Product decisions dan kebijakan yang telah disetujui menjadi sumber kebenaran.
2. Design brief menjelaskan tujuan dan ruang lingkup.
3. Design direction menjelaskan arah visual.
4. Design system mendefinisikan token dan komponen.
5. Dokumen ini menjelaskan penerapan UX dan perilaku UI.

Jangan membuat perilaku produk baru hanya berdasarkan asumsi visual.

## 2. Global UX Rules

- Setiap halaman memiliki satu tujuan utama yang jelas.
- Primary action harus spesifik dan mudah ditemukan.
- Informasi penting tidak boleh hanya tersedia melalui hover.
- Status sistem harus terlihat dan menggunakan istilah konsisten.
- Berikan feedback setelah tindakan pengguna.
- Pertahankan input ketika terjadi kesalahan yang dapat diperbaiki.
- Gunakan konfirmasi untuk aksi destruktif atau berdampak besar.
- Jangan membuat pengguna menebak apakah pembayaran, enrollment, submission, atau sertifikat berhasil.
- Hindari dead-end; setiap empty/error state harus menawarkan langkah pemulihan bila memungkinkan.
- UI harus tetap usable pada keyboard, touch, zoom, dan screen reader.

## 3. Navigation and Information Architecture

### 3.1 Public navigation

Tujuan: membantu pengunjung memahami Academy dan menemukan kursus.

Rekomendasi item:

- Beranda
- Kursus
- Roadmap
- Tentang
- Login / Akun
- CTA utama yang sesuai status pengguna

Jangan menampilkan terlalu banyak menu tingkat pertama. Gunakan navigasi sekunder untuk halaman kebijakan dan informasi tambahan.

### 3.2 USER navigation

Navigasi harus berorientasi pada aktivitas belajar:

- Dashboard
- Kursus saya
- Roadmap
- Sertifikat
- Riwayat pembelian
- Profil dan preferensi

Pada mobile, gunakan drawer atau pola navigasi ringkas. Pastikan pengguna tetap mengetahui lokasi saat berada di dalam course player.

### 3.3 ADMIN navigation

Kelompokkan berdasarkan pekerjaan:

- Overview
- Learning content: courses, sections, lessons, quizzes, roadmaps
- Learners: users, enrollments, project reviews
- Commerce: orders, payments, refund requests
- Community: discussions, lesson Q&A
- Credentials: certificates
- Settings

Navigasi ADMIN tidak boleh bercampur dengan navigasi USER tanpa penanda konteks.

## 4. Page Guidelines

### 4.1 Landing page

**Primary goal:** menjelaskan nilai Academy dan mengarahkan pengunjung ke kursus.

Urutan konten yang disarankan:

1. Hero: value proposition, supporting statement, primary CTA.
2. Penjelasan cara belajar.
3. Kategori atau pilihan kursus yang benar-benar tersedia.
4. Contoh pengalaman belajar atau proyek.
5. Penjelasan fitur/keunggulan yang dapat dibuktikan.
6. Roadmap atau jalur belajar.
7. FAQ.
8. CTA penutup dan footer.

UX rules:

- Gunakan headline yang konkret.
- Hindari klaim absolut atau hasil yang tidak dapat dijamin.
- CTA harus mengarah ke tujuan yang benar.
- Jangan menampilkan testimoni, rating, atau jumlah peserta fiktif.
- Informasi legal dan kebijakan mudah ditemukan.

### 4.2 Course catalog

**Primary goal:** membantu pengguna menemukan kursus relevan.

Elemen:

- Page title dan intro singkat.
- Search.
- Filter yang relevan dan benar-benar didukung data.
- Sorting bila tersedia.
- Course list/grid.
- Pagination atau load-more sesuai arsitektur.

Course card sebaiknya memuat:

- Judul.
- Ringkasan singkat.
- Level jika tersedia.
- Harga jika tersedia.
- Status akses untuk pengguna login.
- CTA yang sesuai.

States:

- Loading: skeleton yang menyerupai struktur card.
- Empty: jelaskan hasil tidak ditemukan dan sediakan reset filter.
- Error: jelaskan kegagalan memuat dan tombol coba lagi.
- No published courses: berikan pesan yang jujur, bukan course placeholder palsu.

### 4.3 Course detail

**Primary goal:** membantu calon peserta mengambil keputusan pembelian secara sadar.

Urutan informasi:

1. Judul dan ringkasan.
2. Outcome/kompetensi yang dituju.
3. Level dan prasyarat.
4. Kurikulum.
5. Format materi dan proyek akhir.
6. Persyaratan sertifikat.
7. Harga dan ketentuan lifetime access.
8. FAQ/kebijakan terkait.
9. CTA pembelian.

Rules:

- Jangan menyembunyikan harga atau syarat penting.
- Jelaskan bahwa pembelian berlaku untuk kursus individual.
- Hindari copy yang menyiratkan roadmap membuka seluruh kursus.
- Untuk pengguna yang sudah memiliki akses, ganti CTA beli dengan “Mulai belajar” atau “Lanjutkan belajar”.
- Untuk kursus yang tidak tersedia, tampilkan status dan alasan yang benar.

### 4.4 Authentication

- Sediakan label dan instruksi yang jelas.
- Bedakan login dan registrasi.
- Berikan validasi inline.
- Jangan mengungkap apakah suatu email terdaftar pada konteks yang dapat memicu enumerasi akun.
- Tampilkan feedback yang aman untuk reset password.
- Jelaskan kesalahan autentikasi tanpa membocorkan detail sensitif.
- Sediakan loading state dan cegah double-submit.

### 4.5 Learner dashboard

**Primary goal:** membuat peserta tahu tindakan belajar berikutnya.

Urutan prioritas:

1. Greeting/konteks singkat.
2. Continue learning.
3. Kursus aktif dan progres.
4. Proyek yang menunggu tindakan/review.
5. Roadmap.
6. Sertifikat terbaru.
7. Aktivitas atau diskusi relevan bila tersedia.

Rules:

- Jangan memenuhi dashboard dengan statistik vanity.
- Progres harus menjelaskan denominator atau konteksnya.
- “Lanjutkan belajar” harus menuju lesson yang tepat.
- Jika belum membeli kursus, tampilkan empty state yang mengarahkan ke katalog.
- Jika proyek menunggu review, jelaskan bahwa peserta tidak perlu mengirim ulang kecuali diminta.

### 4.6 Learning player

**Primary goal:** mendukung konsumsi materi dan penyelesaian lesson.

Layout desktop:

- Area materi utama.
- Sidebar kurikulum/lesson.
- Informasi progres dan navigasi lesson.
- Diskusi/Q&A sebagai area sekunder.

Layout mobile:

- Materi menjadi fokus.
- Kurikulum dapat dibuka sebagai drawer/accordion.
- Kontrol navigasi lesson mudah dijangkau.
- Jangan memaksa pengguna melakukan horizontal scroll.

Content behavior:

- Video YouTube: sediakan fallback jika embed tidak dapat dimuat.
- Rich text: dukung heading, list, link, image, quote, code block, dan tabel bila renderer mendukung.
- Code block: mudah dibaca dan dapat disalin jika fitur copy tersedia.
- Link eksternal harus jelas bahwa pengguna akan meninggalkan platform bila relevan.

Progress behavior:

- Jelaskan status lesson: belum dimulai, sedang berjalan, selesai (sesuai state produk).
- Jangan menandai lesson selesai hanya karena halaman dibuka jika aturan produk tidak menyatakan demikian.
- Simpan progres secara andal dan tampilkan feedback ketika tersimpan.
- Navigasi lesson sebelumnya/berikutnya harus konsisten dengan aturan akses.

### 4.7 Quiz

Sebelum mulai:

- Tampilkan instruksi.
- Tampilkan jumlah soal dan aturan percobaan jika ada.
- Jelaskan apakah kuis wajib atau opsional.
- Jelaskan dampak hasil pada progres bila memang berlaku.

Saat mengerjakan:

- Tampilkan nomor/kemajuan soal.
- Sediakan navigasi jawaban jika diizinkan.
- Pertahankan jawaban saat berpindah soal.
- Berikan peringatan sebelum meninggalkan kuis bila ada jawaban belum dikirim.

Setelah submit:

- Tampilkan hasil dan status.
- Jelaskan langkah berikutnya.
- Jangan mengungkap jawaban benar jika kebijakan penilaian tidak mengizinkan.
- Tangani kegagalan submit tanpa menghilangkan jawaban.

Penempatan dan sifat wajib/opsional ditentukan ADMIN. UI harus mencerminkan konfigurasi tersebut.

### 4.8 Final project

Halaman proyek perlu memisahkan:

- Project brief.
- Learning objectives.
- Requirements.
- Rubric/kriteria penilaian jika tersedia.
- Submission form.
- Submission history.
- Review status dan feedback.

Submission:

- Dukung URL GitHub, URL deployment, dan/atau file upload sesuai konfigurasi.
- Validasi URL dan file di client untuk kenyamanan, tetapi server tetap melakukan validasi final.
- Jelaskan batas format/ukuran file berdasarkan konfigurasi aktual.
- Minta konfirmasi sebelum mengirim jika tindakan final.
- Tampilkan nomor/versi submission dan waktu pengiriman.

Version history:

- Setiap resubmission menjadi versi baru.
- Versi terdahulu tidak ditimpa.
- Status dan feedback harus terkait dengan versi yang benar.
- Unlimited resubmission adalah aturan produk saat ini; jangan menampilkan batas percobaan kecuali keputusan berubah.

ADMIN review:

- Sediakan konteks submission dan versi.
- Aksi approve/reject/request revision harus jelas sesuai state machine produk.
- Feedback harus dapat dibaca peserta.
- Aksi review dicatat sesuai kebutuhan audit.

### 4.9 Roadmap

- Tampilkan urutan tahap dengan jelas.
- Setiap tahap mengarah ke detail kursus.
- Bedakan status: belum dimiliki, dimiliki, sedang dipelajari, selesai.
- Jika kursus belum dibeli, tampilkan CTA pembelian individual.
- Jelaskan dengan jelas bahwa roadmap bukan paket akses gratis.
- Jangan mengunci atau membuka akses hanya berdasarkan visual roadmap; hak akses ditentukan backend.

### 4.10 Community and lesson Q&A

- Pisahkan diskusi kursus umum dari pertanyaan yang melekat pada lesson.
- Tampilkan konteks kursus/lesson.
- Gunakan hierarchy thread dan reply yang mudah dipindai.
- Tampilkan waktu dan identitas penulis sesuai kebijakan privasi.
- Sediakan empty state yang mengundang pertanyaan berkualitas.
- Sediakan report/moderation path bila fitur tersedia.
- Tangani konten panjang, link, dan code snippet secara terbaca.
- Jangan menampilkan fitur moderation yang belum diimplementasikan.

### 4.11 Certificates

- Tampilkan status kelayakan.
- Jika belum memenuhi syarat, jelaskan persyaratan yang belum selesai.
- Jika proyek menunggu persetujuan ADMIN, tampilkan status tersebut.
- Jika diterbitkan, tampilkan detail dan tindakan yang tersedia.
- Jangan menampilkan tombol download jika file belum tersedia.
- Jangan menyebut sertifikat terverifikasi publik sebelum sistem verifikasi tersedia.

### 4.12 Orders, payments, and refunds

Payment UX rules:

- Tampilkan ringkasan order sebelum pembayaran.
- Jelaskan nominal dan item pembelian.
- Tampilkan status pembayaran yang berasal dari status server.
- Bedakan `pending`, `paid`, `failed`, `expired`, dan status lain yang benar-benar didukung provider/backend.
- Jangan menganggap redirect sukses sebagai bukti pembayaran.
- Jangan memberikan akses kursus dari transaksi mock/sandbox di lingkungan produksi.
- Jika pembayaran tertunda, jelaskan apa yang perlu dilakukan dan kapan status akan diperbarui.

Refund:

- Kebijakan saat ini: permintaan ditinjau ADMIN secara case-by-case.
- Jangan menjanjikan refund otomatis.
- Tampilkan status permintaan dan keputusan secara jelas.
- Berikan ruang untuk alasan permintaan dan respons ADMIN.
- Jangan menyatakan estimasi waktu jika belum ditetapkan.

Provider onboarding:

- Midtrans merupakan kandidat provider awal, tetapi persetujuan merchant dan penerimaan kategori kursus digital harus dikonfirmasi.
- Jangan menampilkan logo/metode pembayaran sebagai metode aktif sebelum benar-benar tersedia dan dikonfigurasi.

### 4.13 ADMIN overview

- Tampilkan ringkasan yang mendukung keputusan dan pekerjaan.
- Metrik harus memiliki definisi dan periode.
- Hindari angka placeholder yang tampak nyata.
- Tampilkan quick actions hanya untuk pekerjaan yang umum dan aman.
- Sertakan empty state untuk platform baru yang belum memiliki data.

### 4.14 ADMIN course management

- Pisahkan course metadata, curriculum, quiz, project, pricing, publishing.
- Simpan draft dan tampilkan status penyimpanan.
- Validasi field wajib sebelum publish.
- Preview sebagai pengguna bila memungkinkan.
- Berikan peringatan untuk perubahan yang memengaruhi peserta aktif.
- Jangan menghapus konten yang sudah memiliki riwayat pembelajaran tanpa prosedur yang jelas.

### 4.15 ADMIN orders and refund management

- Filter berdasarkan status dan tanggal.
- Tampilkan order ID, user, course, amount, payment status, dan timestamp sesuai izin.
- Bedakan status provider dengan status internal jika keduanya ada.
- Aksi refund harus mengikuti kebijakan dan otorisasi backend.
- Konfirmasi aksi berdampak besar.
- Simpan audit trail untuk tindakan administratif penting.

### 4.16 ADMIN project review

- Tampilkan antrean review dan status.
- Prioritaskan submission tertua atau sesuai kebijakan.
- Buka detail submission dan versi yang benar.
- Sediakan feedback yang terstruktur dan mudah dipahami.
- Konfirmasi sebelum menyetujui/menolak bila tindakan tidak mudah dibatalkan.
- Setelah keputusan, tampilkan hasil dan perubahan status.

## 5. Content Design and Microcopy

### 5.1 Voice and tone

- Jelas, ramah, profesional.
- Menggunakan bahasa Indonesia yang natural dan konsisten.
- Tidak menggurui.
- Tidak membuat janji yang tidak dapat dipastikan.
- Istilah teknis boleh dipertahankan jika lebih dikenal pengguna.

### 5.2 Action labels

Gunakan label yang menyatakan hasil:

- “Mulai belajar”
- “Lanjutkan belajar”
- “Lihat kurikulum”
- “Beli kursus”
- “Kirim jawaban”
- “Kirim proyek”
- “Lihat riwayat pengumpulan”
- “Simpan perubahan”
- “Terbitkan kursus”

Hindari label terlalu umum seperti “Klik di sini” atau “Submit” jika label yang lebih spesifik tersedia.

### 5.3 Error messages

Pola:

1. Jelaskan apa yang terjadi.
2. Jelaskan apa yang dapat dilakukan.
3. Jangan menyalahkan pengguna.

Contoh:

- “Tautan GitHub belum valid. Periksa kembali URL repository lalu coba lagi.”
- “Pembayaran belum terkonfirmasi. Status akan diperbarui setelah sistem menerima konfirmasi dari penyedia pembayaran.”
- “Materi belum dapat dimuat. Periksa koneksi Anda atau coba muat ulang halaman.”

### 5.4 Empty states

Setiap empty state harus menjawab:

- Apa yang kosong?
- Mengapa kondisi ini mungkin terjadi?
- Apa langkah berikutnya?

Contoh:

- Belum ada kursus: “Kursus yang Anda beli akan muncul di sini. Jelajahi katalog untuk menemukan materi yang ingin dipelajari.”
- Belum ada diskusi: “Belum ada diskusi pada kursus ini. Mulai percakapan dengan pertanyaan yang berkaitan dengan materi.”
- Belum ada sertifikat: tampilkan persyaratan yang belum terpenuhi, bukan sekadar “Tidak ada data”.

## 6. Interaction States

Untuk setiap komponen interaktif, desain minimal:

- Default.
- Hover (untuk pointer).
- Focus-visible.
- Active/pressed.
- Disabled.
- Loading.
- Success.
- Error/invalid.
- Empty atau no-result jika relevan.

State tidak boleh hanya dibedakan melalui warna. Gunakan teks, ikon, pola, atau perubahan struktur yang sesuai.

## 7. Forms and Validation

- Gunakan label persisten.
- Tandai field wajib secara konsisten.
- Validasi sedini mungkin tanpa mengganggu.
- Validasi server tetap menjadi sumber kebenaran.
- Letakkan error dekat field terkait.
- Ringkas error form di bagian atas jika form panjang.
- Pertahankan nilai yang sudah diisi ketika terjadi error.
- Jelaskan batas file dan format sebelum upload.
- Hindari meminta data yang tidak diperlukan untuk tugas.

## 8. Responsive Behavior

### Small screens

- Satu kolom untuk konten utama.
- CTA penting mudah dijangkau.
- Navigation menu memiliki label.
- Form menggunakan lebar penuh.
- Hindari tabel kompleks tanpa strategi adaptasi.
- Modal besar berubah menjadi sheet/full-screen jika diperlukan.

### Tablet

- Gunakan dua kolom hanya jika ruang memadai.
- Sidebar dapat dipadatkan atau dijadikan drawer.
- Pertahankan hierarchy desktop tanpa memaksakan density.

### Desktop

- Gunakan grid dan max-width konsisten.
- Sidebar untuk navigasi sekunder yang sering dipakai.
- Learning player dapat menggunakan dua area utama.
- ADMIN dapat memanfaatkan tabel lebar dengan kolom prioritas.

## 9. Accessibility Checklist

### Structure

- [ ] Satu H1 utama per halaman sesuai struktur konten.
- [ ] Heading bertingkat secara logis.
- [ ] Landmark semantik tersedia.
- [ ] Urutan DOM sesuai urutan baca.

### Keyboard

- [ ] Semua kontrol dapat diakses keyboard.
- [ ] Focus indicator terlihat.
- [ ] Tidak ada keyboard trap.
- [ ] Dialog mengelola focus dengan benar.
- [ ] Skip link tersedia untuk halaman panjang bila diperlukan.

### Visual

- [ ] Kontras teks memenuhi WCAG 2.2 AA.
- [ ] Status tidak hanya menggunakan warna.
- [ ] Zoom/reflow tidak menghilangkan fungsi.
- [ ] Target sentuh cukup besar.
- [ ] Konten tetap terbaca di Light dan Dark Mode.

### Forms and feedback

- [ ] Label terhubung dengan input.
- [ ] Error dapat diidentifikasi screen reader.
- [ ] Required state dijelaskan.
- [ ] Loading/success/error diumumkan secara tepat.

### Media and motion

- [ ] Video memiliki caption/transcript bila tersedia.
- [ ] Gambar informatif memiliki alt text.
- [ ] Gambar dekoratif diabaikan oleh assistive technology.
- [ ] Reduced motion dihormati.

## 10. Performance and Perceived Performance

- Gunakan skeleton hanya ketika membantu memahami struktur yang sedang dimuat.
- Hindari layout shift; sediakan ukuran/aspect ratio untuk media.
- Prioritaskan konten utama.
- Tampilkan feedback segera untuk aksi lokal.
- Untuk proses server, gunakan status loading dan cegah double submission.
- Jangan menampilkan success sebelum server mengonfirmasi tindakan yang memerlukan persistensi.
- Sediakan retry yang aman untuk operasi idempotent.

## 11. Security and Trust UX

- Jangan tampilkan data sensitif yang tidak diperlukan.
- Jangan menaruh token, secret, atau informasi autentikasi di UI.
- Jelaskan sesi berakhir dan sediakan jalur login kembali.
- Aksi ADMIN harus sesuai permission.
- Payment state harus berasal dari sumber server yang tervalidasi.
- Upload harus menjelaskan tipe/ukuran yang diizinkan.
- Jangan menampilkan detail error internal atau stack trace kepada pengguna.
- Berikan konfirmasi dan audit context untuk tindakan berisiko.

## 12. Analytics and Usability Validation

Event yang dapat dipertimbangkan:

- `course_catalog_viewed`
- `course_detail_viewed`
- `checkout_started`
- `payment_status_viewed`
- `course_accessed`
- `lesson_started`
- `lesson_completed`
- `quiz_started`
- `quiz_submitted`
- `project_submitted`
- `project_reviewed`
- `certificate_issued`

Event harus memiliki definisi, consent/privacy basis, dan payload minimal. Jangan mengirim data sensitif ke analytics.

Usability test minimum:

- Menemukan kursus dan memahami detailnya.
- Menyelesaikan pembelian sandbox.
- Melanjutkan lesson.
- Menyelesaikan kuis.
- Mengirim dan mengirim ulang proyek.
- Memahami alasan sertifikat belum tersedia.
- ADMIN membuat kursus dan meninjau proyek.
- Mengganti tema dan menggunakan UI pada mobile.

## 13. QA and Release Checklist

### Product behavior

- [ ] Semua CTA mengarah ke tindakan yang benar.
- [ ] Status pembelian tidak disimpulkan dari redirect.
- [ ] Enrollment hanya diberikan setelah verifikasi server.
- [ ] Lifetime access dijelaskan konsisten.
- [ ] Roadmap tidak membuka kursus tanpa pembelian.
- [ ] Resubmission proyek membuat versi baru.
- [ ] Sertifikat hanya diterbitkan setelah semua syarat terpenuhi.

### Visual and interaction

- [ ] Light Mode diperiksa.
- [ ] Dark Mode diperiksa.
- [ ] Mobile, tablet, desktop diperiksa.
- [ ] Loading/empty/error/success/disabled diperiksa.
- [ ] Focus-visible dan keyboard diperiksa.
- [ ] Tidak ada horizontal overflow yang tidak disengaja.

### Content and trust

- [ ] Tidak ada placeholder yang tampak seperti data nyata.
- [ ] Tidak ada testimoni/rating palsu.
- [ ] Harga dan ketentuan akses jelas.
- [ ] Refund disebut case-by-case.
- [ ] Metode pembayaran hanya ditampilkan jika aktif.
- [ ] Kebijakan dan informasi legal dapat ditemukan.

## 14. Definition of UX Ready

Sebuah fitur dinyatakan UX-ready jika:

- Tujuan pengguna dan hasil akhirnya jelas.
- Alur normal dan alternatif telah dirancang.
- State dan feedback telah didefinisikan.
- Responsivitas telah ditentukan.
- Aksesibilitas telah ditinjau.
- Copy dan status konsisten dengan model produk.
- Tidak ada keputusan produk yang disamarkan sebagai detail desain.
- Handoff cukup jelas untuk diimplementasikan tanpa menebak perilaku inti.

## 15. Related Documents

- `design-brief.md`
- `design-direction.md`
- `design-system.md`
