import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'perpustakaan-secret-key-change-in-production';
const JWT_EXPIRES = '24h';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

function extractToken(req) {
  const auth = req.headers.authorization || '';
  if (auth.startsWith('Bearer ')) {
    return auth.slice(7);
  }
  return null;
}

function getUserFromRequest(req) {
  const token = extractToken(req);
  if (!token) return null;
  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}

function requireAuth(req, res) {
  const user = getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ message: 'Unauthorized' });
    return null;
  }
  return user;
}

function requireRole(req, res, roles) {
  const user = requireAuth(req, res);
  if (!user) return null;
  const userRole = user.role === 'user' ? 'member' : user.role;
  const allowed = roles.map(r => r === 'member' ? 'user' : r);
  if (!allowed.includes(user.role) && !allowed.includes(userRole)) {
    res.status(403).json({ message: 'Forbidden' });
    return null;
  }
  return user;
}

function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'h_' + Math.abs(hash).toString(36);
}

function comparePassword(password, hash) {
  return hashPassword(password) === hash;
}

export {
  signToken,
  verifyToken,
  extractToken,
  getUserFromRequest,
  requireAuth,
  requireRole,
  hashPassword,
  comparePassword,
  JWT_SECRET,
};
