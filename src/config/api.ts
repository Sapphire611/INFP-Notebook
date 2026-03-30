/**
 * API 配置
 */

// 从环境变量获取 API 基础 URL
// 在开发环境中，使用本地开发服务器
// 在生产环境中，使用实际的生产服务器 URL
const API_BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:3000'

// 微信相关 API 端点
export const WECHAT_API_ENDPOINTS = {
  // 微信登录
  LOGIN: `${API_BASE_URL}/api/wechat/login`,
  // 微信更新用户信息（可选，如果需要通过后端更新）
  UPDATE_PROFILE: `${API_BASE_URL}/api/wechat/update-profile`
}

// 获取完整的 API URL
export const getApiUrl = (endpoint: string): string => {
  return endpoint
}
