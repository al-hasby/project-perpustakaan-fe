# Informasi Proyek

## Nama Proyek
project-perpustakaan-fe

## Deskripsi Singkat
Frontend aplikasi perpustakaan berbasis Vue 3 dan Vite. Aplikasi ini mendukung manajemen buku, peminjaman, akses e-book, dan laporan untuk peran `admin`, `petugas`, dan `member`.

## Teknologi Utama
- Vue 3
- Vite
- Pinia
- Vue Router
- JavaScript (ES Modules)

## Setup dan Jalankan
1. Pasang dependensi:
   ```sh
   npm install
   ```
2. Jalankan development server:
   ```sh
   npm run dev
   ```
3. Buka browser ke:
   ```text
   http://localhost:5173
   ```
4. Build produksi:
   ```sh
   npm run build
   ```

## Struktur Utama
- `src/main.js`: entry app, pasang Pinia dan router
- `src/App.vue`: layout utama dan `router-view`
- `src/router/index.js`: definisi routing dan guard auth
- `src/stores/auth.js`: state otentikasi dan metode login/logout
- `src/api/`: modul API untuk auth, books, borrow, ebooks, report
- `src/pages/`: halaman aplikasi
- `src/components/`: komponen UI umum dan komponen domain khusus

## Routing dan Akses
Rute penting:
- `/` - HomePage
- `/login` - LoginPage
- `/register` - RegisterPage
- `/books` - BooksPage (auth diperlukan)
- `/borrow` - BorrowPage (auth diperlukan)
- `/ebooks` - EbooksPage (auth + role `member`/`user`)
- `/report` - ReportPage (auth + role `admin`)
- `/profile` - ProfilePage (auth diperlukan)
- `/unauthorized` - UnauthorizedPage
- `/*` - NotFoundPage

Guard auth:
- `guestOnly`: hanya untuk pengguna belum login
- `requiresAuth`: redirect ke `/login` jika belum login
- `roles`: cek role sebelum akses

## Auth dan Fallback Lokal
`src/api/auth.js` mengatur:
- `login(credentials)`
- `register(userData)`
- `logout()`

### Perilaku auth
- Token disimpan di `localStorage` sebagai `token`
- Data user disimpan di `localStorage` sebagai `user`
- Role disimpan di `localStorage` sebagai `role`
- `authStore.isAuthenticated` memeriksa adanya token
- Role backend `user` di-mapping ke `member` di frontend

### Fallback lokal
- `register()` mencoba backend `/auth/register`
- jika backend tidak dapat dihubungi, register menyimpan demo user di `localStorage` (`local_demo_users`)
- `login()` sekarang juga mencoba baca akun dari `localStorage` ketika backend tidak tersedia

## Kontrak Integrasi API (FE-INTEGRATION.md)
Base URL backend lokal:
- `http://localhost:3000`

Header auth:
- `Authorization: Bearer <token>`

### Endpoint auth
- `POST /auth/login`
- `POST /auth/logout`
- `POST /auth/register` (belum tersedia di backend, ada fallback lokal)

### Endpoint buku
- `GET /books`
- `POST /books`
- `PUT /books/:id`
- `DELETE /books/:id`

### Endpoint peminjaman
- `GET /borrow`
- `GET /borrow/:id`
- `POST /borrow`
- `PUT /borrow/:id/approve`
- `PUT /borrow/:id/reject`
- `PUT /borrow/:id/return`
- `DELETE /borrow/:id`

### Endpoint ebook
- `GET /ebooks`
- `GET /ebooks/:id`
- `POST /ebooks`
- `PUT /ebooks/:id`
- `DELETE /ebooks/:id`

### Endpoint laporan
- `GET /reports/dashboard`
- `GET /reports/peminjaman?filter=...`

## Modul API yang Dipakai
- `src/api/index.js`: wrapper fetch dengan base URL dan auth header
- `src/api/auth.js`: auth login/register/logout
- `src/api/books.js`: fetch, tambah, ubah, hapus buku
- `src/api/borrow.js`: fetch dan aksi peminjaman
- `src/api/ebooks.js`: fetch ebook dan akses PDF
- `src/api/report.js`: fetch dashboard dan laporan

## Halaman Utama dan Fitur
- `HomePage.vue`: navigasi fitur dan CTA
- `BooksPage.vue`: daftar buku, detail, tambah/edit/hapus, pinjam
- `BorrowPage.vue`: daftar peminjaman, tambah peminjaman, approve/reject, return
- `EbooksPage.vue`: daftar ebook dan pemilih PDF
- `ReportPage.vue`: dashboard statistik dan tabel keterlambatan/rusak
- `ProfilePage.vue`: informasi akun pengguna

## Fitur Utama
- Autentikasi dan otorisasi dengan peran `admin`, `petugas`, `member`
- Manajemen buku lengkap: lihat, tambahkan, edit, hapus
- Sistem peminjaman buku dengan status `menunggu`, `dipinjam`, `dikembalikan`, `ditolak`
- Approve/reject peminjaman untuk admin
- Proses pengembalian buku dengan kondisi buku
- Akses e-book untuk member dan user
- Laporan admin: dashboard ringkasan, daftar keterlambatan, daftar buku rusak
- Fallback register/login lokal ketika backend tidak tersedia
- Profil pengguna untuk melihat data akun saat login
- Search/filtrasi buku lokal pada halaman buku

## Desain UI / UX
- Layout berbasis `App.vue` dengan `Navbar`, `main` konten, dan `router-view`
- Tampilan halaman menggunakan panel, card, dan grid untuk keterbacaan
- Form input yang konsisten dengan label, placeholder, dan tombol aksi
- Modal detail buku dengan overlay untuk fokus konten
- Sidebar ebook dan viewer PDF untuk pengalaman membaca
- Ringkasan statistik ditampilkan pada cards di halaman buku, pinjam, dan laporan
- Pemakaian status, badge, dan tombol aksi agar alur pengguna jelas
- Komponen responsif sederhana untuk tampilan halaman desktop dan mobile
- Indikator loading/disabled pada aksi submit untuk mencegah klik ganda

## Perbaikan Terbaru
- Ditambahkan halaman `ProfilePage.vue`
- Ditambahkan route `/profile`
- Diperbaiki fallback login lokal agar user register lokal bisa login jika backend tidak tersedia
- Diperbaiki register lokal untuk membuat username lebih konsisten

## Catatan Penting
- Jika backend tidak berjalan, sebagian fitur API tidak berfungsi dan aplikasi hanya menggunakan fallback lokal untuk register/login
- Fitur search/pagination backend belum tersedia, frontend menggunakan filter lokal untuk daftar buku
- Proxy Vite `vite.config.js` sudah disiapkan untuk `/api`, tetapi kode saat ini memakai `API_BASE_URL` langsung

## Cara Verifikasi
1. Jalankan backend di `http://localhost:3000` jika tersedia
2. Jalankan frontend `npm run dev`
3. Buka `/register`, buat akun, lalu `/login`
4. Akses halaman `/books`, `/borrow`, `/ebooks`, `/report` sesuai role

## Lokasi File Penting
- `src/api/auth.js`
- `src/router/index.js`
- `src/stores/auth.js`
- `src/pages/LoginPage.vue`
- `src/pages/RegisterPage.vue`
- `src/pages/books/BooksPage.vue`
- `src/pages/borrow/BorrowPage.vue`
- `src/pages/ebooks/EbooksPage.vue`
- `src/pages/report/ReportPage.vue`
- `src/pages/ProfilePage.vue`
- `src/components/Navbar.vue`
- `FE-INTEGRATION.md`
