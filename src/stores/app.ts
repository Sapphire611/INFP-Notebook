import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore(
  'app',
  () => {
    // 状态
    const systemInfo = ref<UniApp.GetSystemInfoResult | null>(null)
    const networkType = ref<string>('unknown')
    const statusBarHeight = ref<number>(0)

    // 方法
    const initSystemInfo = () => {
      const info = uni.getSystemInfoSync()
      systemInfo.value = info
      statusBarHeight.value = info.statusBarHeight || 0
    }

    const getNetworkType = () => {
      uni.getNetworkType({
        success: (res) => {
          networkType.value = res.networkType
        }
      })
    }

    // 监听网络状态变化
    const watchNetworkStatus = () => {
      uni.onNetworkStatusChange((res) => {
        networkType.value = res.networkType
      })
    }

    return {
      systemInfo,
      networkType,
      statusBarHeight,
      initSystemInfo,
      getNetworkType,
      watchNetworkStatus
    }
  },
  {
    persist: true
  }
)
