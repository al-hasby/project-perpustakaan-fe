const { signToken, hashPassword } = require('../_lib/auth');
const { getDb, create } = require('../_lib/db');
const { handleCors, parseBody, sendSuccess, sendError } = require('../_lib/response');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'POST') {
    return sendError(res, 'Method not allowed', 405);
  }

  try {
    const { name, username, password, role } = await parseBody(req);

    if (!name || !username || !password) {
      return sendError(res, 'Nama, username, dan password harus diisi');
    }

    const db = getDb();
    const existing = db.users.find(u => u.username === username);
    if (existing) {
      return sendError(res, 'Username sudah digunakan', 409);
    }

    const userRole = role === 'member' ? 'user' : (role || 'user');
    const validRoles = ['admin', 'petugas', 'user'];
    if (!validRoles.includes(userRole)) {
      return sendError(res, 'Role tidak valid');
    }

    const newUser = create('users', {
      name,
      username,
      password: hashPassword(password),
      role: userRole,
    });

    const tokenPayload = { id: newUser.id, role: newUser.role };
    const token = signToken(tokenPayload);

    return sendSuccess(res, {
      message: 'register success',
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        role: newUser.role === 'user' ? 'member' : newUser.role,
      },
    }, 201);
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
};
