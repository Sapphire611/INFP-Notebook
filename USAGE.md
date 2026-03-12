# uni-app Vue3 项目使用指南

## ✅ 项目状态

项目已成功创建并编译通过！

## 📦 技术栈

- **uni-app**: 3.0.0
- **Vue**: 3.4.21
- **TypeScript**: 5.4.5
- **Pinia**: 2.1.7 (状态管理)
- **Vite**: 5.2.8 (构建工具)

## 🚀 快速开始

### 1. 安装依赖（已完成）

```bash
npm install --legacy-peer-deps --cache /tmp/npm-cache
```

### 2. 运行项目

#### 微信小程序
```bash
npm run dev
```
编译完成后，在微信开发者工具中导入 `dist/dev/mp-weixin` 目录

#### H5
```bash
npm run dev:h5
```
浏览器访问 http://localhost:3000

#### APP
```bash
npm run dev:app
```

### 3. 构建生产版本

```bash
# 微信小程序
npm run build:mp-weixin

# H5
npm run build:h5

# APP
npm run build:app
```

## 📁 项目结构

```
src/
├── api/              # API 接口封装
│   └── user.ts       # 用户相关接口
├── components/       # 全局组件
├── pages/            # 页面
│   ├── index/        # 首页
│   └── login/        # 登录页
├── static/           # 静态资源
│   ├── images/       # 图片
│   └── icons/        # 图标
├── stores/           # Pinia 状态管理
│   ├── app.ts        # 应用状态
│   ├── index.ts      # 导出文件
│   └── user.ts       # 用户状态
├── styles/           # 全局样式
│   └── index.scss    # 样式变量和工具类
├── utils/            # 工具函数
│   ├── index.ts      # 导出文件
│   ├── request.ts    # 网络请求
│   ├── router.ts     # 路由导航
│   ├── storage.ts    # 本地存储
│   └── validate.ts   # 表单验证
├── types/            # TypeScript 类型定义
│   └── index.ts
├── App.vue           # 应用入口
├── env.d.ts          # 环境变量类型
├── main.ts           # 主入口
├── manifest.json     # 应用配置
└── pages.json        # 页面路由配置
```

## 🎯 核心功能

### 1. 状态管理 (Pinia)

```typescript
import { useUserStore } from '@/stores/user'

// 在组件中使用
const userStore = useUserStore()

// 登录
userStore.login(userInfo)

// 退出
userStore.logout()

// 获取用户信息
console.log(userStore.userInfo)
```

### 2. 网络请求

```typescript
import request from '@/utils/request'

// GET 请求
const data = await request.get('/api/data')

// POST 请求
const result = await request.post('/api/submit', { name: 'test' })
```

### 3. 路由导航

```typescript
import router from '@/utils/router'

// 跳转页面
router.navigateTo({
  url: '/pages/detail/index',
  params: { id: 1 }
})

// 返回
router.navigateBack(1)
```

### 4. 本地存储

```typescript
import storage from '@/utils/storage'

// 存储数据
storage.set('key', value)

// 获取数据
const data = storage.get('key')

// 删除数据
storage.remove('key')
```

### 5. 表单验证

```typescript
import Validate from '@/utils/validate'

// 验证手机号
Validate.phone('13800138000')

// 验证邮箱
Validate.email('test@example.com')
```

## 📝 开发建议

### 创建新页面

1. 在 `src/pages/` 下创建页面目录
2. 在 `src/pages.json` 中注册页面

```json
{
  "pages": [
    {
      "path": "pages/new-page/index",
      "style": {
        "navigationBarTitleText": "新页面"
      }
    }
  ]
}
```

### 创建新组件

在 `src/components/` 下创建组件，然后在页面中导入使用。

### 添加 API 接口

在 `src/api/` 下创建对应的接口文件，使用 `request` 工具发送请求。

### 添加状态管理

在 `src/stores/` 下创建新的 store 文件。

## ⚠️ 注意事项

### 1. Sass 弃用警告

项目中会出现 Sass 弃用警告，这是正常的，不影响功能。后续可以通过升级 Sass 版本或修改代码来解决。

### 2. TypeScript 类型

如果出现类型错误，确保：
- 已安装 `@dcloudio/types`
- 已安装 `@types/node`
- 重启 IDE 或 TypeScript 服务

### 3. 微信小程序

- 在微信开发者工具中导入 `dist/dev/mp-weixin` 目录
- 在 `src/manifest.json` 中配置你的小程序 AppID
- 首次运行需要在微信开发者工具中打开"不校验合法域名"

### 4. H5 开发

H5 模式默认运行在 3000 端口，可以在 `vite.config.ts` 中修改。

## 🔧 常见问题

### Q: 如何修改小程序 AppID？

编辑 `src/manifest.json`，找到 `mp-weixin.appid` 并修改为你的 AppID。

### Q: 如何添加 tabBar 图标？

1. 准备图标文件（81x81px）
2. 放入 `src/static/icons/` 目录
3. 在 `src/pages.json` 的 `tabBar` 配置中添加图标路径

### Q: Pinia 持久化不生效？

确保使用了 `pinia-plugin-persistedstate` 插件，并在 store 定义时添加 `persist` 配置。

### Q: 如何调试？

- 微信小程序：使用微信开发者工具的调试工具
- H5：使用浏览器开发者工具（F12）
- APP：使用 HBuilderX 的真机运行功能

## 📚 相关资源

- [uni-app 官方文档](https://uniapp.dcloud.net.cn/)
- [Vue 3 文档](https://cn.vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/zh/)
- [TypeScript 文档](https://www.typescriptlang.org/zh/)

## 🎉 开始开发

现在你可以开始开发了！运行 `npm run dev` 启动开发服务器。

测试账号：
- 用户名：admin
- 密码：123456

祝你开发愉快！🚀
