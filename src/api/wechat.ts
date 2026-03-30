import { WECHAT_API_ENDPOINTS } from '@/config/api'

/**
 * 微信登录 API
 * 调用 INFP-cms 后端 API 进行微信登录
 */
export const wechatLoginApi = {
  /**
   * 使用微信登录码进行登录
   * @param code 微信登录码
   * @param nickName 用户昵称（可选）
   * @param avatarUrl 用户头像（可选）
   */
  async login(code: string, nickName?: string, avatarUrl?: string) {
    try {
      const response = await uni.request({
        url: WECHAT_API_ENDPOINTS.LOGIN,
        method: 'POST',
        header: {
          'Content-Type': 'application/json'
        },
        data: {
          code,
          nickName,
          avatarUrl
        }
      })

      console.log('微信登录 API 响应:', response)

      // 检查 HTTP 状态码
      if (response.statusCode !== 200) {
        throw new Error(`HTTP ${response.statusCode}: ${response.data?.error || '请求失败'}`)
      }

      const result = response.data as any

      if (result.success && result.userInfo) {
        return {
          success: true,
          userInfo: result.userInfo
        }
      } else {
        throw new Error(result.error || '登录失败')
      }
    } catch (error: any) {
      console.error('微信登录失败:', error)
      return {
        success: false,
        error: error.message || '登录失败，请重试'
      }
    }
  }
}
