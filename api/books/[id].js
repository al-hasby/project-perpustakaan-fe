import { requireAuth } from '../_lib/auth.js';
import { ensureSchema, query, now } from '../_lib/db.js';
import { handleCors, parseBody, sendSuccess, sendError, sendNotFound } from '../_lib/response.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  await ensureSchema();

  const user = requireAuth(req, res);
  if (!user) return;

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const [rows] = await query('SELECT * FROM books WHERE id = ?', [id]);
      if (rows.length === 0) return sendNotFound(res, 'Buku tidak ditemukan');
      return sendSuccess(res, rows[0]);
    } catch (err) {
      return sendError(res, 'Internal server error', 500);
    }
  }

  if (req.method === 'PUT') {
    try {
      const [existing] = await query('SELECT * FROM books WHERE id = ?', [id]);
      if (existing.length === 0) return sendNotFound(res, 'Buku tidak ditemukan');

      const book = existing[0];
      const body = await parseBody(req);

      await query(
        'UPDATE books SET judul=?, pengarang=?, penerbit=?, tahun_terbit=?, kategori=?, stok=?, pdf_file=?, cover_url=?, updated_at=? WHERE id=?',
        [
          body.judul ?? book.judul,
          body.pengarang ?? book.pengarang,
          body.penerbit ?? book.penerbit,
          body.tahun_terbit ?? book.tahun_terbit,
          body.kategori ?? book.kategori,
          body.stok ?? book.stok,
          body.pdf_file ?? book.pdf_file,
          body.cover_url ?? book.cover_url,
          now(),
          id,
        ]
      );

      const [updated] = await query('SELECT * FROM books WHERE id = ?', [id]);
      return sendSuccess(res, { message: 'Book updated', data: updated[0] });
    } catch (err) {
      return sendError(res, 'Internal server error', 500);
    }
  }

  if (req.method === 'DELETE') {
    try {
      const [existing] = await query('SELECT * FROM books WHERE id = ?', [id]);
      if (existing.length === 0) return sendNotFound(res, 'Buku tidak ditemukan');

      await query('DELETE FROM books WHERE id = ?', [id]);
      return sendSuccess(res, { message: 'Book deleted' });
    } catch (err) {
      return sendError(res, 'Internal server error', 500);
    }
  }

  return sendError(res, 'Method not allowed', 405);
}
