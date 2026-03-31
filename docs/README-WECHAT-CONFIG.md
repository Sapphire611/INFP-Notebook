# 微信登录配置说明

## 环境变量配置

### 1. 复制环境变量模板

```bash
cp .env.example .env.development
cp .env.example .env.production
```

### 2. 配置微信小程序信息

编辑 `.env.development` 和 `.env.production` 文件：

```env
# Supabase 配置
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# INFP Notebook 微信小程序配置
VITE_WECHAT_APPID=wx1234567890abcdef
VITE_WECHAT_SECRET=your_app_secret
```

## 数据库配置

在 Supabase Dashboard 的 SQL Editor 中运行：

```sql
supabase/migrations/001_create_wechat_users_table.sql
```

## 使用示例

```typescript
import { wechatLoginApi } from '@/api/wechat'

// 微信登录
const result = await wechatLoginApi.login(code, nickName, avatarUrl)
if (result.success) {
  console.log('登录成功', result.userInfo)
}
```

## 注意事项

1. ⚠️ 不要将 `.env.development` 和 `.env.production` 提交到 Git
2. 这些文件已添加到 `.gitignore` 中
3. 确保 Supabase Edge Function 已部署

## 相关文件

- `src/config/wechat.ts` - 微信配置管理
- `src/api/wechat.ts` - 微信登录 API
- `supabase/functions/wechat-login/index.ts` - 登录处理函数
- `supabase/migrations/001_create_wechat_users_table.sql` - 数据库表创建
