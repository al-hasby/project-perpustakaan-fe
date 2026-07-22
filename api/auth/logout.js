import { requireAuth } from '../_lib/auth.js';
import { ensureSchema } from '../_lib/db.js';
import { handleCors, sendSuccess, sendError } from '../_lib/response.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  await ensureSchema();

  const user = requireAuth(req, res);
  if (!user) return;

  return sendSuccess(res, { message: 'logout success' });
}
