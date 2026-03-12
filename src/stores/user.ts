import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface UserInfo {
  openid?: string
  nickName: string
  avatarUrl: string
  mbti?: string
}

export const useUserStore = defineStore(
  'user',
  () => {
    // 状态
    const userInfo = ref<UserInfo | null>(null)
    const token = ref<string>('')

    // 计算属性
    const isLogin = computed(() => !!userInfo.value)

    // 方法
    const login = (info: UserInfo) => {
      userInfo.value = info
      token.value = 'mock-token-' + Date.now()
      // 保存到本地存储
      uni.setStorageSync('userInfo', info)
      uni.setStorageSync('token', token.value)
    }

    const logout = () => {
      userInfo.value = null
      token.value = ''
      // 清除本地存储
      uni.removeStorageSync('userInfo')
      uni.removeStorageSync('token')
    }

    const loadUserInfo = () => {
      // 从本地存储加载用户信息
      const storedUserInfo = uni.getStorageSync('userInfo')

      if (storedUserInfo) {
        userInfo.value = storedUserInfo
        token.value = uni.getStorageSync('token') || ''
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

    return {
      userInfo,
      token,
      isLogin,
      login,
      logout,
      loadUserInfo,
      updateUserInfo
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
