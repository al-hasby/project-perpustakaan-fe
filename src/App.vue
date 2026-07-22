<template>
  <div class="app-layout">
    <button
      v-if="showSidebar"
      class="hamburger-btn"
      type="button"
      @click="sidebarOpen = !sidebarOpen"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    </button>
    <Navbar v-if="showSidebar" :mobile-open="sidebarOpen" @close="sidebarOpen = false" />
    <main :class="['main-content', { 'with-sidebar': showSidebar }]">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'
import Navbar from '@/components/Navbar.vue'

const route = useRoute()
const auth = useAuthStore()
const sidebarOpen = ref(false)

const showSidebar = computed(() => {
  if (route.meta?.guestOnly) return false
  return auth.isAuthenticated
})

watch(() => route.path, () => { sidebarOpen.value = false })
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

.hamburger-btn {
  display: none;
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 31;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
  color: var(--color-text);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.hamburger-btn:hover {
  background: #F1F5F9;
}

@media (max-width: 768px) {
  .hamburger-btn {
    display: grid;
  }

  .main-content.with-sidebar {
    margin-left: 0;
  }
}
</style>
