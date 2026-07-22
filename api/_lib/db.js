import mysql from 'mysql2/promise';
import { hashPassword } from './auth.js';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '3306'),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
});

let schemaReady = false;

async function ensureSchema() {
  if (schemaReady) return;

  const conn = await pool.getConnection();
  try {
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'user',
        created_at VARCHAR(50),
        updated_at VARCHAR(50)
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        judul VARCHAR(255) NOT NULL,
        pengarang VARCHAR(255) NOT NULL,
        penerbit VARCHAR(255) NOT NULL,
        tahun_terbit INT,
        kategori VARCHAR(100) DEFAULT '',
        stok INT DEFAULT 0,
        pdf_file VARCHAR(500),
        cover_url VARCHAR(500),
        created_at VARCHAR(50),
        updated_at VARCHAR(50)
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS ebooks (
        id VARCHAR(64) PRIMARY KEY,
        judul VARCHAR(255) NOT NULL,
        penulis VARCHAR(255),
        penerbit VARCHAR(255),
        tahun_terbit INT,
        kategori VARCHAR(100) DEFAULT '',
        file_url VARCHAR(500),
        pdf_file VARCHAR(500),
        created_at VARCHAR(50),
        updated_at VARCHAR(50)
      )
    `);

    await conn.query(`
      CREATE TABLE IF NOT EXISTS borrows (
        id VARCHAR(64) PRIMARY KEY,
        member_id VARCHAR(64),
        borrower_name VARCHAR(255),
        id_buku INT,
        judul_buku VARCHAR(255),
        tanggal_pinjam VARCHAR(20),
        tanggal_kembali VARCHAR(20),
        dikembalikan_pada VARCHAR(20),
        status VARCHAR(30) DEFAULT 'menunggu',
        kondisi_buku VARCHAR(30) DEFAULT 'aman',
        approval_status VARCHAR(30) DEFAULT 'pending',
        approved_at VARCHAR(50),
        rejected_at VARCHAR(50),
        disetujui_oleh VARCHAR(64),
        disetujui_pada VARCHAR(50),
        ditolak_oleh VARCHAR(64),
        ditolak_pada VARCHAR(50),
        created_at VARCHAR(50),
        updated_at VARCHAR(50)
      )
    `);

    const [rows] = await conn.query('SELECT COUNT(*) AS cnt FROM users');
    if (rows[0].cnt === 0) {
      await seedData(conn);
    }

    schemaReady = true;
  } finally {
    conn.release();
  }
}

async function seedData(conn) {
  const now = new Date().toISOString();

  await conn.query(`
    INSERT INTO users (id, name, username, password, role, created_at, updated_at) VALUES
    ('u-admin-001', 'Administrator', 'admin', ?, 'admin', ?, ?),
    ('u-petugas-001', 'Petugas Perpustakaan', 'petugas', ?, 'petugas', ?, ?),
    ('u-member-001', 'Budi Santoso', 'budi', ?, 'user', ?, ?),
    ('u-member-002', 'Siti Rahayu', 'siti', ?, 'user', ?, ?)
  `, [
    hashPassword('admin123'), now, now,
    hashPassword('petugas123'), now, now,
    hashPassword('budi123'), now, now,
    hashPassword('siti123'), now, now,
  ]);

  await conn.query(`
    INSERT INTO books (id, judul, pengarang, penerbit, tahun_terbit, kategori, stok, pdf_file, cover_url, created_at, updated_at) VALUES
    (1, 'Laskar Pelangi', 'Andrea Hirata', 'Bentang Pustaka', 2005, 'Novel', 5, NULL, 'https://upload.wikimedia.org/wikipedia/id/7/7f/Laskar_Pelangi.jpg', ?, ?),
    (2, 'Bumi Manusia', 'Pramoedya Ananta Toer', 'GMH', 1980, 'Novel', 3, NULL, 'https://upload.wikimedia.org/wikipedia/id/1/18/Bumi_Manusia.jpg', ?, ?),
    (3, 'Pulang', 'Tere Liye', 'Gramedia Pustaka Utama', 2018, 'Novel', 7, NULL, NULL, ?, ?),
    (4, 'Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'Kompas Gramedia', 2014, 'Sains', 4, NULL, NULL, ?, ?),
    (5, 'Atomic Habits', 'James Clear', 'Gramedia Pustaka Utama', 2018, 'Self Help', 6, NULL, NULL, ?, ?),
    (6, 'Filosofi Teras', 'Henry Manampiring', 'Kompas Gramedia', 2019, 'Filsafat', 3, NULL, NULL, ?, ?),
    (7, 'Negeri 5 Menara', 'Ahmad Fuadi', 'Gramedia Pustaka Utama', 2009, 'Novel', 4, NULL, NULL, ?, ?),
    (8, 'Dilan: Dia adalah Dilanku Tahun 1990', 'Pidi Baiq', 'Distransbook', 2014, 'Novel', 8, NULL, NULL, ?, ?)
  `, [now, now, now, now, now, now, now, now, now, now, now, now, now, now, now, now]);

  await conn.query(`
    INSERT INTO ebooks (id, judul, penulis, penerbit, tahun_terbit, kategori, file_url, pdf_file, created_at, updated_at) VALUES
    ('e-001', 'Belajar JavaScript', 'John Doe', 'Erlangga', 2023, 'Teknologi', 'https://example.com/ebook/js.pdf', 'belajar-javascript.pdf', ?, ?),
    ('e-002', 'Pengantar Ilmu Komputer', 'Jane Smith', 'Andi Publisher', 2022, 'Teknologi', 'https://example.com/ebook/cs.pdf', 'pengantar-ilmu-komputer.pdf', ?, ?),
    ('e-003', 'Matematika Diskrit', 'Rinaldi Munir', 'Informatika', 2020, 'Sains', 'https://example.com/ebook/diskrit.pdf', 'matematika-diskrit.pdf', ?, ?)
  `, [now, now, now, now, now, now]);

  await conn.query(`
    INSERT INTO borrows (id, member_id, borrower_name, id_buku, judul_buku, tanggal_pinjam, tanggal_kembali, dikembalikan_pada, status, kondisi_buku, approval_status, approved_at, rejected_at, disetujui_oleh, disetujui_pada, ditolak_oleh, ditolak_pada, created_at, updated_at) VALUES
    ('b-001', 'u-member-001', 'Budi Santoso', 1, 'Laskar Pelangi', '2026-07-01', '2026-07-08', NULL, 'dipinjam', 'aman', 'approved', '2026-07-01T10:00:00.000Z', NULL, 'u-admin-001', '2026-07-01T10:00:00.000Z', NULL, NULL, '2026-07-01T08:00:00.000Z', '2026-07-01T10:00:00.000Z'),
    ('b-002', 'u-member-002', 'Siti Rahayu', 2, 'Bumi Manusia', '2026-06-25', '2026-07-02', '2026-07-01', 'dikembalikan', 'aman', 'approved', '2026-06-25T09:00:00.000Z', NULL, 'u-admin-001', '2026-06-25T09:00:00.000Z', NULL, NULL, '2026-06-25T08:00:00.000Z', '2026-07-01T14:00:00.000Z'),
    ('b-003', 'u-member-001', 'Budi Santoso', 4, 'Sapiens: A Brief History of Humankind', '2026-07-10', '2026-07-17', NULL, 'menunggu', 'aman', 'pending', NULL, NULL, NULL, NULL, NULL, NULL, '2026-07-10T08:00:00.000Z', '2026-07-10T08:00:00.000Z')
  `);
}

function query(sql, params) {
  return pool.query(sql, params);
}

function now() {
  return new Date().toISOString();
}

export { pool, ensureSchema, query, now };
