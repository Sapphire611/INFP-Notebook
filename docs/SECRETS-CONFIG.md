# Supabase Edge Function Secrets 配置指南

## 为什么使用 Secrets？

**安全原因**：微信小程序的 `AppSecret` 是敏感信息，绝对不能暴露在前端代码中。

## 配置步骤

### 1. 访问 Edge Functions 设置

1. 登录 [Supabase Dashboard](https://supabase.com/dashboard)
2. 选择项目：`lwkeudywhmvlimsasixo`
3. 点击左侧菜单 **Edge Functions**
4. 点击 `wechat-login` 函数（如果还没有，先部署）
5. 点击 **Settings** 标签页

### 2. 添加 Secrets

点击 **Manage secrets**，添加以下环境变量：

#### 小程序1 - INFP Notebook
```
WECHAT_APPID_1 = wx6f4d87f59edb2b75
WECHAT_SECRET_1 = 4768b1acf7662147cf440524c56dc9a4
```

#### 小程序2 - Chat（如果有）
```
WECHAT_APPID_2 = 你的chat小程序AppID
WECHAT_SECRET_2 = 你的chat小程序AppSecret
```

### 3. 保存并重新部署

添加 Secrets 后，Edge Function 会自动获取这些环境变量，无需重新部署。

## 工作原理

### 前端请求
```typescript
// 前端传递小程序编号
await supabase.functions.invoke('wechat-login', {
  body: {
    code: '微信code',
    appNumber: '1'  // 1=Notebook, 2=Chat
  }
})
```

### Edge Function 处理
```typescript
// 根据 appNumber 读取对应的 Secrets
const WECHAT_APPID = Deno.env.get(`WECHAT_APPID_${appNumber}`)
const WECHAT_SECRET = Deno.env.get(`WECHAT_SECRET_${appNumber}`)
```

## 环境变量说明

### 前端环境变量（.env.development / .env.production）

```env
# Supabase 配置
VITE_SUPABASE_URL=https://lwkeudywhmvlimsasixo.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# 当前小程序编号
VITE_APP_NUMBER=1  # 1=Notebook, 2=Chat
```

### Supabase Secrets（服务端）

```
WECHAT_APPID_1=wx6f4d87f59edb2b75
WECHAT_SECRET_1=4768b1acf7662147cf440524c56dc9a4
WECHAT_APPID_2=wx...
WECHAT_SECRET_2=...
```

## 安全优势

1. ✅ **前端不包含敏感信息** - AppSecret 不会出现在代码中
2. ✅ **支持多个小程序** - 通过编号区分不同小程序
3. ✅ **统一管理** - 所有配置在 Supabase Dashboard 中
4. ✅ **易于切换** - 只需修改 `VITE_APP_NUMBER` 即可切换小程序

## 故障排查

### 错误：小程序X未配置

**原因**：对应的 Secrets 未设置

**解决**：在 Supabase Dashboard 中添加对应的 `WECHAT_APPID_X` 和 `WECHAT_SECRET_X`

### 错误：获取 openid 失败

**可能原因**：
1. Secrets 中的 AppID 或 AppSecret 错误
2. 微信小程序未发布或未添加体验版

**解决**：
1. 检查 Secrets 中的配置是否正确
2. 确认微信公众平台中的 AppID 和 AppSecret

## 下一步

配置完成后：
1. 在小程序中测试登录功能
2. 查看 Edge Function 日志确认配置正确
3. 在 Chat 项目中也配置 `VITE_APP_NUMBER=2`
