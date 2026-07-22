const { requireAuth } = require('../_lib/auth');
const { findById, remove } = require('../_lib/db');
const { handleCors, sendSuccess, sendError, sendNotFound } = require('../_lib/response');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method === 'DELETE') {
    const { id } = req.query;
    try {
      const borrow = findById('borrows', id);
      if (!borrow) return sendNotFound(res, 'Peminjaman tidak ditemukan');

      remove('borrows', id);
      return sendSuccess(res, { message: 'Peminjaman deleted' });
    } catch (err) {
      return sendError(res, 'Internal server error', 500);
    }
  }

  return sendError(res, 'Method not allowed', 405);
};
