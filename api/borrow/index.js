import { requireAuth } from '../_lib/auth.js';
import { ensureSchema, query, now } from '../_lib/db.js';
import { handleCors, parseBody, sendSuccess, sendCreated, sendError } from '../_lib/response.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  await ensureSchema();

  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    try {
      const [rows] = await query('SELECT * FROM borrows ORDER BY created_at DESC');
      return sendSuccess(res, { borrows: rows });
    } catch (err) {
      return sendError(res, 'Internal server error', 500);
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const { borrower_name, id_buku, tanggal_pinjam, tanggal_kembali, kondisi_buku, member_id } = body;

      if (!borrower_name || !id_buku || !tanggal_pinjam || !tanggal_kembali) {
        return sendError(res, 'Data peminjaman tidak lengkap');
      }

      const [bookRows] = await query('SELECT * FROM books WHERE id = ?', [id_buku]);
      if (bookRows.length === 0) {
        return sendError(res, 'Buku tidak ditemukan');
      }

      const book = bookRows[0];
      if (book.stok <= 0) {
        return sendError(res, 'Stok buku habis');
      }

      const id = `b-${Date.now()}`;
      const ts = now();
      await query(
        `INSERT INTO borrows (id, member_id, borrower_name, id_buku, judul_buku, tanggal_pinjam, tanggal_kembali, dikembalikan_pada, status, kondisi_buku, approval_status, approved_at, rejected_at, disetujui_oleh, disetujui_pada, ditolak_oleh, ditolak_pada, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 'menunggu', ?, 'pending', NULL, NULL, NULL, NULL, NULL, NULL, ?, ?)`,
        [id, member_id || user.id, borrower_name, Number(id_buku), book.judul, tanggal_pinjam, tanggal_kembali, kondisi_buku || 'aman', ts, ts]
      );

      const [newRow] = await query('SELECT * FROM borrows WHERE id = ?', [id]);
      return sendCreated(res, newRow[0]);
    } catch (err) {
      return sendError(res, 'Internal server error', 500);
    }
  }

  return sendError(res, 'Method not allowed', 405);
}
