import { signToken, hashPassword } from '../_lib/auth.js';
import { ensureSchema, query, now } from '../_lib/db.js';
import { handleCors, parseBody, sendSuccess, sendError } from '../_lib/response.js';

export default async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    await ensureSchema();
    const { name, username, password, role } = await parseBody(req);

    if (!name || !username || !password) {
      return sendError(res, 'Nama, username, dan password harus diisi');
    }

    const [existing] = await query('SELECT id FROM users WHERE username = ?', [username]);
    if (existing.length > 0) {
      return sendError(res, 'Username sudah digunakan', 409);
    }

    const userRole = role === 'member' ? 'user' : (role || 'user');
    const validRoles = ['admin', 'petugas', 'user'];
    if (!validRoles.includes(userRole)) {
      return sendError(res, 'Role tidak valid');
    }

    const id = `u-${Date.now()}`;
    const ts = now();
    await query(
      'INSERT INTO users (id, name, username, password, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [id, name, username, hashPassword(password), userRole, ts, ts]
    );

    const tokenPayload = { id, role: userRole };
    const token = signToken(tokenPayload);

    return sendSuccess(res, {
      message: 'register success',
      token,
      user: {
        id,
        username,
        role: userRole === 'user' ? 'member' : userRole,
      },
    }, 201);
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
}
