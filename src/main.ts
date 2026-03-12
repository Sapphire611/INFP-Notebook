import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)

  // 创建 Pinia 状态管理
  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)
  app.use(pinia)

  return {
    app,
    pinia
  }
}
