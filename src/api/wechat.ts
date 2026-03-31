import { supabase } from "@/lib/supabase";

/**
 * 微信登录 API
 * 通过 Supabase Edge Function 进行微信登录
 */
export const wechatLoginApi = {
  /**
   * 使用微信登录码进行登录
   * @param code 微信登录码
   * @param nickName 用户昵称（可选）
   * @param avatarUrl 用户头像（可选）
   */
  async login(code: string, nickName?: string, avatarUrl?: string) {
    try {
      // 调用 Supabase Edge Function
      const { data, error } = await supabase.functions.invoke("wechat-login", {
        body: {
          code,
          nickName,
          avatarUrl,
          appNumber: import.meta.env.VITE_APP_NUMBER || "1",
        },
      });

      console.log("微信登录 Edge Function 响应:", data, error);

      if (error) {
        throw new Error(error.message || "登录失败");
      }

      const result = data as any;

      if (result.success && result.userInfo) {
        return {
          success: true,
          userInfo: result.userInfo,
        };
      } else {
        throw new Error(result.error || "登录失败");
      }
    } catch (error: any) {
      console.error("微信登录失败:", error);
      return {
        success: false,
        error: error.message || "登录失败，请重试",
      };
    }
  },
};
