import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase, type WechatUser } from '@/lib/supabase'

export interface UserInfo {
  openid?: string
  nickName: string
  avatarUrl: string
  mbti?: string
  id?: string
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 状态
    const userInfo = ref<UserInfo | null>(null)
    const token = ref<string>('')
    const session = ref<any>(null)

    // 计算属性
    const isLogin = computed(() => !!userInfo.value)

    // 方法
    const login = async (info: UserInfo) => {
      userInfo.value = info
      // 注意：不再使用 mock token，实际场景中应该从服务端获取
      token.value = 'supabase-token-' + Date.now()

      // 保存到本地存储
      uni.setStorageSync('userInfo', info)
      uni.setStorageSync('token', token.value)
    }

    const logout = () => {
      userInfo.value = null
      token.value = ''
      session.value = null

      // 清除本地存储
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('token')
      uni.removeStorageSync('supabase-session')
    }

    const loadUserInfo = () => {
      // 从本地存储加载用户信息
      const storedUserInfo = uni.getStorageSync('userInfo')

      if (storedUserInfo) {
        userInfo.value = storedUserInfo
        token.value = uni.getStorageSync('token') || ''

        // 尝试加载 Supabase session
        const storedSession = uni.getStorageSync('supabase-session')
        if (storedSession) {
          session.value = storedSession
        }
      }
    }

    // 更新用户信息
    const updateUserInfo = (info: Partial<UserInfo>) => {
      if (userInfo.value) {
        userInfo.value = { ...userInfo.value, ...info }
        // 同步到本地存储
        uni.setStorageSync('userInfo', userInfo.value)
      }
    }

    // 从 Supabase 用户数据转换为 UserInfo
    const fromSupabaseUser = (supabaseUser: WechatUser): UserInfo => {
      return {
        id: supabaseUser.id,
        openid: supabaseUser.openid,
        nickName: supabaseUser.wechat_nickname || supabaseUser.profile_name || 'INFP 用户',
        avatarUrl: supabaseUser.wechat_avatar_url || supabaseUser.profile_avatar || '',
        mbti: '' // mbti 字段可能需要单独存储
      }
    }

    return {
      userInfo,
      token,
      session,
      isLogin,
      login,
      logout,
      loadUserInfo,
      updateUserInfo,
      fromSupabaseUser
    }
  },
  {
    persist: {
      key: 'user-store',
      storage: {
        getItem: (key: string) => uni.getStorageSync(key),
        setItem: (key: string, value: string) => uni.setStorageSync(key, value)
      }
    }
  }
)
