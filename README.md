# uni-app Vue3 项目脚手架

基于 **uni-app** + **Vue3** + **TypeScript** + **Pinia** + **uni-ui** 的跨平台应用开发模板。

## 技术栈

- **uni-app**: 跨平台应用开发框架
- **Vue 3**: 渐进式 JavaScript 框架
- **TypeScript**: JavaScript 的超集，提供类型安全
- **Pinia**: Vue 官方推荐的状态管理库
- **uni-ui**: uni-app 官方 UI 组件库

## 项目结构

```
uni-app-test/
├── src/
│   ├── api/              # API 接口
│   ├── components/       # 全局组件
│   ├── pages/            # 页面
│   │   ├── index/        # 首页
│   │   └── login/        # 登录页
│   ├── static/           # 静态资源
│   │   ├── images/       # 图片
│   │   └── icons/        # 图标
│   ├── stores/           # Pinia 状态管理
│   ├── styles/           # 全局样式
│   ├── utils/            # 工具函数
│   ├── App.vue           # 应用入口
│   ├── env.d.ts          # 环境变量类型定义
│   ├── main.ts           # 主入口文件
│   ├── manifest.json     # 应用配置
│   └── pages.json        # 页面路由配置
├── types/                # 类型定义
├── .env.development      # 开发环境变量
├── .env.production       # 生产环境变量
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
└── vite.config.ts        # Vite 配置
```

## 快速开始

### 安装依赖

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 运行项目

```bash
# 微信小程序
npm run dev:mp-weixin

# H5
npm run dev:h5

# APP
npm run dev:app
```

### 构建项目

```bash
# 微信小程序
npm run build:mp-weixin

# H5
npm run build:h5

# APP
npm run build:app
```

## 核心功能

### 1. 状态管理 (Pinia)

使用 Pinia 进行状态管理，支持持久化存储。

```typescript
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
userStore.login(userInfo)
```

### 2. 网络请求

封装了基于 uni.request 的网络请求工具，支持请求/响应拦截。

```typescript
import request from '@/utils/request'

request.get('/api/data')
request.post('/api/submit', data)
```

### 3. 路由导航

封装了路由跳转工具，简化页面导航。

```typescript
import router from '@/utils/router'

router.navigateTo({ url: '/pages/detail/index', params: { id: 1 } })
```

### 4. 本地存储

封装了 uni.storage 的存储工具。

```typescript
import storage from '@/utils/storage'

storage.set('key', value)
const data = storage.get('key')
```

### 5. 表单验证

提供了常用的表单验证方法。

```typescript
import Validate from '@/utils/validate'

Validate.phone('13800138000')
Validate.email('test@example.com')
```

## 环境变量

项目支持不同环境的配置：

- `.env.development` - 开发环境
- `.env.production` - 生产环境

使用方式：

```typescript
const apiUrl = import.meta.env.VITE_APP_API_BASE_URL
```

## TypeScript 支持

项目完全使用 TypeScript 编写，提供完整的类型定义。

## uni-ui 组件使用

项目已配置 uni-ui 组件库自动导入，直接在页面中使用即可：

```vue
<template>
  <uni-button type="primary">按钮</uni-button>
  <uni-card title="卡片">
    卡片内容
  </uni-card>
</template>
```

## 开发建议

1. **组件开发**: 组件放在 `src/components` 目录下
2. **页面开发**: 页面放在 `src/pages` 目录下，并在 `pages.json` 中注册
3. **API 管理**: API 接口放在 `src/api` 目录下
4. **类型定义**: 类型定义放在 `src/types` 目录下
5. **样式管理**: 使用 SCSS，通用样式放在 `src/styles` 目录下

## 常见问题

### 1. TypeScript 报错

确保已安装 `@dcloudio/types` 类型定义包。

### 2. uni-ui 组件不显示

检查 `pages.json` 中的 `easycom` 配置是否正确。

### 3. Pinia 持久化不生效

确保 `pinia-plugin-persistedstate` 已正确配置。

## License

MIT
