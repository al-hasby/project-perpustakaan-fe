import { signToken, comparePassword } from '../_lib/auth.js';
import { ensureSchema, query } from '../_lib/db.js';
import { handleCors, parseBody, sendSuccess, sendError } from '../_lib/response.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    await ensureSchema();
    const { username, password } = await parseBody(req);

    if (!username || !password) {
      return sendError(res, 'Username dan password harus diisi');
    }

    const [rows] = await query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];

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
}
