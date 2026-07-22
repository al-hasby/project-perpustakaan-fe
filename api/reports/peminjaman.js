import { requireRole } from '../_lib/auth.js';
import { ensureSchema, query } from '../_lib/db.js';
import { handleCors, parseQuery, sendSuccess, sendError } from '../_lib/response.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return sendError(res, 'Method not allowed', 405);
  }

  await ensureSchema();

  const user = requireRole(req, res, ['admin']);
  if (!user) return;

  try {
    const q = parseQuery(req.url);
    const filter = q.filter || 'all';
    let sql = 'SELECT * FROM borrows';
    const params = [];

    switch (filter) {
      case 'keterlambatan':
        sql += " WHERE status = 'dipinjam' AND tanggal_kembali < CURDATE()";
        break;
      case 'belum_kembali':
        sql += " WHERE status = 'dipinjam'";
        break;
      case 'rusak':
        sql += " WHERE kondisi_buku IN ('rusak', 'sedikit_rusak')";
        break;
      default:
        break;
    }

    const [rows] = await query(sql, params);
    return sendSuccess(res, { filter, rows });
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
}
