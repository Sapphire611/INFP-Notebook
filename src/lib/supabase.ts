import { createClient } from '@supabase/supabase-js'

// 从环境变量获取 Supabase 配置
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

/**
 * 创建 Supabase 客户端
 * 用于小程序端的数据库操作
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // 小程序环境的特殊配置
    storage: {
      getItem: (key: string) => {
        return uni.getStorageSync(key) || null
      },
      setItem: (key: string, value: string) => {
        uni.setStorageSync(key, value)
      },
      removeItem: (key: string) => {
        uni.removeStorageSync(key)
      }
    },
    // 小程序中不使用自动刷新 token
    autoRefreshToken: false,
    persistSession: true,
    detectSessionInUrl: false
  }
})

/**
 * 微信用户类型定义
 */
export interface WechatUser {
  id: string
  openid: string
  unionid?: string
  profile_name?: string
  profile_phone?: string
  profile_avatar?: string
  profile_id_number?: string
  wechat_nickname?: string
  wechat_avatar_url?: string
  mbti?: string
  is_active: boolean
  last_login_at?: string
  created_at: string
  updated_at: string
}

/**
 * 用户登录结果类型定义
 */
export interface LoginResult {
  success: boolean
  userInfo?: {
    openid: string
    nickName: string
    avatarUrl: string
    mbti?: string
    id: string
  }
  error?: string
}

/**
 * 更新用户信息结果类型定义
 */
export interface UpdateProfileResult {
  success: boolean
  userInfo?: {
    openid: string
    nickName: string
    avatarUrl: string
    mbti?: string
    id: string
  }
  error?: string
}
