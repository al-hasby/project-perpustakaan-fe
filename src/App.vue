<template>
  <div class="app-layout">
    <Navbar v-if="showSidebar" />
    <main :class="['main-content', { 'with-sidebar': showSidebar }]">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()
const auth = useAuthStore()

const showSidebar = computed(() => {
  if (route.meta?.guestOnly) return false
  return auth.isAuthenticated
})
</script>

<style>
.app-layout {
  min-height: 100vh;
}

.main-content {
  min-height: 100vh;
  background: var(--color-bg);
}

.main-content.with-sidebar {
  margin-left: 240px;
}
</style>
