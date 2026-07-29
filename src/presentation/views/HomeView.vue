<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Category } from '@/domain/entities/Category'
import { container } from '@/composition/container'

const router = useRouter()
const categories = ref<readonly Category[]>([])
const loading = ref(true)

onMounted(async () => {
  categories.value = await container.listCategories.execute()
  loading.value = false
})

function openCategory(id: string): void {
  router.push({ name: 'quiz', params: { categoryId: id } })
}
</script>

<template>
  <div class="home">
    <p v-if="loading" class="status">読み込み中…</p>

    <ul v-else class="list">
      <li v-for="cat in categories" :key="cat.id">
        <button type="button" class="cat" @click="openCategory(cat.id)">
          <span class="cat__name">{{ cat.name }}</span>
          <span class="cat__desc">{{ cat.description }}</span>
        </button>
      </li>
    </ul>

    <p v-if="!loading && categories.length === 0" class="status">
      分野がまだありません。
    </p>
  </div>
</template>

<style scoped>
.home {
  padding: 16px;
}
.status {
  text-align: center;
  color: var(--muted);
  padding: 40px 0;
}
.list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.cat {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 18px 16px;
  border: none;
  border-radius: 14px;
  background: var(--surface);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  text-align: left;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
.cat:active {
  background: var(--accent-weak);
}
.cat__name {
  font-size: 17px;
  font-weight: 700;
  color: var(--accent);
}
.cat__desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--muted);
}
</style>
