/**
 * API 响应基础类型
 */
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

/**
 * 分页数据类型
 */
export interface PageData<T = any> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 分页请求参数
 */
export interface PageParams {
  page?: number
  pageSize?: number
}

/**
 * HTTP 请求配置
 */
export interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  params?: any
  header?: any
  timeout?: number
}

/**
 * 路由跳转选项
 */
export interface NavigateOptions {
  url: string
  params?: Record<string, any>
  animationType?: string
  animationDuration?: number
}
