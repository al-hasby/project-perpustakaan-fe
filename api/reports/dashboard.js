import { requireRole } from '../_lib/auth.js';
import { ensureSchema, query } from '../_lib/db.js';
import { handleCors, sendSuccess, sendError } from '../_lib/response.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return sendError(res, 'Method not allowed', 405);
  }

  await ensureSchema();

  const user = requireRole(req, res, ['admin']);
  if (!user) return;

  try {
    const [borrows] = await query('SELECT * FROM borrows');
    const [bookCount] = await query('SELECT COUNT(*) AS cnt FROM books');
    const [ebookCount] = await query('SELECT COUNT(*) AS cnt FROM ebooks');

    const total_pinjam = borrows.filter(b => b.status !== 'ditolak').length;
    const total_kembali = borrows.filter(b => b.status === 'dikembalikan').length;
    const total_belum_kembali = borrows.filter(b => b.status === 'dipinjam').length;
    const total_terlambat = borrows.filter(b => {
      if (b.status !== 'dipinjam') return false;
      const due = new Date(b.tanggal_kembali);
      return due < new Date();
    }).length;
    const total_rusak = borrows.filter(b =>
      b.kondisi_buku === 'rusak' || b.kondisi_buku === 'sedikit_rusak'
    ).length;

    return sendSuccess(res, {
      total_books: bookCount[0].cnt,
      total_ebooks: ebookCount[0].cnt,
      total_pinjam,
      total_kembali,
      total_belum_kembali,
      total_terlambat,
      keterlambatan: total_terlambat,
      total_rusak,
      rusak: total_rusak,
    });
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
}
