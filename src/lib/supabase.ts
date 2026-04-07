/**
 * Supabase HTTP 客户端
 * 用于微信小程序环境（不使用官方 SDK）
 */

const SUPABASE_URL = 'https://lwkeudywhmvlimsasixo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3a2V1ZHl3aG12bGltc2FzaXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MTIxNDksImV4cCI6MjA3OTA4ODE0OX0.O9tTR16ybNPWvh_4RY0_I43zbvVqaR75TFhN1vgn5jg'

/**
 * 调用 Supabase Edge Function
 */
export const supabase = {
  functions: {
    invoke: async (functionName: string, options: { body?: any } = {}) => {
      const url = `${SUPABASE_URL}/functions/v1/${functionName}`

      console.log('调用 Edge Function:', url, options)

      try {
        const response = await uni.request({
          url,
          method: 'POST',
          header: {
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
          },
          data: options.body || {}
        })

        console.log('响应状态:', response.statusCode)
        console.log('响应数据:', response.data)

        // 微信小程序返回格式：response = { statusCode, data, headers }
        if (response.statusCode && response.statusCode >= 400) {
          console.error('请求失败:', response.data)
          return {
            data: null,
            error: response.data?.error || response.data?.message || `HTTP ${response.statusCode}`
          }
        }

        return { data: response.data, error: null }
      } catch (err: any) {
        console.error('请求异常:', err)
        return { data: null, error: err.message || '请求失败' }
      }
    }
  },

  // 从数据库查询数据 - 支持链式调用
  from: (table: string) => {
    // 查询构建器
    const queryBuilder = {
      _filters: [] as string[],
      _select: '*' as string,

      select(columns = '*') {
        this._select = columns
        return this
      },

      eq(column: string, value: any) {
        this._filters.push(`${column}=eq.${encodeURIComponent(value)}`)
        return this
      },

      single() {
        return this
      },

      // 执行查询
      async _executeQuery() {
        let url = `${SUPABASE_URL}/rest/v1/${table}?select=${this._select}`
        if (this._filters.length > 0) {
          url += '&' + this._filters.join('&')
        }

        try {
          const response = await uni.request({
            url,
            method: 'GET',
            header: {
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'apikey': SUPABASE_ANON_KEY
            }
          })

          if (response.statusCode && response.statusCode >= 400) {
            return { data: null, error: response.data }
          }

          // 如果调用了 single()，返回单个对象而不是数组
          const data = Array.isArray(response.data) && response.data.length === 1
            ? response.data[0]
            : response.data

          return { data, error: null }
        } catch (err: any) {
          return { data: null, error: { message: err.message } }
        }
      },

      // 更新数据
      async update(data: any) {
        let url = `${SUPABASE_URL}/rest/v1/${table}`
        if (this._filters.length > 0) {
          url += '?' + this._filters.join('&')
        }

        try {
          const response = await uni.request({
            url,
            method: 'PATCH',
            header: {
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'apikey': SUPABASE_ANON_KEY,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            data
          })

          if (response.statusCode && response.statusCode >= 400) {
            return { data: null, error: response.data }
          }

          return { data: response.data, error: null }
        } catch (err: any) {
          return { data: null, error: { message: err.message } }
        }
      },

      // 插入数据
      async insert(data: any) {
        const url = `${SUPABASE_URL}/rest/v1/${table}`

        try {
          const response = await uni.request({
            url,
            method: 'POST',
            header: {
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'apikey': SUPABASE_ANON_KEY,
              'Content-Type': 'application/json',
              'Prefer': 'return=representation'
            },
            data
          })

          if (response.statusCode && response.statusCode >= 400) {
            return { data: null, error: response.data }
          }

          return { data: response.data, error: null }
        } catch (err: any) {
          return { data: null, error: { message: err.message } }
        }
      }
    }

    // 返回支持链式调用的对象
    return {
      select: (columns = '*') => {
        queryBuilder._select = columns
        return {
          eq: (column: string, value: any) => {
            queryBuilder.eq(column, value)
            return {
              single: () => queryBuilder._executeQuery()
            }
          },
          single: () => queryBuilder._executeQuery()
        }
      },
      update: (data: any) => {
        return {
          eq: (column: string, value: any) => {
            queryBuilder.eq(column, value)
            return {
              select: () => ({
                single: async () => {
                  let url = `${SUPABASE_URL}/rest/v1/${table}?${queryBuilder._filters.join('&')}`

                  try {
                    const response = await uni.request({
                      url,
                      method: 'PATCH',
                      header: {
                        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                        'apikey': SUPABASE_ANON_KEY,
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                      },
                      data
                    })

                    if (response.statusCode && response.statusCode >= 400) {
                      return { data: null, error: response.data }
                    }

                    const resultData = Array.isArray(response.data) ? response.data[0] : response.data
                    return { data: resultData, error: null }
                  } catch (err: any) {
                    return { data: null, error: { message: err.message } }
                  }
                }
              })
            }
          }
        }
      },
      insert: (data: any) => {
        return {
          select: () => ({
            single: async () => {
              const url = `${SUPABASE_URL}/rest/v1/${table}`

              try {
                const response = await uni.request({
                  url,
                  method: 'POST',
                  header: {
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                    'apikey': SUPABASE_ANON_KEY,
                    'Content-Type': 'application/json',
                    'Prefer': 'return=representation'
                  },
                  data
                })

                if (response.statusCode && response.statusCode >= 400) {
                  return { data: null, error: response.data }
                }

                const resultData = Array.isArray(response.data) ? response.data[0] : response.data
                return { data: resultData, error: null }
              } catch (err: any) {
                return { data: null, error: { message: err.message } }
              }
            }
          })
        }
      },
      delete: () => {
        const filters: string[] = []
        return {
          eq: (column: string, value: any) => {
            filters.push(`${column}=eq.${encodeURIComponent(value)}`)
            return {
              async execute() {
                let url = `${SUPABASE_URL}/rest/v1/${table}`
                if (filters.length > 0) {
                  url += '?' + filters.join('&')
                }
                try {
                  const response = await uni.request({
                    url,
                    method: 'DELETE',
                    header: {
                      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
                      'apikey': SUPABASE_ANON_KEY,
                      'Prefer': 'return=minimal'
                    }
                  })
                  if (response.statusCode && response.statusCode >= 400) {
                    return { error: response.data }
                  }
                  return { error: null }
                } catch (err: any) {
                  return { error: { message: err.message } }
                }
              }
            }
          }
        }
      }
    }
  }
}

console.log('✅ Supabase HTTP 客户端已初始化')

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
