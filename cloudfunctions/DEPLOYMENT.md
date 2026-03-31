# Supabase 微信登录部署指南

## 部署步骤

### 1. 运行数据库迁移

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目
3. 点击 **SQL Editor**
4. 复制并运行 `supabase/migrations/001_create_wechat_users_table.sql`

### 2. 部署 Edge Function

1. 在 Supabase Dashboard 中，点击 **Edge Functions**
2. 点击 **Create a function**
3. 函数名称：`wechat-login`
4. 复制 `supabase/functions/wechat-login/index.ts` 的全部内容
5. 点击 **Deploy function**

### 3. 配置 Secrets（重要！）

在 Supabase Dashboard 中：

1. **Edge Functions** > **wechat-login** > **Settings**
2. 点击 **Manage secrets**
3. 添加以下变量：

#### 小程序1 - INFP Notebook
```
WECHAT_APPID_1 = wx6f4d87f59edb2b75
WECHAT_SECRET_1 = 4768b1acf7662147cf440524c56dc9a4
```

#### 小程序2 - Chat（如果有）
```
WECHAT_APPID_2 = [Chat的AppID]
WECHAT_SECRET_2 = [Chat的AppSecret]
```

## 工作原理

### 多小程序支持

使用同一个 Edge Function 支持多个小程序：

```typescript
// 前端请求
{
  "code": "微信code",
  "appNumber": "1"  // 1=Notebook, 2=Chat
}

// Edge Function 读取对应的 Secrets
const APPID = Deno.env.get(`WECHAT_APPID_${appNumber}`)
const SECRET = Deno.env.get(`WECHAT_SECRET_${appNumber}`)
```

### 安全设计

- ✅ 前端不存储 `AppSecret`
- ✅ 所有密钥存储在 Supabase Secrets
- ✅ 通过 `appNumber` 区分不同小程序
- ✅ 每个小程序的配置独立管理

## 测试

### 使用 curl 测试

```bash
curl -i -X POST https://lwkeudywhmvlimsasixo.supabase.co/functions/v1/wechat-login \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"code":"test_code","appNumber":"1"}'
```

### 在小程序中测试

直接在小程序中调用登录功能，查看控制台输出。

## 查看日志

在 Supabase Dashboard 中：
1. **Edge Functions** > **wechat-login**
2. 点击 **Logs** 标签页

## 故障排查

### 错误：小程序X未配置

**原因**：对应的 Secrets 未设置

**解决**：在 Supabase Dashboard 中添加 `WECHAT_APPID_X` 和 `WECHAT_SECRET_X`

### 错误：获取 openid 失败

**检查**：
1. Secrets 中的 AppID 和 AppSecret 是否正确
2. 微信小程序是否已发布（或添加为体验版）
3. 在微信公众平台查看 AppID 和 AppSecret

## 环境变量说明

### 前端环境变量

```env
# .env.development / .env.production
VITE_SUPABASE_URL=https://lwkeudywhmvlimsasixo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
VITE_APP_NUMBER=1  # 当前小程序编号
```

### Supabase Secrets（服务端）

```
WECHAT_APPID_1=wx6f4d87f59edb2b75
WECHAT_SECRET_1=4768b1acf7662147cf440524c56dc9a4
WECHAT_APPID_2=wx...
WECHAT_SECRET_2=...
```

## 相关文档

- `SECRETS-CONFIG.md` - Secrets 配置详细指南
- `SETUP-COMPLETE.md` - 配置完成检查清单
- `README-WECHAT-CONFIG.md` - 微信登录配置说明
