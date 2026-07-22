import { requireAuth } from '../_lib/auth.js';
import { ensureSchema, query } from '../_lib/db.js';
import { handleCors, sendSuccess, sendError, sendNotFound } from '../_lib/response.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return sendError(res, 'Method not allowed', 405);
  }

  await ensureSchema();

  const user = requireAuth(req, res);
  if (!user) return;

  const { id } = req.query;

  try {
    const [rows] = await query('SELECT * FROM ebooks WHERE id = ?', [id]);
    if (rows.length === 0) return sendNotFound(res, 'Ebook tidak ditemukan');
    return sendSuccess(res, rows[0]);
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
}
