# My Vercel Serverless Functions

API backend untuk Sistem Perpustakaan yang dibangun dengan Vercel Serverless Functions.

## Project Structure

```
my-vercel-serverless-functions/
├── api/
│   ├── _lib/
│   │   ├── auth.js            # JWT helpers & middleware autentikasi
│   │   ├── db.js              # In-memory data store
│   │   └── response.js        # Standard JSON response helpers
│   ├── auth/
│   │   ├── login.js           # POST /api/auth/login
│   │   ├── register.js        # POST /api/auth/register
│   │   └── logout.js          # POST /api/auth/logout
│   ├── books/
│   │   ├── index.js           # GET /api/books, POST /api/books
│   │   └── [id].js            # GET /api/books/:id, PUT /api/books/:id, DELETE /api/books/:id
│   ├── borrow/
│   │   ├── index.js           # GET /api/borrow, POST /api/borrow
│   │   ├── [id].js            # DELETE /api/borrow/:id
│   │   └── [id]/
│   │       ├── approve.js     # PUT /api/borrow/:id/approve
│   │       ├── reject.js      # PUT /api/borrow/:id/reject
│   │       └── return.js      # PUT /api/borrow/:id/return
│   ├── ebooks/
│   │   ├── index.js           # GET /api/ebooks
│   │   └── [id].js            # GET /api/ebooks/:id
│   └── reports/
│       ├── dashboard.js       # GET /api/reports/dashboard
│       └── peminjaman.js      # GET /api/reports/peminjaman?filter=...
├── data/
│   └── seed.js                # Data awal (buku, user default)
├── package.json
├── vercel.json
└── jsconfig.json
```

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Run locally:
   ```
   npm run dev
   ```

3. Deploy to Vercel:
   ```
   npm run deploy
   ```

## Default Users

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | admin |
| petugas | petugas123 | petugas |
| budi | budi123 | user (member) |
| siti | siti123 | user (member) |

## API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|:----:|-------------|
| POST | /api/auth/login | No | Login |
| POST | /api/auth/register | No | Register |
| POST | /api/auth/logout | Yes | Logout |

### Books
| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|------|-------------|
| GET | /api/books | Yes | Any | List buku |
| POST | /api/books | Yes | admin, petugas | Tambah buku |
| GET | /api/books/:id | Yes | Any | Detail buku |
| PUT | /api/books/:id | Yes | admin, petugas | Update buku |
| DELETE | /api/books/:id | Yes | admin, petugas | Hapus buku |

### Borrow
| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|------|-------------|
| GET | /api/borrow | Yes | Any | List peminjaman |
| POST | /api/borrow | Yes | Any | Ajukan peminjaman |
| DELETE | /api/borrow/:id | Yes | Any | Hapus peminjaman |
| PUT | /api/borrow/:id/approve | Yes | admin | Setujui peminjaman |
| PUT | /api/borrow/:id/reject | Yes | admin | Tolak peminjaman |
| PUT | /api/borrow/:id/return | Yes | admin, petugas | Kembalikan buku |

### Ebooks
| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|------|-------------|
| GET | /api/ebooks | Yes | member, user | List ebook |
| GET | /api/ebooks/:id | Yes | member, user | Detail ebook |

### Reports
| Method | Endpoint | Auth | Role | Description |
|--------|----------|:----:|------|-------------|
| GET | /api/reports/dashboard | Yes | admin | Statistik dashboard |
| GET | /api/reports/peminjaman?filter=... | Yes | admin | Laporan peminjaman |

Filter options: `all`, `keterlambatan`, `belum_kembali`, `rusak`

## Environment Variables

Set `JWT_SECRET` di Vercel Dashboard untuk production:

```
JWT_SECRET=your-secret-key-here
```

## License

MIT
