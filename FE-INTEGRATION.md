# FE Integration Contract - Web Perpustakaan API

Dokumen ini kontrak API untuk disambungkan ke frontend. Isinya mengikuti backend yang ada sekarang.

## Base URL

Local:

```text
http://localhost:3000
```

## Auth

Token dikirim di header:

```http
Authorization: Bearer <token>
```

Endpoint terbuka:

```http
POST /auth/login
```

Endpoint lain butuh token.

Role backend yang valid:

```text
admin
petugas
user
```

Catatan: jika FE memakai role `member`, map ke `user` karena backend menyimpan role default sebagai `user`.

## Response Error

Format error backend:

```json
{
  "success": false,
  "error": "ERROR_CODE"
}
```

Beberapa kode error yang mungkin muncul:

```text
TOKEN_REQUIRED
INVALID_TOKEN
UNAUTHENTICATED
FORBIDDEN
USERNAME_PASSWORD_REQUIRED
USERNAME_ALREADY_EXISTS
INVALID_CREDENTIALS
INVALID_PAYLOAD
INVALID_KONDISI_BUKU
BOOK_NOT_FOUND
EBOOK_NOT_FOUND
PINJAM_NOT_FOUND
PINJAM_NOT_APPROVED
PINJAM_ALREADY_APPROVED
PINJAM_ALREADY_REJECTED
BOOK_OUT_OF_STOCK
USER_NOT_FOUND
```

## Authentication Endpoints

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

Response:

```json
{
  "message": "login success",
  "token": "jwt_token",
  "user": {
    "id": "user_id",
    "username": "admin",
    "role": "admin"
  }
}
```

JWT berisi:

```json
{
  "id": "user_id",
  "role": "admin"
}
```

### Logout

```http
POST /auth/logout
```

Header:

```http
Authorization: Bearer <token>
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

Response:

```json
{
  "message": "register success",
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "username": "user@example.com",
    "role": "user"
  }
}
```

Catatan:
- Field `role` opsional, default `user`.
- Field `name` diterima tapi tidak disimpan (disimpan hanya `username`).
- Jika username sudah ada, return error `USERNAME_ALREADY_EXISTS`.

## Books

Semua endpoint books butuh Bearer Token.

### Get All Books

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

### Get Book Detail

```http
GET /books/:id
```

Response:

```json
{
  "id": 1,
  "judul": "Laskar Pelangi",
  "pengarang": "Andrea Hirata",
  "penerbit": "Bentang",
  "tahun_terbit": 2005,
  "kategori": "Novel",
  "stok": 8,
  "pdf_file": "laskar-pelangi.pdf"
}
```

### Create Book

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

Response:

```json
{
  "message": "Book created"
}
```

### Update Book

```http
PUT /books/:id
```

Body sama seperti create.

Response:

```json
{
  "message": "Book updated"
}
```

### Delete Book

```http
DELETE /books/:id
```

Response:

```json
{
  "message": "Book deleted"
}
```

### Search / Pagination / Filter

```http
GET /books?search=laskar
GET /books?page=1&limit=10
```

Query `search` mencari di kolom `judul`, `pengarang`, `penerbit`.

Jika ada query `page` dan `limit`, response dibungkus dengan pagination:

```json
{
  "data": [
    {
      "id": 1,
      "judul": "Laskar Pelangi",
      "pengarang": "Andrea Hirata",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

Tanpa query `page`/`limit`, response tetap array langsung (default).

## Peminjaman / Borrow

Backend memasang route yang sama di dua prefix:

```text
/pinjam
/borrow
```

FE boleh pakai `/borrow`.

### Get All Borrow

```http
GET /borrow
```

Response:

```json
{
  "rows": [
    {
      "id": "uuid",
      "member_id": "uuid",
      "borrower_name": "Budi",
      "id_buku": 1,
      "book_id": 1,
      "judul_buku": "Laskar Pelangi",
      "book_title": "Laskar Pelangi",
      "tanggal_pinjam": "2026-05-19",
      "borrow_date": "2026-05-19",
      "tanggal_kembali": "2026-05-26",
      "due_date": "2026-05-26",
      "dikembalikan_pada": null,
      "returned_at": null,
      "status": "menunggu",
      "kondisi_buku": "aman",
      "book_condition": "aman",
      "disetujui_oleh": null,
      "disetujui_pada": null,
      "ditolak_oleh": null,
      "ditolak_pada": null,
      "created_at": "2026-05-19T00:00:00.000Z",
      "updated_at": "2026-05-19T00:00:00.000Z"
    }
  ]
}
```

### Get Borrow Detail

```http
GET /borrow/:id
```

### Create Borrow

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

Alias yang juga diterima backend:

```json
{
  "borrower_name": "Budi",
  "book_id": 1,
  "borrow_date": "2026-05-19",
  "due_date": "2026-05-26",
  "book_condition": "aman"
}
```

Response: object peminjaman yang baru dibuat.

Status otomatis:

```text
admin  -> dipinjam
lainnya -> menunggu
```

Jika status langsung `dipinjam`, stok buku otomatis berkurang 1.

### Approve Borrow

```http
PUT /borrow/:id/approve
```

Role: `admin`.

Body opsional:

```json
{
  "kondisi_buku": "sedikit_rusak"
}
```

Alias:

```json
{
  "book_condition": "sedikit rusak"
}
```

Response: object peminjaman terbaru.

### Reject Borrow

```http
PUT /borrow/:id/reject
```

Role: `admin`.

Response: object peminjaman terbaru.

### Return Book

Endpoint:

```http
PUT /borrow/:id/return
PUT /return/:id
```

Role: `admin` atau `petugas`.

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

Response: object peminjaman terbaru.

Jika berhasil, status menjadi `dikembalikan` dan stok buku bertambah 1.

### Delete Borrow

```http
DELETE /borrow/:id
```

Response:

```json
{
  "message": "Peminjaman deleted"
}
```

Status peminjaman:

```text
menunggu
dipinjam
dikembalikan
terlambat
ditolak
```

## Ebooks

Backend memakai route `/ebooks`.

### Get All Ebooks

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

### Get Ebook Detail

```http
GET /ebooks/:id
```

### Create Ebook

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

Response:

```json
{
  "message": "Ebook created"
}
```

### Update Ebook

```http
PUT /ebooks/:id
```

Body sama seperti create.

### Delete Ebook

```http
DELETE /ebooks/:id
```

Soft delete.

## Reports

### Dashboard

```http
GET /reports/dashboard
```

Response:

```json
{
  "total_books": 50,
  "total_ebooks": 20,
  "total_pinjam": 15,
  "total_kembali": 35,
  "total_rusak": 2
}
```

### Peminjaman Report

```http
GET /reports/peminjaman
```

Query filter opsional:

```text
?filter=all
?filter=keterlambatan
?filter=belum_kembali
?filter=rusak
```

Contoh:

```http
GET /reports/peminjaman?filter=belum_kembali
```

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

Catatan mapping report:

```text
/report              -> belum ada, pakai /reports/dashboard
/report/overdue      -> belum ada, pakai /reports/peminjaman?filter=keterlambatan
/report/damaged      -> belum ada, pakai /reports/peminjaman?filter=rusak
```

Filter `rusak` membaca `kondisi_buku = "rusak"`.

## Users

### Get All Users

```http
GET /users
```

Response:

```json
[
  {
    "id": "uuid",
    "username": "admin",
    "role": "admin"
  }
]
```

### Get User Detail

```http
GET /users/:id
```

### Delete User

```http
DELETE /users/:id
```

## Field Final Untuk FE

Books:

```text
id
judul
pengarang
penerbit
tahun_terbit
kategori
stok
pdf_file
created_at
updated_at
```

Ebooks:

```text
id
judul
penulis
penerbit
tahun_terbit
kategori
file_url
created_at
updated_at
```

Borrow:

```text
id
member_id
borrower_name
id_buku
book_id
judul_buku
book_title
tanggal_pinjam
borrow_date
tanggal_kembali
due_date
dikembalikan_pada
returned_at
status
kondisi_buku
book_condition
disetujui_oleh
disetujui_pada
ditolak_oleh
ditolak_pada
created_at
updated_at
```

Users:

```text
id
username
role
```

## Upload File / Cover / PDF

Backend belum menerima upload file `multipart/form-data`.

Saat ini backend hanya menerima string:

```text
books.pdf_file
ebooks.file_url
```

Belum ada field cover buku di table/model.

## Gap Yang Perlu Diputuskan

Fitur yang diminta FE tapi belum ada di backend:

```text
GET /books/pdf
GET /books/pdf/:id
GET /report
GET /report/overdue
GET /report/damaged
upload PDF multipart/form-data
upload cover buku
```

Rekomendasi untuk FE:

```text
1. Pakai endpoint yang sudah ada dulu.
2. Login sekarang sudah mengembalikan user object, bisa langsung dipakai.
3. Register sudah tersedia di POST /auth/register.
4. Books sudah mendukung search & pagination (search, page, limit).
5. Pakai /ebooks untuk PDF.
```
