/**
 * 纪念日日期计算工具
 */

export type DateUnit = 'ymd' | 'md' | 'wd' | 'd'

export interface DateBreakdown {
  unit: DateUnit
  years?: number
  months?: number
  weeks?: number
  days: number
  totalDays: number
  isFuture: boolean
  label: string
}

/**
 * 获取今天的日期（零时区，避免时区偏移）
 */
function getToday(): Date {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), now.getDate())
}

/**
 * 解析日期字符串为本地日期（避免时区问题）
 */
function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * 计算距今天数
 * - 正数：过去（已经过了多少天）
 * - 负数：未来（还有多少天）
 * - is_yearly_repeat=true 时，计算距下一次（或今年）的天数
 */
export function calcDaysDiff(dateStr: string, isYearlyRepeat = false): number {
  const today = getToday()
  const target = parseDate(dateStr)

  if (isYearlyRepeat) {
    // 计算今年的同月同日
    let nextOccurrence = new Date(today.getFullYear(), target.getMonth(), target.getDate())
    // 如果今年的日期已经过了，取明年
    if (nextOccurrence < today) {
      nextOccurrence = new Date(today.getFullYear() + 1, target.getMonth(), target.getDate())
    }
    // 处理闰年2月29日：如果目标年没有2月29日，取3月1日
    if (target.getMonth() === 1 && target.getDate() === 29) {
      const year = nextOccurrence.getFullYear()
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
      if (!isLeap) {
        nextOccurrence = new Date(year, 2, 1) // 3月1日
      }
    }
    const diff = today.getTime() - nextOccurrence.getTime()
    return Math.round(diff / (1000 * 60 * 60 * 24))
  }

  const diff = today.getTime() - target.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

/**
 * 年/月/日 分解（精确算法，处理闰年和月份天数差异）
 */
function breakdownYMD(startDate: Date, endDate: Date): { years: number; months: number; days: number } {
  let years = endDate.getFullYear() - startDate.getFullYear()
  let months = endDate.getMonth() - startDate.getMonth()
  let days = endDate.getDate() - startDate.getDate()

  if (days < 0) {
    months--
    // 上个月的天数
    const prevMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0)
    days += prevMonth.getDate()
  }
  if (months < 0) {
    years--
    months += 12
  }

  return { years, months, days }
}

/**
 * 月/日 分解
 */
function breakdownMD(startDate: Date, endDate: Date): { months: number; days: number } {
  const { years, months, days } = breakdownYMD(startDate, endDate)
  return { months: years * 12 + months, days }
}

/**
 * 周/日 分解
 */
function breakdownWD(totalDays: number): { weeks: number; days: number } {
  const absDays = Math.abs(totalDays)
  return { weeks: Math.floor(absDays / 7), days: absDays % 7 }
}

/**
 * 根据统计单位格式化日期展示
 */
export function formatByUnit(dateStr: string, unit: DateUnit, isYearlyRepeat = false): DateBreakdown {
  const today = getToday()
  const target = parseDate(dateStr)
  const totalDays = calcDaysDiff(dateStr, isYearlyRepeat)
  const isFuture = totalDays < 0
  const absDays = Math.abs(totalDays)

  // 年度重复时，计算的是距下次的天数，起始日期是今天
  const startDate = isFuture ? today : target
  const endDate = isFuture ? target : today

  let label = ''

  switch (unit) {
    case 'ymd': {
      if (isYearlyRepeat) {
        // 年度重复只显示距下次的天数
        label = isFuture ? `还有 ${absDays} 天` : `今天就是！`
      } else {
        const { years, months, days } = breakdownYMD(startDate, endDate)
        if (isFuture) {
          label = `还有 ${years > 0 ? years + ' 年 ' : ''}${months > 0 ? months + ' 月 ' : ''}${days} 天`
        } else {
          label = `已 ${years > 0 ? years + ' 年 ' : ''}${months > 0 ? months + ' 月 ' : ''}${days} 天`
        }
      }
      break
    }
    case 'md': {
      if (isYearlyRepeat) {
        label = isFuture ? `还有 ${absDays} 天` : `今天就是！`
      } else {
        const { months, days } = breakdownMD(startDate, endDate)
        label = isFuture ? `还有 ${months} 月 ${days} 天` : `已 ${months} 月 ${days} 天`
      }
      break
    }
    case 'wd': {
      const { weeks, days } = breakdownWD(totalDays)
      label = isFuture ? `还有 ${weeks} 周 ${days} 天` : `已 ${weeks} 周 ${days} 天`
      break
    }
    case 'd':
    default: {
      label = isFuture ? `还有 ${absDays} 天` : `已 ${absDays} 天`
      break
    }
  }

  const result: DateBreakdown = { unit, totalDays, isFuture, days: absDays, label }

  if (unit === 'ymd' && !isYearlyRepeat) {
    const { years, months, days } = breakdownYMD(startDate, endDate)
    result.years = years
    result.months = months
    result.days = days
  } else if (unit === 'md' && !isYearlyRepeat) {
    const { months, days } = breakdownMD(startDate, endDate)
    result.months = months
    result.days = days
  } else if (unit === 'wd') {
    const { weeks, days } = breakdownWD(totalDays)
    result.weeks = weeks
    result.days = days
  }

  return result
}

/**
 * 格式化日期为中文展示
 */
export function formatDateCN(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${y}年${parseInt(m)}月${parseInt(d)}日`
}
