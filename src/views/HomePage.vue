<template>
  <div class="dashboard">

    <!-- Sidebar -->
    <div class="sidebar">
      <h1>📚 BookNest</h1>
      <ul>
        <li>
          <router-link to="/" class="menu">Management Siswa</router-link>
        </li>
        <li>
          <router-link to="/buku" class="menu">Data Buku</router-link>
        </li>
        <li>
          <router-link to="/peminjaman" class="menu">Peminjaman</router-link>
        </li>
        <li>
          <router-link to="/login" class="menu">Logout</router-link>
        </li>
      </ul>
    </div>

    <!-- Main -->
    <div class="main">
      <h1>Management Siswa</h1>
      <p>Kelola data siswa dengan mudah</p>

      <!-- Form -->
      <div class="form">
        <input v-model="nama" placeholder="Nama siswa" />
        <input v-model="kelas" placeholder="Kelas" />
        <button @click="tambahSiswa">Tambah</button>
      </div>

      <!-- Table -->
      <table>
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(s, i) in siswa" :key="i">
            <td>{{ i + 1 }}</td>
            <td>{{ s.nama }}</td>
            <td>{{ s.kelas }}</td>
            <td>
              <button class="hapus" @click="hapusSiswa(i)">Hapus</button>
            </td>
          </tr>
        </tbody>
      </table>

    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'

const siswa = ref([
  { nama: 'Aqil', kelas: 'XI PPLG 3' },
  { nama: 'Al', kelas: 'XI PPLG 3' },
  { nama: 'Ridho', kelas: 'XI PPLG 3' },
  { nama: 'Novita', kelas: 'XI PPLG 3' },
  { nama: 'Alya', kelas: 'XI PPLG 3' },
  { nama: 'Alifah', kelas: 'XI PPLG 3' },
  { nama: 'Tasya', kelas: 'XI PPLG 3' }
])

const nama = ref('')
const kelas = ref('')

const tambahSiswa = () => {
  if (!nama.value || !kelas.value) return
  siswa.value.push({
    nama: nama.value,
    kelas: kelas.value
  })
  nama.value = ''
  kelas.value = ''
}

const hapusSiswa = (i) => {
  siswa.value.splice(i, 1)
}
</script>

<style scoped>
.dashboard {
  display: flex;
  height: 100vh;
  width: 100%;
  background: #f4f6f9;
  font-family: Arial, Helvetica, sans-serif;
}

/* Sidebar */
.sidebar {
  width: 220px;
  background: #2c3e50;
  color: white;
  padding: 20px;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.menu {
  display: block;
  color: white;
  text-decoration: none;
  padding: 10px;
  cursor: pointer;
}

.menu:hover {
  background: #34495e;
}

.menu.active {
  background: #34495e;
}

/* Main */
.main {
  flex: 1;
  padding: 20px;
}

/* Form */
.form {
  margin: 20px 0;
}

.form input {
  padding: 8px;
  margin-right: 10px;
}

.form button {
  padding: 8px 12px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: 0.3ms;
}

.form button:hover {
  background-color: #219150;
}

/* Table */
table {
  width: 100%;
  background: white;
  border-collapse: collapse;
}

th, td {
  text-align: center;
  padding: 10px;
  border-bottom: 1px solid #ddd;
}

.hapus {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.3s;
}

.hapus:hover {
  background-color: #c0392b;
}

@media (max-width: 600px) {
  .form-input {
    flex-direction: column;
  }
}
</style>