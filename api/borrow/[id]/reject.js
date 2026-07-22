import { requireRole } from '../../_lib/auth.js';
import { ensureSchema, query, now } from '../../_lib/db.js';
import { handleCors, sendSuccess, sendError, sendNotFound } from '../../_lib/response.js';

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

    const ts = now();
    await query(
      `UPDATE borrows SET status='ditolak', approval_status='rejected', rejected_at=?, ditolak_oleh=?, ditolak_pada=?, updated_at=? WHERE id=?`,
      [ts, user.id, ts, ts, id]
    );

    const [updated] = await query('SELECT * FROM borrows WHERE id = ?', [id]);
    return sendSuccess(res, updated[0]);
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
}
