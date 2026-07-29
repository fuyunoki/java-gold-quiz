import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/presentation/views/HomeView.vue'),
  },
  {
    path: '/quiz/:categoryId',
    name: 'quiz',
    // paramsをpropsとしてコンポーネントに渡す
    props: true,
    component: () => import('@/presentation/views/QuizView.vue'),
  },
]

export const router = createRouter({
  // GitHub Pages ではサーバ側のルーティング設定が難しいため、URL のハッシュ（#）で
  // 画面遷移を管理するハッシュ履歴を使う。深いURLの直接アクセス・リロードでも404にならない。
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})
