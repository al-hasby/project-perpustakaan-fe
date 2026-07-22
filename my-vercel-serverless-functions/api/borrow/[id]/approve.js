const { requireRole } = require('../../_lib/auth');
const { findById, update } = require('../../_lib/db');
const { handleCors, parseBody, sendSuccess, sendError, sendNotFound } = require('../../_lib/response');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'PUT') {
    return sendError(res, 'Method not allowed', 405);
  }

  const user = requireRole(req, res, ['admin']);
  if (!user) return;

  const { id } = req.query;

  try {
    const borrow = findById('borrows', id);
    if (!borrow) return sendNotFound(res, 'Peminjaman tidak ditemukan');

    const body = await parseBody(req);
    const now = new Date().toISOString();

    const updated = update('borrows', id, {
      status: 'dipinjam',
      approval_status: 'approved',
      kondisi_buku: body.kondisi_buku || borrow.kondisi_buku,
      approved_at: now,
      disetujui_oleh: user.id,
      disetujui_pada: now,
    });

    if (borrow.id_buku) {
      const book = findById('books', borrow.id_buku);
      if (book) {
        update('books', borrow.id_buku, { stok: book.stok - 1 });
      }
    }

    return sendSuccess(res, updated);
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
};
