const { requireAuth } = require('../_lib/auth');
const { findAll } = require('../_lib/db');
const { handleCors, sendSuccess, sendError } = require('../_lib/response');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return sendError(res, 'Method not allowed', 405);
  }

  const user = requireAuth(req, res);
  if (!user) return;

  try {
    const ebooks = findAll('ebooks');
    return sendSuccess(res, ebooks);
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
};
