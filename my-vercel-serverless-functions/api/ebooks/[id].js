const { requireAuth } = require('../_lib/auth');
const { findById } = require('../_lib/db');
const { handleCors, sendSuccess, sendError, sendNotFound } = require('../_lib/response');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return sendError(res, 'Method not allowed', 405);
  }

  const user = requireAuth(req, res);
  if (!user) return;

  const { id } = req.query;

  try {
    const ebook = findById('ebooks', id);
    if (!ebook) return sendNotFound(res, 'Ebook tidak ditemukan');
    return sendSuccess(res, ebook);
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
};
