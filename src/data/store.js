const STORAGE_KEY = 'perpustakaan_data'

const defaultData = {
  users: [
    { id: 'u-admin-001', name: 'Administrator', username: 'admin', password: 'admin123', role: 'admin' },
    { id: 'u-petugas-001', name: 'Petugas Perpustakaan', username: 'petugas', password: 'petugas123', role: 'petugas' },
    { id: 'u-member-001', name: 'Budi Santoso', username: 'budi', password: 'budi123', role: 'user' },
    { id: 'u-member-002', name: 'Siti Rahayu', username: 'siti', password: 'siti123', role: 'user' },
  ],
  books: [
    { id: 1, judul: 'Laskar Pelangi', pengarang: 'Andrea Hirata', penerbit: 'Bentang Pustaka', tahun_terbit: 2005, kategori: 'Novel', stok: 5, pdf_file: null, cover_url: 'https://upload.wikimedia.org/wikipedia/id/7/7f/Laskar_Pelangi.jpg' },
    { id: 2, judul: 'Bumi Manusia', pengarang: 'Pramoedya Ananta Toer', penerbit: 'GMH', tahun_terbit: 1980, kategori: 'Novel', stok: 3, pdf_file: null, cover_url: 'https://upload.wikimedia.org/wikipedia/id/1/18/Bumi_Manusia.jpg' },
    { id: 3, judul: 'Pulang', pengarang: 'Tere Liye', penerbit: 'Gramedia Pustaka Utama', tahun_terbit: 2018, kategori: 'Novel', stok: 7, pdf_file: null, cover_url: null },
    { id: 4, judul: 'Sapiens: A Brief History of Humankind', pengarang: 'Yuval Noah Harari', penerbit: 'Kompas Gramedia', tahun_terbit: 2014, kategori: 'Sains', stok: 4, pdf_file: null, cover_url: null },
    { id: 5, judul: 'Atomic Habits', pengarang: 'James Clear', penerbit: 'Gramedia Pustaka Utama', tahun_terbit: 2018, kategori: 'Self Help', stok: 6, pdf_file: null, cover_url: null },
    { id: 6, judul: 'Filosofi Teras', pengarang: 'Henry Manampiring', penerbit: 'Kompas Gramedia', tahun_terbit: 2019, kategori: 'Filsafat', stok: 3, pdf_file: null, cover_url: null },
    { id: 7, judul: 'Negeri 5 Menara', pengarang: 'Ahmad Fuadi', penerbit: 'Gramedia Pustaka Utama', tahun_terbit: 2009, kategori: 'Novel', stok: 4, pdf_file: null, cover_url: null },
    { id: 8, judul: 'Dilan: Dia adalah Dilanku Tahun 1990', pengarang: 'Pidi Baiq', penerbit: 'Distransbook', tahun_terbit: 2014, kategori: 'Novel', stok: 8, pdf_file: null, cover_url: null },
  ],
  ebooks: [
    { id: 'e-001', judul: 'Belajar JavaScript', penulis: 'John Doe', penerbit: 'Erlangga', tahun_terbit: 2023, kategori: 'Teknologi', file_url: 'https://example.com/ebook/js.pdf', pdf_file: 'belajar-javascript.pdf' },
    { id: 'e-002', judul: 'Pengantar Ilmu Komputer', penulis: 'Jane Smith', penerbit: 'Andi Publisher', tahun_terbit: 2022, kategori: 'Teknologi', file_url: 'https://example.com/ebook/cs.pdf', pdf_file: 'pengantar-ilmu-komputer.pdf' },
    { id: 'e-003', judul: 'Matematika Diskrit', penulis: 'Rinaldi Munir', penerbit: 'Informatika', tahun_terbit: 2020, kategori: 'Sains', file_url: 'https://example.com/ebook/diskrit.pdf', pdf_file: 'matematika-diskrit.pdf' },
  ],
  borrows: [
    { id: 'b-001', member_id: 'u-member-001', borrower_name: 'Budi Santoso', id_buku: 1, judul_buku: 'Laskar Pelangi', tanggal_pinjam: '2026-07-01', tanggal_kembali: '2026-07-08', dikembalikan_pada: null, status: 'dipinjam', kondisi_buku: 'aman', approval_status: 'approved' },
    { id: 'b-002', member_id: 'u-member-002', borrower_name: 'Siti Rahayu', id_buku: 2, judul_buku: 'Bumi Manusia', tanggal_pinjam: '2026-06-25', tanggal_kembali: '2026-07-02', dikembalikan_pada: '2026-07-01', status: 'dikembalikan', kondisi_buku: 'aman', approval_status: 'approved' },
    { id: 'b-003', member_id: 'u-member-001', borrower_name: 'Budi Santoso', id_buku: 4, judul_buku: 'Sapiens: A Brief History of Humankind', tanggal_pinjam: '2026-07-10', tanggal_kembali: '2026-07-17', dikembalikan_pada: null, status: 'menunggu', kondisi_buku: 'aman', approval_status: 'pending' },
  ],
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return structuredClone(defaultData)
}

function save(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function reset() {
  localStorage.removeItem(STORAGE_KEY)
}

function getData() {
  const data = load()
  if (!data.books || data.books.length === 0) {
    reset()
    return load()
  }
  return data
}

export { getData, save, reset, defaultData }
