<template>
  <Navbar />
  <main class="app-shell">
    <router-view />
  </main>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<style scoped>
.app-shell {
  min-height: calc(100vh - 64px);
}
</style>
