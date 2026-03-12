import type { ApiResponse, RequestConfig } from '@/types'

const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL

/**
 * HTTP 请求类
 */
class Request {
  private baseURL: string
  private timeout: number
  private header: any

  constructor(baseURL: string = '', timeout: number = 30000) {
    this.baseURL = baseURL
    this.timeout = timeout
    this.header = {
      'Content-Type': 'application/json'
    }
  }

  /**
   * 设置请求头
   */
  setHeader(key: string, value: string) {
    this.header[key] = value
  }

  /**
   * 设置 Token
   */
  setToken(token: string) {
    this.setHeader('Authorization', `Bearer ${token}`)
  }

  /**
   * 移除 Token
   */
  removeToken() {
    delete this.header.Authorization
  }

  /**
   * 请求拦截器
   */
  private interceptRequest(options: UniApp.RequestOptions) {
    // 添加 token
    const token = uni.getStorageSync('token')
    if (token) {
      options.header = {
        ...options.header,
        Authorization: `Bearer ${token}`
      }
    }

    // 添加时间戳防止缓存
    if (options.method === 'GET') {
      options.data = {
        ...options.data,
        _t: Date.now()
      }
    }

    return options
  }

  /**
   * 响应拦截器
   */
  private interceptResponse(response: UniApp.RequestSuccessCallbackResult) {
    const { statusCode, data } = response

    // HTTP 状态码检查
    if (statusCode !== 200) {
      this.handleError(`HTTP Error: ${statusCode}`)
      return Promise.reject(response)
    }

    // 业务状态码检查
    const result = data as ApiResponse
    if (result.code !== 0) {
      this.handleError(result.message)
      return Promise.reject(result)
    }

    return result.data
  }

  /**
   * 错误处理
   */
  private handleError(message: string) {
    uni.showToast({
      title: message,
      icon: 'none',
      duration: 3000
    })

    // Token 过期处理
    if (message.includes('token') || message.includes('登录')) {
      // 清除用户信息
      uni.removeStorageSync('token')
      uni.removeStorageSync('userInfo')

      // 跳转到登录页
      setTimeout(() => {
        uni.reLaunch({
          url: '/pages/login/index'
        })
      }, 1500)
    }
  }

  /**
   * 通用请求���法
   */
  private request<T>(config: RequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      const options: UniApp.RequestOptions = {
        url: this.baseURL + config.url,
        method: config.method || 'GET',
        data: config.data,
        header: {
          ...this.header,
          ...config.header
        },
        timeout: config.timeout || this.timeout,
        success: (res) => {
          this.interceptResponse(res)
            .then(resolve)
            .catch(reject)
        },
        fail: (err) => {
          this.handleError('网络请求失败')
          reject(err)
        }
      }

      // 请求拦截
      const interceptedOptions = this.interceptRequest(options)

      uni.request(interceptedOptions)
    })
  }

  /**
   * GET 请求
   */
  get<T>(url: string, params?: any, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: 'GET',
      data: params,
      ...config
    })
  }

  /**
   * POST 请求
   */
  post<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...config
    })
  }

  /**
   * PUT 请求
   */
  put<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...config
    })
  }

  /**
   * DELETE 请求
   */
  delete<T>(url: string, data?: any, config?: Partial<RequestConfig>): Promise<T> {
    return this.request<T>({
      url,
      method: 'DELETE',
      data,
      ...config
    })
  }
}

// 创建实例
const request = new Request(BASE_URL)

export default request
