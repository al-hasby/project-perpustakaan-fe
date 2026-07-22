const express = require('express');

const app = express();

// Global CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

function wrapHandler(handler) {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (err) {
      console.error('Handler error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  };
}

// Auth
app.post('/api/auth/login', wrapHandler(require('./api/auth/login')));
app.post('/api/auth/register', wrapHandler(require('./api/auth/register')));
app.post('/api/auth/logout', wrapHandler(require('./api/auth/logout')));
app.post('/auth/login', wrapHandler(require('./api/auth/login')));
app.post('/auth/register', wrapHandler(require('./api/auth/register')));
app.post('/auth/logout', wrapHandler(require('./api/auth/logout')));

// Books
app.get('/api/books', wrapHandler(require('./api/books/index')));
app.post('/api/books', wrapHandler(require('./api/books/index')));
app.get('/api/books/:id', wrapHandler(require('./api/books/[id]')));
app.put('/api/books/:id', wrapHandler(require('./api/books/[id]')));
app.delete('/api/books/:id', wrapHandler(require('./api/books/[id]')));
app.get('/books', wrapHandler(require('./api/books/index')));
app.post('/books', wrapHandler(require('./api/books/index')));
app.get('/books/:id', wrapHandler(require('./api/books/[id]')));
app.put('/books/:id', wrapHandler(require('./api/books/[id]')));
app.delete('/books/:id', wrapHandler(require('./api/books/[id]')));

// Borrow
app.get('/api/borrow', wrapHandler(require('./api/borrow/index')));
app.post('/api/borrow', wrapHandler(require('./api/borrow/index')));
app.delete('/api/borrow/:id', wrapHandler(require('./api/borrow/[id]')));
app.put('/api/borrow/:id/approve', wrapHandler(require('./api/borrow/[id]/approve')));
app.put('/api/borrow/:id/reject', wrapHandler(require('./api/borrow/[id]/reject')));
app.put('/api/borrow/:id/return', wrapHandler(require('./api/borrow/[id]/return')));
app.get('/borrow', wrapHandler(require('./api/borrow/index')));
app.post('/borrow', wrapHandler(require('./api/borrow/index')));
app.delete('/borrow/:id', wrapHandler(require('./api/borrow/[id]')));
app.put('/borrow/:id/approve', wrapHandler(require('./api/borrow/[id]/approve')));
app.put('/borrow/:id/reject', wrapHandler(require('./api/borrow/[id]/reject')));
app.put('/borrow/:id/return', wrapHandler(require('./api/borrow/[id]/return')));

// Ebooks
app.get('/api/ebooks', wrapHandler(require('./api/ebooks/index')));
app.get('/api/ebooks/:id', wrapHandler(require('./api/ebooks/[id]')));
app.get('/ebooks', wrapHandler(require('./api/ebooks/index')));
app.get('/ebooks/:id', wrapHandler(require('./api/ebooks/[id]')));

// Reports
app.get('/api/reports/dashboard', wrapHandler(require('./api/reports/dashboard')));
app.get('/api/reports/peminjaman', wrapHandler(require('./api/reports/peminjaman')));
app.get('/reports/dashboard', wrapHandler(require('./api/reports/dashboard')));
app.get('/reports/peminjaman', wrapHandler(require('./api/reports/peminjaman')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
