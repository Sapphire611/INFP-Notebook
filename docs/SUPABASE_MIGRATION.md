# 微信小程序从微信云开发迁移到 Supabase

本文档说明了如何将 INFP Notebook 微信小程序从微信云开发迁移到 Supabase。

## 迁移概述

本次迁移将微信小程序的后端从微信云开发改为使用 Supabase 数据库，与 INFP-cms 项目共享同一个数据库实例。

## 主要变更

### 1. 依赖安装

添加了 `@supabase/supabase-js` 依赖：
```bash
npm install @supabase/supabase-js
```

### 2. 环境配置

在 `.env.development` 和 `.env.production` 中添加了以下配置：

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://lwkeudywhmvlimsasixo.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# INFP-cms API 端点
VITE_APP_API_BASE_URL=http://localhost:3000  # 开发环境
# VITE_APP_API_BASE_URL=https://your-production-server.com  # 生产环境
```

### 3. 新增文件

- `src/lib/supabase.ts` - Supabase 客户端配置
- `src/api/supabase.ts` - Supabase API 封装
- `src/api/wechat.ts` - 微信登录 API 调用
- `src/config/api.ts` - API 配置
- `supabase/add-mbti-field.sql` - 数据库迁移脚本

### 4. 修改的文件

- `src/stores/user.ts` - 更新用户 Store 以支持 Supabase
- `src/pages/login/index.vue` - 使用新的登录 API
- `src/pages/profile-edit/index.vue` - 使用 Supabase 更新用户信息
- `src/pages/mbti-setting/index.vue` - 使用 Supabase 更新 MBTI 设置

## 数据库变更

### 1. 添加 MBTI 字段

在 Supabase SQL Editor 中运行以下脚本：

```sql
-- 为 wechat_users 表添加 mbti 字段
ALTER TABLE wechat_users
ADD COLUMN IF NOT EXISTS mbti TEXT;

-- 添加索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_wechat_users_mbti ON wechat_users(mbti);

-- 添加注释
COMMENT ON COLUMN wechat_users.mbti IS '用户的 MBTI 人格类型';
```

脚本位置：`supabase/add-mbti-field.sql`

### 2. 数据表结构

使用 INFP-cms 项目中的 `wechat_users` 表，主要字段：

- `id` - 主键
- `openid` - 微信 openid（唯一）
- `unionid` - 微信 unionid（可选）
- `wechat_nickname` - 微信昵称
- `wechat_avatar_url` - 微信头像 URL
- `profile_name` - 用户真实姓名
- `profile_phone` - 用户电话
- `profile_avatar` - 用户头像
- `mbti` - MBTI 人格类型（新增）
- `is_active` - 是否激活
- `last_login_at` - 最后登录时间
- `created_at` - 创建时间
- `updated_at` - 更新时间

## 后端 API

### 微信登录 API

在 INFP-cms 项目中新增了微信登录 API：

**端点：** `POST /api/wechat/login`

**请求体：**
```json
{
  "code": "微信登录码",
  "nickName": "用户昵称（可选）",
  "avatarUrl": "用户头像（可选）"
}
```

**响应：**
```json
{
  "success": true,
  "userInfo": {
    "openid": "用户openid",
    "nickName": "用户昵称",
    "avatarUrl": "用户头像",
    "id": "用户ID"
  }
}
```

文件位置：`/Users/liuliyi/code/INFP-cms/src/app/api/wechat/login/route.ts`

## 部署步骤

### 1. 配置 INFP-cms 环境

确保 INFP-cms 项目的 `.env` 文件中包含正确的微信配置：

```env
WECHAT_APPID="your-wechat-appid"
WECHAT_SECRET="your-wechat-secret"
```

### 2. 运行数据库迁移

在 Supabase SQL Editor 中运行 `supabase/add-mbti-field.sql` 脚本。

### 3. 启动 INFP-cms 开发服务器

```bash
cd /Users/liuliyi/code/INFP-cms
npm run dev
```

确保服务器运行在 `http://localhost:3000`

### 4. 配置小程序

1. 在微信开发者工具中打开小程序项目
2. 确保 `.env.development` 中的配置正确
3. 构建并运行小程序

### 5. 测试登录流程

1. 在小程序中点击"微信一键登录"
2. 确认登录成功并能正确跳转到个人信息编辑页面
3. 编辑个人信息并保存
4. 检查 Supabase 数据库中的 `wechat_users` 表，确认数据正确保存

## 微信小程序配置

### 服务器域名配置

在微信公众平台配置以下服务器域名：

**request 合法域名：**
- 开发环境：不需要配置（开发工具中可跳过）
- 生产环境：需要配置 INFP-cms 的生产服务器域名

**uploadFile 合法域名：**
- 如果需要上传文件，配置相应的域名

## 注意事项

1. **安全性**：
   - 不要在小程序端暴露 Supabase service_role key
   - 微信 appsecret 应该只在后端服务器中使用
   - 生产环境使用 HTTPS

2. **数据同步**：
   - 小程序和 CMS 现在共享同一个数据库
   - 确保两个项目的数据模型保持一致

3. **错误处理**：
   - 所有 API 调用都有错误处理
   - 用户会看到友好的错误提示

4. **性能优化**：
   - 添加了数据库索引以提高查询性能
   - 使用了小程序本地存储来缓存用户信息

## 回滚方案

如果需要回滚到微信云开发：

1. 恢复 `src/pages/login/index.vue`、`src/pages/profile-edit/index.vue`、`src/pages/mbti-setting/index.vue` 的原始版本
2. 恢复 `src/stores/user.ts` 的原始版本
3. 删除新增的文件（`src/lib/supabase.ts`、`src/api/supabase.ts` 等）
4. 确保微信云开发的云函数已部署

## 后续优化建议

1. **添加更多功能**：
   - 支持手机号绑定
   - 支持邮箱绑定
   - 添加用户权限管理

2. **性能优化**：
   - 添加数据缓存机制
   - 优化数据库查询
   - 添加 CDN 加速

3. **用户体验**：
   - 添加加载动画
   - 优化错误提示
   - 添加更多个性化设置

## 联系与支持

如有问题，请联系开发团队或查看项目文档。
