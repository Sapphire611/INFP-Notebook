# 功能测试指南

本文档提供了详细的功能测试步骤，用于验证从微信云开发到 Supabase 的迁移是否成功。

## 前置准备

### 1. 确认环境配置

#### INFP-cms 项目
```bash
cd /Users/liuliyi/code/INFP-cms
npm run dev
```

确保以下环境变量已配置：
- `WECHAT_APPID` - 微信小程序 AppID
- `WECHAT_SECRET` - 微信小程序 Secret
- Supabase 配置（URL 和密钥）

#### 小程序项目
1. 在微信开发者工具中打开项目
2. 确认 `.env.development` 配置正确
3. 构建项目（Ctrl/Cmd + B）

### 2. 数据库准备

1. 登录 Supabase Dashboard
2. 在 SQL Editor 中运行 `supabase/add-mbti-field.sql`
3. 确认 `wechat_users` 表存在且包含 `mbti` 字段

## 功能测试

### 测试 1: 用户登录流程

**步骤：**

1. **启动开发服务器**
   ```bash
   cd /Users/liuliyi/code/INFP-cms
   npm run dev
   ```
   确认服务器运行在 `http://localhost:3000`

2. **打开小程序**
   - 在微信开发者工具中打开小程序
   - 清除缓存：工具 → 清除缓存 → 清除全部缓存

3. **执行登录**
   - 进入登录页面
   - 点击"微信一键登录"按钮
   - 观察控制台输出

**预期结果：**
- ✅ 登录按钮显示加载状态
- ✅ 控制台输出：微信登录 code
- ✅ 控制台输出：登录结果
- ✅ 显示"登录成功"提示
- ✅ 自动跳转到个人信息编辑页面

**检查点：**
```bash
# 检查 Supabase 数据库
# 在 Supabase Dashboard 的 Table Editor 中查看 wechat_users 表
# 应该能看到新创建的用户记录，包含：
# - openid
# - wechat_nickname = "INFP 用户"
# - is_active = true
# - created_at
# - last_login_at
```

### 测试 2: 个人信息编辑

**步骤：**

1. **进入编辑页面**
   - 从登录完成后应该自动跳转到此页面
   - 或手动导航到"我的" → 编辑资料

2. **修改个人信息**
   - 点击头像选择一个新头像
   - 输入昵称（例如："测试用户"）
   - 点击"保存"按钮

**预期结果：**
- ✅ 头像选择成功
- ✅ 显示"头像已选择"提示
- ✅ 保存按钮显示加载状态
- ✅ 显示"保存成功"提示
- ✅ 自动跳转到"我的"页面

**检查点：**
```bash
# 检查 Supabase 数据库
# wechat_users 表中对应用户的记录应该更新：
# - wechat_nickname = "测试用户"
# - wechat_avatar_url = "选择的头像URL"
# - updated_at 应该是最新时间
```

### 测试 3: MBTI 设置

**步骤：**

1. **进入 MBTI 设置页面**
   - 从"我的"页面 → MBTI 设置

2. **选择 MBTI 类型**
   - 选择一个 MBTI 类型（例如：INFP）
   - 点击"保存"按钮

**预期结果：**
- ✅ 选中的 MBTI 类型高亮显示
- ✅ 显示选中标记
- ✅ 显示"保存成功"提示
- ✅ 自动返回上一页

**检查点：**
```bash
# 检查 Supabase 数据库
# wechat_users 表中对应用户的记录应该包含：
# - mbti = "INFP"
```

### 测试 4: 用户状态持久化

**步骤：**

1. **保存用户信息后**
   - 关闭小程序
   - 重新打开小程序

**预期结果：**
- ✅ 用户自动处于登录状态
- ✅ 个人信息显示正确（昵称、头像、MBTI）
- ✅ 能正常访问所有需要登录的页面

### 测试 5: 错误处理

**步骤：**

1. **测试网络错误**
   - 关闭 INFP-cms 开发服务器
   - 尝试登录
   - 观察错误提示

2. **测试无效数据**
   - 在编辑页面清空昵称
   - 点击保存
   - 观察验证提示

**预期结果：**
- ✅ 网络错误时显示友好提示
- ✅ 验证失败时显示相应提示
- ✅ 不会出现白屏或崩溃

## API 测试

### 测试微信登录 API

使用 Postman 或 curl 测试后端 API：

```bash
curl -X POST http://localhost:3000/api/wechat/login \
  -H "Content-Type: application/json" \
  -d '{
    "code": "微信登录码",
    "nickName": "测试用户",
    "avatarUrl": "https://example.com/avatar.jpg"
  }'
```

**预期响应：**
```json
{
  "success": true,
  "userInfo": {
    "openid": "用户openid",
    "nickName": "测试用户",
    "avatarUrl": "https://example.com/avatar.jpg",
    "id": "用户ID"
  }
}
```

## 数据验证

### 验证数据库记录

在 Supabase Dashboard 中执行 SQL 查询：

```sql
-- 查询所有微信用户
SELECT * FROM wechat_users ORDER BY created_at DESC;

-- 查询特定用户
SELECT * FROM wechat_users WHERE wechat_nickname = '测试用户';

-- 统计用户数量
SELECT COUNT(*) FROM wechat_users;

-- 查询最近的登录记录
SELECT openid, wechat_nickname, last_login_at
FROM wechat_users
ORDER BY last_login_at DESC
LIMIT 10;
```

### 验证字段完整性

确保以下字段都正确保存：

**必填字段：**
- ✅ `id` - UUID 格式
- ✅ `openid` - 微信 openid
- ✅ `is_active` - true
- ✅ `created_at` - 时间戳
- ✅ `updated_at` - 时间戳

**可选字段：**
- ✅ `unionid` - 如果有
- ✅ `wechat_nickname` - 用户昵称
- ✅ `wechat_avatar_url` - 头像 URL
- ✅ `mbti` - MBTI 类型
- ✅ `last_login_at` - 最后登录时间

## 性能测试

### 测试响应时间

1. **登录响应时间**
   - 从点击登录到显示成功应该 < 2 秒

2. **数据库更新时间**
   - 个人信息更新应该 < 1 秒
   - MBTI 更新应该 < 1 秒

3. **页面加载时间**
   - 各个页面加载应该流畅无卡顿

## 兼容性测试

### 测试不同环境

1. **开发环境**
   - ✅ 使用 localhost:3000 API
   - ✅ 数据保存到开发数据库

2. **真机测试**
   - ✅ 在真实手机上测试登录流程
   - ✅ 验证权限提示和授权流程

## 常见问题排查

### 问题 1: 登录失败

**可能原因：**
- INFP-cms 服务器未启动
- 微信配置错误（APPID/SECRET）
- 网络连接问题

**解决方法：**
1. 检查服务器是否运行
2. 检查环境变量配置
3. 查看控制台错误信息

### 问题 2: 数据未保存

**可能原因：**
- Supabase 连接失败
- 表结构不匹配
- 权限问题

**解决方法：**
1. 运行数据库迁移脚本
2. 检查 Supabase 配置
3. 查看 Supabase Logs

### 问题 3: 页面跳转失败

**可能原因：**
- 页面路径错误
- 页面未在 pages.json 中注册

**解决方法：**
1. 检查页面路径配置
2. 确认页面已在 pages.json 中注册

## 测试报告模板

完成测试后，填写以下报告：

```markdown
# 测试报告

**测试日期：** YYYY-MM-DD
**测试人员：** [姓名]
**测试环境：** 开发/生产

## 测试结果

- [ ] 登录功能 - 通过/失败
- [ ] 个人信息编辑 - 通过/失败
- [ ] MBTI 设置 - 通过/失败
- [ ] 状态持久化 - 通过/失败
- [ ] 错误处理 - 通过/失败

## 发现的问题

1. [问题描述]
   - 重现步骤：
   - 预期结果：
   - 实际结果：

## 建议

[改进建议]

## 备注

[其他备注信息]
```

## 总结

完成以上所有测试后，你应该能确认：

1. ✅ 用户可以成功登录
2. ✅ 个人信息可以正确保存和更新
3. ✅ MBTI 设置功能正常
4. ✅ 用户状态可以持久化
5. ✅ 错误处理机制完善
6. ✅ 数据库数据完整准确

如果所有测试都通过，说明迁移成功！可以开始部署到生产环境。
