/**
 * 本地存储工具类
 */
class Storage {
  /**
   * 设置数据
   */
  set(key: string, value: any): boolean {
    try {
      uni.setStorageSync(key, JSON.stringify(value))
      return true
    } catch (e) {
      console.error('Storage.set error:', e)
      return false
    }
  }

  /**
   * 获取数据
   */
  get<T>(key: string): T | null {
    try {
      const value = uni.getStorageSync(key)
      return value ? JSON.parse(value) : null
    } catch (e) {
      console.error('Storage.get error:', e)
      return null
    }
  }

  /**
   * 删除数据
   */
  remove(key: string): boolean {
    try {
      uni.removeStorageSync(key)
      return true
    } catch (e) {
      console.error('Storage.remove error:', e)
      return false
    }
  }

  /**
   * 清空所有数据
   */
  clear(): boolean {
    try {
      uni.clearStorageSync()
      return true
    } catch (e) {
      console.error('Storage.clear error:', e)
      return false
    }
  }

  /**
   * 获取存储信息
   */
  getInfo(): UniApp.GetStorageInfoSuccessCallbackResult | null {
    try {
      return uni.getStorageInfoSync()
    } catch (e) {
      console.error('Storage.getInfo error:', e)
      return null
    }
  }
}

export default new Storage()
