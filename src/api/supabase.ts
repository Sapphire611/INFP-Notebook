import { supabase, type WechatUser, type LoginResult, type UpdateProfileResult } from '@/lib/supabase'

/**
 * 微信登录相关 API
 */
export const wechatAuthApi = {
  /**
   * 使用微信 openid 登录或注册用户
   * @param openid 微信 openid
   * @param unionid 微信 unionid（可选）
   * @param nickName 微信昵称（可选）
   * @param avatarUrl 微信头像（可选）
   */
  async login(openid: string, unionid?: string, nickName?: string, avatarUrl?: string): Promise<LoginResult> {
    try {
      // 首先查询��户是否已存在
      const { data: existingUser, error: queryError } = await supabase
        .from('wechat_users')
        .select('*')
        .eq('openid', openid)
        .single()

      if (queryError && queryError.code !== 'PGRST116') {
        // PGRST116 表示没有找到记录，这是正常的情况
        console.error('查询用户失败:', queryError)
        throw new Error(queryError.message)
      }

      let userData: WechatUser

      if (existingUser) {
        // 用户已存在，更新最后登录时间
        const { data: updatedUser, error: updateError } = await supabase
          .from('wechat_users')
          .update({
            last_login_at: new Date().toISOString(),
            // 如果提供了新的昵称或头像，也更新这些字段
            ...(nickName && { wechat_nickname: nickName }),
            ...(avatarUrl && { wechat_avatar_url: avatarUrl })
          })
          .eq('openid', openid)
          .select()
          .single()

        if (updateError) {
          throw new Error(updateError.message)
        }

        userData = updatedUser
      } else {
        // 新用户，创建用户记录
        const userId = generateUUID()

        const { data: newUser, error: insertError } = await supabase
          .from('wechat_users')
          .insert({
            id: userId,
            openid: openid,
            unionid: unionid,
            wechat_nickname: nickName || '新用户',
            wechat_avatar_url: avatarUrl || '',
            is_active: true,
            last_login_at: new Date().toISOString()
          })
          .select()
          .single()

        if (insertError) {
          throw new Error(insertError.message)
        }

        userData = newUser
      }

      return {
        success: true,
        userInfo: {
          openid: userData.openid,
          nickName: userData.wechat_nickname || '',
          avatarUrl: userData.wechat_avatar_url || '',
          mbti: '', // mbti 字段可以根据需要扩展
          id: userData.id
        }
      }
    } catch (error: any) {
      console.error('微信登录失败:', error)
      return {
        success: false,
        error: error.message || '登录失败，请重试'
      }
    }
  },

  /**
   * 更新用户信息
   * @param openid 用户 openid
   * @param data 更新的数据
   */
  async updateProfile(openid: string, data: {
    nickName?: string
    avatarUrl?: string
    mbti?: string
    profile_name?: string
    profile_phone?: string
    profile_avatar?: string
    profile_id_number?: string
  }): Promise<UpdateProfileResult> {
    try {
      // 首先查询用户是否存在
      const { data: existingUser, error: queryError } = await supabase
        .from('wechat_users')
        .select('*')
        .eq('openid', openid)
        .single()

      if (queryError || !existingUser) {
        throw new Error('用户不存在')
      }

      // 构建更新数据
      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (data.nickName) {
        updateData.wechat_nickname = data.nickName
      }
      if (data.avatarUrl) {
        updateData.wechat_avatar_url = data.avatarUrl
      }
      if (data.mbti !== undefined) {
        updateData.mbti = data.mbti
      }
      if (data.profile_name !== undefined) {
        updateData.profile_name = data.profile_name
      }
      if (data.profile_phone !== undefined) {
        updateData.profile_phone = data.profile_phone
      }
      if (data.profile_avatar !== undefined) {
        updateData.profile_avatar = data.profile_avatar
      }
      if (data.profile_id_number !== undefined) {
        updateData.profile_id_number = data.profile_id_number
      }

      // 执行更新
      const { data: updatedUser, error: updateError } = await supabase
        .from('wechat_users')
        .update(updateData)
        .eq('openid', openid)
        .select()
        .single()

      if (updateError) {
        throw new Error(updateError.message)
      }

      return {
        success: true,
        userInfo: {
          openid: updatedUser.openid,
          nickName: updatedUser.wechat_nickname || 'INFP 用户',
          avatarUrl: updatedUser.wechat_avatar_url || '',
          mbti: updatedUser.mbti || '',
          id: updatedUser.id
        }
      }
    } catch (error: any) {
      console.error('更新用户信息失败:', error)
      return {
        success: false,
        error: error.message || '更新失败，请重试'
      }
    }
  },

  /**
   * 获取用户信息
   * @param openid 用户 openid
   */
  async getUserInfo(openid: string): Promise<WechatUser | null> {
    try {
      const { data, error } = await supabase
        .from('wechat_users')
        .select('*')
        .eq('openid', openid)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      return data
    } catch (error: any) {
      console.error('获取用户信息失败:', error)
      return null
    }
  }
}

/**
 * 生成 UUID 的简单实现
 * 在实际项目中，可以考虑使用更完善的 UUID 库
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}
