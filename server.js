import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

const handlers = {
  login:     () => import('./api/auth/login.js'),
  register:  () => import('./api/auth/register.js'),
  logout:    () => import('./api/auth/logout.js'),
  booksIndex:() => import('./api/books/index.js'),
  booksId:   () => import('./api/books/[id].js'),
  borrowIndex:() => import('./api/borrow/index.js'),
  borrowId:  () => import('./api/borrow/[id].js'),
  approve:   () => import('./api/borrow/[id]/approve.js'),
  reject:    () => import('./api/borrow/[id]/reject.js'),
  return_:   () => import('./api/borrow/[id]/return.js'),
  ebooksIndex:() => import('./api/ebooks/index.js'),
  ebooksId:  () => import('./api/ebooks/[id].js'),
  dashboard: () => import('./api/reports/dashboard.js'),
  peminjaman:() => import('./api/reports/peminjaman.js'),
};

function wrap(loader) {
  return async (req, res) => {
    try {
      const mod = await loader();
      await mod.default(req, res);
    } catch (err) {
      console.error('[API ERROR]', err);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };
}

app.post('/api/auth/login',     wrap(handlers.login));
app.post('/api/auth/register',  wrap(handlers.register));
app.post('/api/auth/logout',    wrap(handlers.logout));

app.get('/api/books',           wrap(handlers.booksIndex));
app.post('/api/books',          wrap(handlers.booksIndex));
app.get('/api/books/:id',       wrap(handlers.booksId));
app.put('/api/books/:id',       wrap(handlers.booksId));
app.delete('/api/books/:id',    wrap(handlers.booksId));

app.get('/api/borrow',          wrap(handlers.borrowIndex));
app.post('/api/borrow',         wrap(handlers.borrowIndex));
app.delete('/api/borrow/:id',   wrap(handlers.borrowId));
app.put('/api/borrow/:id/approve', wrap(handlers.approve));
app.put('/api/borrow/:id/reject',  wrap(handlers.reject));
app.put('/api/borrow/:id/return',  wrap(handlers.return_));

app.get('/api/ebooks',          wrap(handlers.ebooksIndex));
app.get('/api/ebooks/:id',      wrap(handlers.ebooksId));

app.get('/api/reports/dashboard',   wrap(handlers.dashboard));
app.get('/api/reports/peminjaman',  wrap(handlers.peminjaman));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
