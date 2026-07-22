const { requireAuth } = require('../_lib/auth');
const { getDb, create, findAll } = require('../_lib/db');
const { handleCors, parseBody, parseQuery, sendSuccess, sendCreated, sendError } = require('../_lib/response');

module.exports = async function handler(req, res) {
  if (handleCors(req, res)) return;

  const user = requireAuth(req, res);
  if (!user) return;

  if (req.method === 'GET') {
    try {
      const query = parseQuery(req.url);
      let books = findAll('books');

      if (query.search) {
        const s = query.search.toLowerCase();
        books = books.filter(b =>
          b.judul.toLowerCase().includes(s) ||
          b.pengarang.toLowerCase().includes(s) ||
          b.penerbit.toLowerCase().includes(s) ||
          b.kategori.toLowerCase().includes(s)
        );
      }

      if (query.page && query.limit) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const start = (page - 1) * limit;
        const paged = books.slice(start, start + limit);
        return sendSuccess(res, {
          data: paged,
          pagination: { page, limit, total: books.length },
        });
      }

      return sendSuccess(res, books);
    } catch (err) {
      return sendError(res, 'Internal server error', 500);
    }
  }

  if (req.method === 'POST') {
    try {
      const body = await parseBody(req);
      const { judul, pengarang, penerbit, tahun_terbit, kategori, stok, pdf_file, cover_url } = body;

      if (!judul || !pengarang || !penerbit) {
        return sendError(res, 'Judul, pengarang, dan penerbit harus diisi');
      }

      const db = getDb();
      const maxId = db.books.reduce((max, b) => Math.max(max, b.id || 0), 0);

      const newBook = create('books', {
        id: maxId + 1,
        judul,
        pengarang,
        penerbit,
        tahun_terbit: tahun_terbit || null,
        kategori: kategori || '',
        stok: stok || 0,
        pdf_file: pdf_file || null,
        cover_url: cover_url || null,
      });

      return sendCreated(res, {
        message: 'Book created',
        data: newBook,
      });
    } catch (err) {
      return sendError(res, 'Internal server error', 500);
    }
  }

  return sendError(res, 'Method not allowed', 405);
};
