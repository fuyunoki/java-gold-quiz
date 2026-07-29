<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const router = useRouter()

const isHome = computed(() => route.name === 'home')
</script>

<template>
  <div class="app">
    <header class="appbar">
      <button
        v-if="!isHome"
        type="button"
        class="appbar__back"
        aria-label="戻る"
        @click="router.back()"
      >
        ‹
      </button>
      <h1 class="appbar__title">Java Gold SE17 復習</h1>
    </header>

    <main class="app__main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
.appbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 4px;
  padding: calc(env(safe-area-inset-top, 0px) + 10px) 16px 10px;
  background: var(--accent);
  color: #fff;
}
.appbar__back {
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  line-height: 1;
  padding: 0 8px 2px 0;
  cursor: pointer;
}
.appbar__title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
}
.app__main {
  flex: 1 1 auto;
  max-width: 640px;
  width: 100%;
  margin: 0 auto;
}
</style>
