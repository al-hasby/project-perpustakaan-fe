import { requireAuth } from '../_lib/auth.js';
import { ensureSchema, query } from '../_lib/db.js';
import { handleCors, sendSuccess, sendError, sendNotFound } from '../_lib/response.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  await ensureSchema();

  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      const [rows] = await query('SELECT * FROM borrows WHERE id = ?', [id]);
      if (rows.length === 0) return sendNotFound(res, 'Peminjaman tidak ditemukan');

      await query('DELETE FROM borrows WHERE id = ?', [id]);
      return sendSuccess(res, { message: 'Peminjaman deleted' });
    } catch (err) {
      return sendError(res, 'Internal server error', 500);
    }
  }

  return sendError(res, 'Method not allowed', 405);
}
