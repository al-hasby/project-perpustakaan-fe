import { requireAuth } from '../_lib/auth.js';
import { ensureSchema, query, now } from '../_lib/db.js';
import { handleCors, parseBody, parseQuery, sendSuccess, sendCreated, sendError } from '../_lib/response.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  await ensureSchema();

  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    try {
      const q = parseQuery(req.url);

      if (q.page && q.limit) {
        const page = parseInt(q.page) || 1;
        const limit = parseInt(q.limit) || 10;
        const start = (page - 1) * limit;

        if (q.search) {
          const s = `%${q.search}%`;
          const like = ' WHERE judul LIKE ? OR pengarang LIKE ? OR penerbit LIKE ? OR kategori LIKE ?';
          const [countRows] = await query('SELECT COUNT(*) AS cnt FROM books' + like, [s, s, s, s]);
          const [rows] = await query('SELECT * FROM books' + like + ' LIMIT ? OFFSET ?', [s, s, s, s, limit, start]);
          return sendSuccess(res, { data: rows, pagination: { page, limit, total: countRows[0].cnt } });
        }

        const [countRows] = await query('SELECT COUNT(*) AS cnt FROM books');
        const [rows] = await query('SELECT * FROM books LIMIT ? OFFSET ?', [limit, start]);
        return sendSuccess(res, { data: rows, pagination: { page, limit, total: countRows[0].cnt } });
      }

      if (q.search) {
        const s = `%${q.search}%`;
        const [rows] = await query('SELECT * FROM books WHERE judul LIKE ? OR pengarang LIKE ? OR penerbit LIKE ? OR kategori LIKE ?', [s, s, s, s]);
        return sendSuccess(res, rows);
      }

      const [rows] = await query('SELECT * FROM books');
      return sendSuccess(res, rows);
    } catch (err) {
      return sendError(res, 'Internal server error', 500);
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const { judul, pengarang, penerbit, tahun_terbit, kategori, stok, pdf_file, cover_url } = body;

      if (!judul || !pengarang || !penerbit) {
        return sendError(res, 'Judul, pengarang, dan penerbit harus diisi');
      }

      const ts = now();
      const [result] = await query(
        'INSERT INTO books (judul, pengarang, penerbit, tahun_terbit, kategori, stok, pdf_file, cover_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [judul, pengarang, penerbit, tahun_terbit || null, kategori || '', stok || 0, pdf_file || null, cover_url || null, ts, ts]
      );

      return sendCreated(res, {
        message: 'Book created',
        data: { id: result.insertId, judul, pengarang, penerbit, tahun_terbit, kategori, stok, pdf_file, cover_url },
      });
    } catch (err) {
      return sendError(res, 'Internal server error', 500);
    }
  }

  return sendError(res, 'Method not allowed', 405);
}
