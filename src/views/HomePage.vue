<template>
  <div class="home-page">
    <h1>Selamat Datang di Perpustakaan Sekolah Harapan Bangsa</h1>
    <p>Temukan dan pinjam buku favoritmu dengan mudah!</p>
    <div class="home-buttons">
      <router-link to="/buku" class="btn">Daftar Buku</router-link>
      <router-link to="/peminjaman" class="btn">Peminjaman</router-link>
      <router-link to="/kontak" class="btn">Kontak</router-link>
      <router-link to="/login" class="btn">Login</router-link>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: #020202;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.07);
  text-align: center;
}
.home-buttons {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}
.btn {
  display: inline-block;
  padding: 0.7rem 1.5rem;
  background: #2c3e50;
  color: #fff;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s;
}
.btn:hover {
  background: #ffd700;
  color: #2c3e50;
}
</style>
