<script setup>
import { ref } from 'vue'

const books = ref([
  {
    judul: "Dilan 1990",
    kategori: "Komik",
    dilihat: 1200,
    cover: "https://upload.wikimedia.org/wikipedia/id/1/19/Dilan_1990_%28poster%29.jpg"
  },
  {
    judul: "Mariposa",
    kategori: "Romansa",
    dilihat: 800,
    cover: "https://upload.wikimedia.org/wikipedia/id/thumb/b/b0/Mariposa_%28sampul%29.jpeg/250px-Mariposa_%28sampul%29.jpeg"
  },
  {
    judul: "Cantik Itu Luka",
    kategori: "Sastra",
    dilihat: 500,
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR-no59aLBrpCBiGi0gOrkg7f-krxxu9m6qKQ&s"
  },
  {
    judul: "Ancika 1995",
    kategori: "Novel",
    dilihat: 950,
    cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1629329511i/58804210.jpg"
  },
  {
    judul: "Madilog",
    kategori: "Materialisme, dialektika, dan logika",
    dilihat: 300,
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw82NB96qzqQgc635hd8opCELmk5K7T0s_ZQ&s"
  },
  {
    judul: "Kosmos",
    kategori: "Sains",
    dilihat: 300,
    cover: "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1481617477i/33368531.jpg"
  },
  {
    judul: "Seporsi mie ayam sebelum mati",
    kategori: "Novel",
    dilihat: 300,
    cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTHaHBjn2BM2xZaWZnJOtBLhtrrDAYOLgtyUg&s"
  },
  {
    judul: "The Little Prince",
    kategori: "Fantasi",
    dilihat: 300,
    cover: "https://cdn.gramedia.com/uploads/items/pangeran-cilik-le-petit-prince.jpg"
  },
  {
    judul: "Di Tanah Lada",
    kategori: "Novel",
    dilihat: 300,
    cover: "https://cdn.gramedia.com/uploads/products/a-d-i2ia-n.jpg"
  },
])
</script>

<template>
  <div class="book-list">
    <h2>📘 Buku & Sastra</h2>

    <div class="grid-container">
      <div class="card" v-for="(book, index) in books" :key="index">

        <img :src="book.cover" class="cover" />

        <p class="title">{{ book.judul }}</p>

        <p class="views">👁 {{ book.dilihat }} x dilihat</p>

        <button class="category">
          {{ book.kategori }}
        </button>

      </div>
    </div>

  </div>
</template>

<style scoped>
.book-list {
  max-width: 1100px;
  margin: 2rem auto;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
  margin-top: 1rem;
}

.grid-container .card:nth-child(n+31) {
  display: none;
}

.card {
  text-align: center;
  transition: 0.3s;
}

.card:hover {
  transform: translateY(-5px);
}

.cover {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 8px;
}

.title {
  font-size: 14px;
  margin: 8px 0;
}

.views {
  font-size: 12px;
  color: gray;
}

.category {
  margin-top: 5px;
  padding: 5px 10px;
  border: none;
  background: #2ea3f2;
  color: white;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
}
</style>
