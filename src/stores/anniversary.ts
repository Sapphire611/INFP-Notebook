import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { anniversaryApi, type Anniversary } from '@/api/anniversary'
import { calcDaysDiff } from '@/utils/dateCalc'

export interface AnniversaryDisplay extends Anniversary {
  daysCount: number
  isFuture: boolean
}

function enrich(a: Anniversary): AnniversaryDisplay {
  const daysCount = calcDaysDiff(a.date, a.is_yearly_repeat)
  return { ...a, daysCount, isFuture: daysCount < 0 }
}

export const useAnniversaryStore = defineStore('anniversary', () => {
  const list = ref<AnniversaryDisplay[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // 排序第一个作为首页大卡片
  const pinnedAnniversary = computed(() => list.value[0] || null)
  const otherAnniversaries = computed(() => list.value.slice(1))

  async function fetchList(userId: string) {
    loading.value = true
    error.value = null
    const { data, error: err } = await anniversaryApi.list(userId)
    loading.value = false
    if (err || !data) {
      error.value = err?.message || '加载失败'
      return
    }
    // 按距今天数绝对值升序排序
    list.value = data
      .map(enrich)
      .sort((a, b) => Math.abs(a.daysCount) - Math.abs(b.daysCount))
  }

  async function addAnniversary(input: Parameters<typeof anniversaryApi.create>[0]) {
    const { data, error: err } = await anniversaryApi.create(input)
    if (err || !data) return { error: err }
    list.value = [...list.value, enrich(data)].sort(
      (a, b) => Math.abs(a.daysCount) - Math.abs(b.daysCount)
    )
    return { error: null }
  }

  async function updateAnniversary(id: string, input: Parameters<typeof anniversaryApi.update>[1]) {
    const { data, error: err } = await anniversaryApi.update(id, input)
    if (err || !data) return { error: err }
    const idx = list.value.findIndex(a => a.id === id)
    if (idx !== -1) {
      list.value[idx] = enrich(data)
      list.value = [...list.value].sort((a, b) => Math.abs(a.daysCount) - Math.abs(b.daysCount))
    }
    return { error: null }
  }

  async function deleteAnniversary(id: string) {
    const { error: err } = await anniversaryApi.delete(id)
    if (err) return { error: err }
    list.value = list.value.filter(a => a.id !== id)
    return { error: null }
  }

  return {
    list,
    loading,
    error,
    pinnedAnniversary,
    otherAnniversaries,
    fetchList,
    addAnniversary,
    updateAnniversary,
    deleteAnniversary
  }
})
