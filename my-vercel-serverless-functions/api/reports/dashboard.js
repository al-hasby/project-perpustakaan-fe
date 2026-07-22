const { requireRole } = require('../_lib/auth');
const { findAll, count } = require('../_lib/db');
const { handleCors, sendSuccess, sendError } = require('../_lib/response');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return sendError(res, 'Method not allowed', 405);
  }

  const user = requireRole(req, res, ['admin']);
  if (!user) return;

  try {
    const borrows = findAll('borrows');
    const books = count('books');
    const ebooks = count('ebooks');

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
      total_books: books,
      total_ebooks: ebooks,
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
};
