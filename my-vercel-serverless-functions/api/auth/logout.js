const { requireAuth } = require('../_lib/auth');
const { handleCors, sendSuccess, sendError } = require('../_lib/response');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  const user = requireAuth(req, res);
  if (!user) return;

  return sendSuccess(res, { message: 'logout success' });
};
