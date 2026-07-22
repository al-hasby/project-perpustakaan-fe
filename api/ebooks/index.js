import { requireAuth } from '../_lib/auth.js';
import { ensureSchema, query } from '../_lib/db.js';
import { handleCors, sendSuccess, sendError } from '../_lib/response.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return sendError(res, 'Method not allowed', 405);
  }

  await ensureSchema();

  const user = requireAuth(req, res);
  if (!user) return;

  try {
    const [rows] = await query('SELECT * FROM ebooks');
    return sendSuccess(res, rows);
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
}
