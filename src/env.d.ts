/// <reference types="@dcloudio/types" />

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    // 全局属性可以在这里定义
  }
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_API_BASE_URL: string
  readonly VITE_APP_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
