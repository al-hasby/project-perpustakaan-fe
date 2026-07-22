const { requireAuth } = require('../_lib/auth');
const { getDb, create, findAll, findById } = require('../_lib/db');
const { handleCors, parseBody, sendSuccess, sendCreated, sendError } = require('../_lib/response');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    try {
      const borrows = findAll('borrows');
      return sendSuccess(res, { borrows });
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

      const book = findById('books', id_buku);
      if (!book) {
        return sendError(res, 'Buku tidak ditemukan');
      }

      if (book.stok <= 0) {
        return sendError(res, 'Stok buku habis');
      }

      const newBorrow = create('borrows', {
        id: `b-${Date.now()}`,
        member_id: member_id || user.id,
        borrower_name,
        id_buku: Number(id_buku),
        judul_buku: book.judul,
        tanggal_pinjam,
        tanggal_kembali,
        dikembalikan_pada: null,
        status: 'menunggu',
        kondisi_buku: kondisi_buku || 'aman',
        approval_status: 'pending',
        approved_at: null,
        rejected_at: null,
        disetujui_oleh: null,
        disetujui_pada: null,
        ditolak_oleh: null,
        ditolak_pada: null,
      });

      return sendCreated(res, newBorrow);
    } catch (err) {
      return sendError(res, 'Internal server error', 500);
    }
  }

  return sendError(res, 'Method not allowed', 405);
};
