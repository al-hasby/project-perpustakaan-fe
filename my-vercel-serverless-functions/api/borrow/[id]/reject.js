const { requireRole } = require('../../_lib/auth');
const { findById, update } = require('../../_lib/db');
const { handleCors, sendSuccess, sendError, sendNotFound } = require('../../_lib/response');

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

    const now = new Date().toISOString();

    const updated = update('borrows', id, {
      status: 'ditolak',
      approval_status: 'rejected',
      rejected_at: now,
      ditolak_oleh: user.id,
      ditolak_pada: now,
    });

    return sendSuccess(res, updated);
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
};
