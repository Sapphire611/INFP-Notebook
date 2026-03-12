/**
 * 验证工具类
 */
export class Validate {
  /**
   * 手机���验证
   */
  static phone(value: string): boolean {
    return /^1[3-9]\d{9}$/.test(value)
  }

  /**
   * 邮箱验证
   */
  static email(value: string): boolean {
    return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)
  }

  /**
   * 身份证号验证
   */
  static idCard(value: string): boolean {
    return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)
  }

  /**
   * URL 验证
   */
  static url(value: string): boolean {
    return /^https?:\/\/.+/.test(value)
  }

  /**
   * 密码强度验证（6-20位，包含字母和数字）
   */
  static password(value: string): boolean {
    return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/.test(value)
  }

  /**
   * 用户名验证（4-16位，字母、数字、下划线）
   */
  static username(value: string): boolean {
    return /^[a-zA-Z0-9_]{4,16}$/.test(value)
  }

  /**
   * 非空验证
   */
  static required(value: any): boolean {
    if (value === null || value === undefined) return false
    if (typeof value === 'string') return value.trim().length > 0
    if (Array.isArray(value)) return value.length > 0
    return true
  }

  /**
   * 数字验证
   */
  static number(value: string): boolean {
    return /^\d+(\.\d+)?$/.test(value)
  }

  /**
   * 整数验证
   */
  static integer(value: string): boolean {
    return /^\d+$/.test(value)
  }

  /**
   * 金额验证（正整数或最多两位小数）
   */
  static amount(value: string): boolean {
    return /^(0|[1-9]\d*)(\.\d{1,2})?$/.test(value)
  }

  /**
   * 车牌号验证
   */
  static licensePlate(value: string): boolean {
    return /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]$/.test(value)
  }
}

export default Validate
