<template>
  <section class="hero">
    <div class="hero-content">
      <p class="eyebrow">Sistem Manajemen Perpustakaan</p>
      <h1>Kelola buku, peminjaman, PDF, dan laporan dalam satu aplikasi.</h1>
      <p class="hero-copy">
        Dibuat sesuai dokumentasi TASK-001 sampai TASK-004 untuk admin, petugas, dan member.
      </p>
      <div class="hero-actions">
        <RouterLink class="btn primary" to="/books">Lihat Buku</RouterLink>
        <RouterLink v-if="!auth.isAuthenticated" class="btn ghost" to="/login">Masuk</RouterLink>
      </div>
    </div>
  </section>

  <section class="feature-grid">
    <RouterLink class="feature-card" to="/books">
      <strong>TASK-001</strong>
      <h2>Manajemen Data Buku</h2>
      <p>Tambah, lihat, edit, dan hapus data buku untuk admin.</p>
    </RouterLink>
    <RouterLink class="feature-card" to="/borrow">
      <strong>TASK-002</strong>
      <h2>Peminjaman Buku</h2>
      <p>Catat peminjaman, data peminjam, dan pengembalian buku.</p>
    </RouterLink>
    <RouterLink class="feature-card" to="/ebooks">
      <strong>TASK-003</strong>
      <h2>Akses Buku Digital</h2>
      <p>Member dapat melihat daftar buku digital dan membuka PDF.</p>
    </RouterLink>
    <RouterLink class="feature-card" to="/report">
      <strong>TASK-004</strong>
      <h2>Laporan Perpustakaan</h2>
      <p>Admin melihat keterlambatan, buku belum kembali, dan buku rusak.</p>
    </RouterLink>
  </section>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.js'

const auth = useAuthStore()
</script>
