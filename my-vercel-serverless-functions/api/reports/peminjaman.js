const { requireRole } = require('../_lib/auth');
const { findAll } = require('../_lib/db');
const { handleCors, parseQuery, sendSuccess, sendError } = require('../_lib/response');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== 'GET') {
    return sendError(res, 'Method not allowed', 405);
  }

  const user = requireRole(req, res, ['admin']);
  if (!user) return;

  try {
    const query = parseQuery(req.url);
    const filter = query.filter || 'all';
    let borrows = findAll('borrows');

    switch (filter) {
      case 'keterlambatan':
        borrows = borrows.filter(b => {
          if (b.status !== 'dipinjam') return false;
          const due = new Date(b.tanggal_kembali);
          return due < new Date();
        });
        break;
      case 'belum_kembali':
        borrows = borrows.filter(b => b.status === 'dipinjam');
        break;
      case 'rusak':
        borrows = borrows.filter(b =>
          b.kondisi_buku === 'rusak' || b.kondisi_buku === 'sedikit_rusak'
        );
        break;
      default:
        break;
    }

    return sendSuccess(res, { filter, rows: borrows });
  } catch (err) {
    return sendError(res, 'Internal server error', 500);
  }
};
