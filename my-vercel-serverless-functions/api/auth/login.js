const { signToken, comparePassword } = require('../_lib/auth');
const { getDb } = require('../_lib/db');
const { handleCors, parseBody, sendSuccess, sendError, sendJson } = require('../_lib/response');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    const { username, password } = await parseBody(req);

    if (!username || !password) {
      return sendError(res, 'Username dan password harus diisi');
    }

    const db = getDb();
    const user = db.users.find(u => u.username === username);

    if (!user || !comparePassword(password, user.password)) {
      return sendError(res, 'Username atau password salah', 401);
    }

    const tokenPayload = { id: user.id, role: user.role };
    const token = signToken(tokenPayload);

    return sendSuccess(res, {
      message: 'login success',
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
};
