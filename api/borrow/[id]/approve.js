import { requireRole } from '../../_lib/auth.js';
import { ensureSchema, query, now } from '../../_lib/db.js';
import { handleCors, parseBody, sendSuccess, sendError, sendNotFound } from '../../_lib/response.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'PUT') {
    return sendError(res, 'Method not allowed', 405);
  }

  await ensureSchema();

  const user = requireRole(req, res, ['admin']);
  if (!user) return;

  const { id } = req.query;

  try {
    const [rows] = await query('SELECT * FROM borrows WHERE id = ?', [id]);
    if (rows.length === 0) return sendNotFound(res, 'Peminjaman tidak ditemukan');

    const borrow = rows[0];
    const body = await parseBody(req);
    const ts = now();

    await query(
      `UPDATE borrows SET status='dipinjam', approval_status='approved', kondisi_buku=?, approved_at=?, disetujui_oleh=?, disetujui_pada=?, updated_at=? WHERE id=?`,
      [body.kondisi_buku || borrow.kondisi_buku, ts, user.id, ts, ts, id]
    );

    if (borrow.id_buku) {
      await query('UPDATE books SET stok = stok - 1 WHERE id = ?', [borrow.id_buku]);
    }

    const [updated] = await query('SELECT * FROM borrows WHERE id = ?', [id]);
    return sendSuccess(res, updated[0]);
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
}
