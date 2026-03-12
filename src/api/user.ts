import request from '@/utils/request'
import type { ApiResponse } from '@/types'

/**
 * 用户登录
 */
export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  token: string
  userInfo: {
    id: string
    name: string
    username: string
    avatar: string
  }
}

export const login = (data: LoginParams) => {
  return request.post<ApiResponse<LoginResult>>('/auth/login', data)
}

/**
 * 获取用户信息
 */
export const getUserInfo = () => {
  return request.get<ApiResponse<any>>('/user/info')
}

/**
 * 更新用户信息
 */
export const updateUserInfo = (data: any) => {
  return request.put<ApiResponse<any>>('/user/info', data)
}

/**
 * 退出登录
 */
export const logout = () => {
  return request.post<ApiResponse<any>>('/auth/logout')
}
