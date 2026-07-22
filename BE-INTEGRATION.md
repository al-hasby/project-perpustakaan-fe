# BE Integration Contract - Web Perpustakaan Frontend

Dokumen ini menjelaskan spesifikasi backend yang harus disesuaikan agar frontend `project-perpustakaan-fe` berjalan dengan baik.

## Base URL

- Local backend: `http://localhost:3000`

## Header Autentikasi

Semua endpoint selain login harus menerima token JWT di header:

```http
Authorization: Bearer <token>
```

## Role Backend

Role yang dipakai frontend:
- `admin`
- `petugas`
- `member`

Catatan:
- Frontend memetakan backend role `user` menjadi `member`.
- Jika backend menyimpan role `user`, frontend akan menerjemahkannya sebagai `member`.

## Endpoint Auth

### Login

```http
POST /auth/login
```

Body:

```json
{
  "username": "admin",
  "password": "123"
}
```

Response yang diharapkan oleh frontend:

```json
{
  "message": "login success",
  "token": "jwt_token"
}
```

Frontend juga dapat menerima object `user` jika tersedia, tetapi saat ini belum dipaksa.
Frontend akan decode JWT untuk mendapatkan `id` dan `role` jika `user` tidak ada.

### Logout

```http
POST /auth/logout
```

Response:

```json
{
  "message": "logout success"
}
```

### Register

```http
POST /auth/register
```

Body:

```json
{
  "name": "User Name",
  "username": "user@example.com",
  "password": "password",
  "role": "user"
}
```

Catatan:
- Frontend mengirim `role: user` saat `member`.
- Backend dapat mengembalikan token dan user object.
- Jika tidak tersedia, frontend mendukung fallback lokal untuk demo.

## Endpoint Books

Semua endpoint books harus memerlukan Bearer token.

### Get all books

```http
GET /books
```

Response:

```json
[
  {
    "id": 1,
    "judul": "Laskar Pelangi",
    "pengarang": "Andrea Hirata",
    "penerbit": "Bentang",
    "tahun_terbit": 2005,
    "kategori": "Novel",
    "stok": 8,
    "pdf_file": "laskar-pelangi.pdf",
    "created_at": "2026-05-19T00:00:00.000Z",
    "updated_at": "2026-05-19T00:00:00.000Z"
  }
]
```

### Get book detail

```http
GET /books/:id
```

### Create book

```http
POST /books
```

Body:

```json
{
  "judul": "Laskar Pelangi",
  "pengarang": "Andrea Hirata",
  "penerbit": "Bentang",
  "tahun_terbit": 2005,
  "kategori": "Novel",
  "stok": 8,
  "pdf_file": "laskar-pelangi.pdf"
}
```

### Update book

```http
PUT /books/:id
```

Body sama seperti create.

### Delete book

```http
DELETE /books/:id
```

## Endpoint Borrow

Frontend menggunakan `/borrow` sebagai prefix.

### Get all borrow

```http
GET /borrow
```

Response bisa berupa array atau object berisi `rows`.

### Create borrow

```http
POST /borrow
```

Body utama:

```json
{
  "borrower_name": "Budi",
  "id_buku": 1,
  "tanggal_pinjam": "2026-05-19",
  "tanggal_kembali": "2026-05-26",
  "kondisi_buku": "aman",
  "member_id": "uuid-opsional"
}
```

Alias diterima:

```json
{
  "book_id": 1,
  "borrow_date": "2026-05-19",
  "due_date": "2026-05-26",
  "book_condition": "aman"
}
```

### Approve borrow

```http
PUT /borrow/:id/approve
```

Body opsional:

```json
{
  "kondisi_buku": "sedikit_rusak"
}
```

### Reject borrow

```http
PUT /borrow/:id/reject
```

### Return book

Backend dapat mendukung salah satu atau kedua endpoint:

```http
PUT /borrow/:id/return
PUT /return/:id
```

Body opsional:

```json
{
  "dikembalikan_pada": "2026-05-25",
  "kondisi_buku": "rusak"
}
```

Alias:

```json
{
  "returned_at": "2026-05-25",
  "book_condition": "rusak"
}
```

### Delete borrow

```http
DELETE /borrow/:id
```

## Endpoint Ebooks

### Get all ebooks

```http
GET /ebooks
```

Response:

```json
[
  {
    "id": "uuid",
    "judul": "Belajar Node.js",
    "penulis": "Jane Doe",
    "penerbit": "Erlangga",
    "tahun_terbit": 2024,
    "kategori": "Teknologi",
    "file_url": "https://example.com/ebook.pdf",
    "created_at": "2026-05-19T00:00:00.000Z",
    "updated_at": "2026-05-19T00:00:00.000Z"
  }
]
```

### Get ebook detail

```http
GET /ebooks/:id
```

### Create ebook

```http
POST /ebooks
```

Body:

```json
{
  "judul": "Belajar Node.js",
  "penulis": "Jane Doe",
  "penerbit": "Erlangga",
  "tahun_terbit": 2024,
  "kategori": "Teknologi",
  "file_url": "https://example.com/ebook.pdf"
}
```

### Update ebook

```http
PUT /ebooks/:id
```

### Delete ebook

```http
DELETE /ebooks/:id
```

## Endpoint Report

### Dashboard

```http
GET /reports/dashboard
```

Response minimal:

```json
{
  "total_books": 50,
  "total_ebooks": 20,
  "total_pinjam": 15,
  "total_kembali": 35,
  "total_rusak": 2
}
```

### Peminjaman report

```http
GET /reports/peminjaman?filter=... 
```

Filter yang relevan:
- `all`
- `keterlambatan`
- `belum_kembali`
- `rusak`

Response:

```json
{
  "filter": "belum_kembali",
  "rows": [
    {
      "id": "uuid",
      "borrower_name": "Budi",
      "judul_buku": "Laskar Pelangi",
      "tanggal_pinjam": "2026-05-19",
      "tanggal_kembali": "2026-05-26",
      "status": "dipinjam",
      "kondisi_buku": "aman",
      "created_at": "2026-05-19T00:00:00.000Z",
      "dikembalikan_pada": null,
      "member_id": "uuid"
    }
  ]
}
```

## Endpoint Users (Opsional)

Frontend tidak secara langsung memanggil endpoint user saat ini, tetapi backend dapat mendukung:

- `GET /users`
- `GET /users/:id`
- `DELETE /users/:id`

## Field Final Untuk Frontend

### Books
- `id`
- `judul`
- `pengarang`
- `penerbit`
- `tahun_terbit`
- `kategori`
- `stok`
- `pdf_file`
- `cover_url`
- `created_at`
- `updated_at`

### Ebooks
- `id`
- `judul`
- `penulis`
- `penerbit`
- `tahun_terbit`
- `kategori`
- `file_url`
- `created_at`
- `updated_at`

### Borrow
- `id`
- `member_id`
- `borrower_name`
- `id_buku`
- `book_id`
- `judul_buku`
- `book_title`
- `tanggal_pinjam`
- `borrow_date`
- `tanggal_kembali`
- `due_date`
- `dikembalikan_pada`
- `returned_at`
- `status`
- `kondisi_buku`
- `book_condition`
- `disetujui_oleh`
- `disetujui_pada`
- `ditolak_oleh`
- `ditolak_pada`
- `created_at`
- `updated_at`

## Gap dan Rekomendasi Backend

### Gap saat ini
- `POST /auth/register` belum tersedia di backend (frontend pakai fallback lokal)
- `GET /books` belum mendukung query `search`, `page`, `limit`
- `GET /reports/dashboard` dan `GET /reports/peminjaman` sudah tersedia, tetapi frontend belum pakai route `/report/overdue` atau `/report/damaged`
- backend belum menerima upload file multipart/form-data untuk buku/ebook
- login saat ini belum selalu mengembalikan object `user`

### Rekomendasi update backend
1. Tambahkan `POST /auth/register` dengan response token/user.
2. Pastikan `POST /auth/login` mengembalikan JWT valid yang memuat payload `id` dan `role`.
3. Pastikan `GET /books` mengembalikan field buku yang konsisten dengan frontend.
4. Tambahkan dukungan filter report dan status peminjaman sesuai kontrak.
5. Pertimbangkan endpoint alias `/return/:id` jika ingin mendukung kedua jalur pengembalian.

## Catatan Tambahan

- Frontend masih menggunakan endpoint `/borrow` bukan `/pinjam`.
- Frontend membuka PDF dari `file_url` yang disimpan di backend.
- Jika backend menyajikan `pdf_file` tanpa domain, frontend mungkin mengubah url menjadi `/uploads/<pdf_file>`.
- Untuk peran `member`, frontend akan mengizinkan akses `ebooks` dan menolak `report` kecuali `admin`.
