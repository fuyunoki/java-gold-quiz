import { createApp } from 'vue'
import App from './App.vue'
import { router } from './presentation/router'
import './assets/main.css'

createApp(App).use(router).mount('#app')
