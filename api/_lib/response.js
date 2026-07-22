function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

function sendJson(res, statusCode, data) {
  setCorsHeaders(res);
  res.status(statusCode).json(data);
}

function sendSuccess(res, data, statusCode = 200) {
  sendJson(res, statusCode, data);
}

function sendCreated(res, data) {
  sendJson(res, 201, data);
}

function sendError(res, message, statusCode = 400) {
  sendJson(res, statusCode, { message });
}

function sendUnauthorized(res) {
  sendError(res, 'Unauthorized', 401);
}

function sendForbidden(res) {
  sendError(res, 'Forbidden', 403);
}

function sendNotFound(res, message = 'Not found') {
  sendError(res, message, 404);
}

function handleCors(req, res) {
  setCorsHeaders(res);
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}

function parseBody(req) {
  if (req.body && Object.keys(req.body).length > 0) {
    return Promise.resolve(req.body);
  }
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function parseQuery(url) {
  const idx = url.indexOf('?');
  if (idx === -1) return {};
  const params = new URLSearchParams(url.slice(idx + 1));
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
}

function getPathId(url) {
  const parts = url.split('/').filter(Boolean);
  return parts[parts.length - 1];
}

export {
  setCorsHeaders,
  sendJson,
  sendSuccess,
  sendCreated,
  sendError,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  handleCors,
  parseBody,
  parseQuery,
  getPathId,
};
