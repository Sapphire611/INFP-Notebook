import type { NavigateOptions } from '@/types'

/**
 * 路由导航工具类
 */
class Router {
  /**
   * 跳转到 tabBar 页面
   */
  switchTab(options: NavigateOptions) {
    const url = this.buildUrl(options.url, options.params)
    uni.switchTab({
      url,
      animationType: options.animationType,
      animationDuration: options.animationDuration
    })
  }

  /**
   * 跳转到非 tabBar 页面
   */
  navigateTo(options: NavigateOptions) {
    const url = this.buildUrl(options.url, options.params)
    uni.navigateTo({
      url,
      animationType: options.animationType,
      animationDuration: options.animationDuration
    })
  }

  /**
   * 返回上一页面
   */
  navigateBack(delta: number = 1) {
    uni.navigateBack({ delta })
  }

  /**
   * 关闭所有页面，打开到应用内的某个页面
   */
  reLaunch(options: NavigateOptions) {
    const url = this.buildUrl(options.url, options.params)
    uni.reLaunch({ url })
  }

  /**
   * 关闭当前页面，跳转到应用内的某个页面
   */
  redirectTo(options: NavigateOptions) {
    const url = this.buildUrl(options.url, options.params)
    uni.redirectTo({ url })
  }

  /**
   * 构建 URL（包含参数）
   */
  private buildUrl(path: string, params?: Record<string, any>): string {
    if (!params || Object.keys(params).length === 0) {
      return path
    }

    const query = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')

    return `${path}?${query}`
  }

  /**
   * 获取页面参数
   */
  getParams<T = any>(): T {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    return (currentPage as any)?.options || {} as T
  }
}

export default new Router()
