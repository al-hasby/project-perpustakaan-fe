const STORAGE_KEY = 'perpustakaan_data'
const DATA_VERSION = 4

const defaultData = {
  users: [
    { id: 'u-admin-001', name: 'Administrator', username: 'admin', password: 'admin123', role: 'admin' },
    { id: 'u-petugas-001', name: 'Petugas Perpustakaan', username: 'petugas', password: 'petugas123', role: 'petugas' },
    { id: 'u-member-001', name: 'Budi Santoso', username: 'budi', password: 'budi123', role: 'user' },
    { id: 'u-member-002', name: 'Siti Rahayu', username: 'siti', password: 'siti123', role: 'user' },
  ],
  books: [
    { id: 1, judul: 'Laskar Pelangi', pengarang: 'Andrea Hirata', penerbit: 'Bentang Pustaka', tahun_terbit: 2005, kategori: 'Novel', stok: 5, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM8joseg3BAMnVwEg0X5gV6E2zCQ-8RK6WQ6m2-_NAtw&s=10' },
    { id: 9, judul: 'Cosmos', pengarang: 'Carl Sagan', penerbit: 'Random House', tahun_terbit: 1980, kategori: 'Sains', stok: 4, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSv6s4SC42__owu7Rm3v5zZVS05ygZHyTMRA2r2IApz_w&s=10' },
    { id: 17, judul: 'The Alchemist', pengarang: 'Paulo Coelho', penerbit: 'HarperCollins', tahun_terbit: 1988, kategori: 'Fiksi', stok: 6, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSehwFJMcR0Yps2wxi3GiaNAkVeicwaCyPkC0Wo9rExyg&s=10' },
    { id: 26, judul: 'One Piece Vol. 1', pengarang: 'Eiichiro Oda', penerbit: 'Shueisha', tahun_terbit: 1997, kategori: 'Manga', stok: 5, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsYQBbbfYwNGy5L4Bbf5roc0MyqE-KskMi6X1Pfcm80w&s=10' },
    { id: 5, judul: 'Atomic Habits', pengarang: 'James Clear', penerbit: 'Gramedia Pustaka Utama', tahun_terbit: 2018, kategori: 'Self Help', stok: 6, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZOLof-8iYsYC1wlpBR1xL4lQ3UN0DctXxgoS5ipluvw&s=10' },
    { id: 22, judul: 'Steve Jobs', pengarang: 'Walter Isaacson', penerbit: 'Simon & Schuster', tahun_terbit: 2011, kategori: 'Biografi', stok: 5, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQbl9DKc3wlXK9LT0sum5ReEvVBRc5TZ4Waq2jD8bTgiw&s=10' },
    { id: 2, judul: 'Bumi Manusia', pengarang: 'Pramoedya Ananta Toer', penerbit: 'GMH', tahun_terbit: 1980, kategori: 'Novel', stok: 3, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUSZc15KvahtWgt1lcCKza5U7N_F8UuTpa9O3kf7s-Yg&s=10' },
    { id: 15, judul: 'Man\'s Search for Meaning', pengarang: 'Viktor E. Frankl', penerbit: 'Beacon Press', tahun_terbit: 1946, kategori: 'Filsafat', stok: 4, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQWULrxvcORmfLdOELBhIbF9U9GG9F2eh5ilUlu4wm8g&s=10' },
    { id: 20, judul: 'Clean Code', pengarang: 'Robert C. Martin', penerbit: 'Prentice Hall', tahun_terbit: 2008, kategori: 'Teknologi', stok: 4, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeNqJNoSaDbPenXTJFdsuPC45f4KzgwDdLAX-7Hv2KcQ&s=10' },
    { id: 29, judul: 'Jujutsu Kaisen Vol. 1', pengarang: 'Gege Akutami', penerbit: 'Shueisha', tahun_terbit: 2018, kategori: 'Komik', stok: 6, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmbQQEYKFuaBzODvXBLgcFFu9pIlbHUu4KLVgT0JdlXg&s=10' },
    { id: 3, judul: 'Pulang', pengarang: 'Tere Liye', penerbit: 'Gramedia Pustaka Utama', tahun_terbit: 2018, kategori: 'Novel', stok: 7, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW015GBGyztX43D-sxB7xTtJhOB7Bk1vU4lJ_eCLvkUA&s=10' },
    { id: 10, judul: 'A Brief History of Time', pengarang: 'Stephen Hawking', penerbit: 'Bantam Books', tahun_terbit: 1988, kategori: 'Sains', stok: 5, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8kqra_3aZmHQRMTEWvbb49acjuVBAIPJMkfNJofq36A&s=10' },
    { id: 24, judul: 'Guns, Germs, and Steel', pengarang: 'Jared Diamond', penerbit: 'W.W. Norton', tahun_terbit: 1997, kategori: 'Sejarah', stok: 4, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-izA8tDaVboRqlvBy0TyKTx9fa-lUf454engEkWDvXw&s' },
    { id: 6, judul: 'Filosofi Teras', pengarang: 'Henry Manampiring', penerbit: 'Kompas Gramedia', tahun_terbit: 2019, kategori: 'Filsafat', stok: 3, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYPZ_3TD4nWM2H6Jg8N3Qsfyjaz98Q0iqLey5clwEBMQ&s=10' },
    { id: 27, judul: 'Naruto Vol. 1', pengarang: 'Masashi Kishimoto', penerbit: 'Shueisha', tahun_terbit: 1999, kategori: 'Manga', stok: 4, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOITGP3qfJaP282bhfJ4fLaMHAhQ98Z0bH1l4PZr2bAQ&s=10' },
    { id: 18, judul: '1984', pengarang: 'George Orwell', penerbit: 'Secker & Warburg', tahun_terbit: 1949, kategori: 'Fiksi', stok: 5, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTomHnGTBwidrV_-kg2naLXaOzp3zXJngoPSJrUc71kEA&s=10' },
    { id: 12, judul: 'The Psychology of Money', pengarang: 'Morgan Housel', penerbit: 'Harriman House', tahun_terbit: 2020, kategori: 'Self Help', stok: 5, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS4e8GZDve-S3E7Z9MWbnBg6DxpIBHTSNmmSdMV6wip4g&s=10' },
    { id: 4, judul: 'Sapiens: A Brief History of Humankind', pengarang: 'Yuval Noah Harari', penerbit: 'Kompas Gramedia', tahun_terbit: 2014, kategori: 'Sains', stok: 4, pdf_file: null, cover_url: 'https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1703329310i/23692271.jpg' },
    { id: 23, judul: 'Elon Musk', pengarang: 'Ashlee Vance', penerbit: 'HarperCollins', tahun_terbit: 2015, kategori: 'Biografi', stok: 4, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTJd1fH696cfKvSoCzp2Cw1M_QNjIW7ZR29k3jjbicXHA&s=10' },
    { id: 30, judul: 'Frieren: Beyond Journey\'s End', pengarang: 'Kanehito Yamada', penerbit: 'Shogakukan', tahun_terbit: 2020, kategori: 'Komik', stok: 3, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZudB8Up23o2g3vs8T4swsIL_Ri_BtJ8z2UuZM08ukoA&s=10' },
    { id: 7, judul: 'Negeri 5 Menara', pengarang: 'Ahmad Fuadi', penerbit: 'Gramedia Pustaka Utama', tahun_terbit: 2009, kategori: 'Novel', stok: 4, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6PBeeBTNHLChOeI6lqSjax5Fg6XxMm2Eop3RieO6msA&s=10' },
    { id: 11, judul: 'The Origin of Species', pengarang: 'Charles Darwin', penerbit: 'John Murray', tahun_terbit: 1859, kategori: 'Sains', stok: 3, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxy_0T66sRC95_U5h4AY6qKRCEGuIqY1Rjs7bRmlv1jg&s=10' },
    { id: 19, judul: 'To Kill a Mockingbird', pengarang: 'Harper Lee', penerbit: 'J.B. Lippincott & Co.', tahun_terbit: 1960, kategori: 'Fiksi', stok: 4, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSoZkGFEB4vKCuSg-nFZJxH1eKflqVRRdtz1WGL6glhZQ&s=10' },
    { id: 25, judul: 'The Diary of a Young Girl', pengarang: 'Anne Frank', penerbit: 'Contact Publishing', tahun_terbit: 1947, kategori: 'Biografi', stok: 4, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx9iiKDQVU5_2JkWpRhYl3HIYpBrZnyw4DtoY5-lGUsg&s=10' },
    { id: 28, judul: 'Attack on Titan Vol. 1', pengarang: 'Hajime Isayama', penerbit: 'Kodansha', tahun_terbit: 2009, kategori: 'Manga', stok: 3, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzJKujeLdntIQRNWy-Ay68wUhOSWdebXtkJanB9rt8vA&s=10' },
    { id: 8, judul: 'Dilan: Dia adalah Dilanku Tahun 1990', pengarang: 'Pidi Baiq', penerbit: 'Distransbook', tahun_terbit: 2014, kategori: 'Novel', stok: 8, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhHU-Ix2TWbcolpaPMRnLzvNe_T7KignmFB2WPZinYBg&s=10' },
    { id: 16, judul: 'The Art of War', pengarang: 'Sun Tzu', penerbit: 'Various', tahun_terbit: -500, kategori: 'Filsafat', stok: 6, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx7Tf3Ukqhyc0umfAIAOl2iVUKX-40uvptoLSApYhZ2A&s=10' },
    { id: 13, judul: 'Deep Work', pengarang: 'Cal Newport', penerbit: 'Grand Central Publishing', tahun_terbit: 2016, kategori: 'Self Help', stok: 4, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQZvEDzwiepTVQrGv-mi52_-0_8CN49Ios4-68y1BeHAQ&s=10' },
    { id: 14, judul: 'Think and Grow Rich', pengarang: 'Napoleon Hill', penerbit: 'The Ralston Society', tahun_terbit: 1937, kategori: 'Self Help', stok: 6, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHnG8jfhX1K3pKLdmnj10oMULxHUR-8AuTftNyeZqZnQ&s=10' },
    { id: 21, judul: 'The Lean Startup', pengarang: 'Eric Ries', penerbit: 'Crown Business', tahun_terbit: 2011, kategori: 'Teknologi', stok: 5, pdf_file: null, cover_url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA9bh-eWN7VxF_sGzgyoqDZKRkLSCgsyLoSEWoqa39Kg&s=10' },
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
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed._version === DATA_VERSION) return parsed
    }
  } catch {}
  return structuredClone(defaultData)
}

function save(data) {
  data._version = DATA_VERSION
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