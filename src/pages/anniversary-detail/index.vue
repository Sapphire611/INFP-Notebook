<template>
  <view class="detail-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-content">
        <view class="nav-left" @click="goBack">
          <text class="nav-icon">←</text>
        </view>
        <text class="nav-title">纪念日详情</text>
        <view class="nav-right"></view>
      </view>
    </view>

    <view v-if="loading" class="loading-area">
      <text class="loading-text">加载中...</text>
    </view>

    <view v-else-if="anniversary" class="detail-content">
      <!-- 主展示区 -->
      <view class="hero-card">
        <text class="hero-icon">{{ anniversary.icon }}</text>
        <text class="hero-title">{{ anniversary.title }}</text>
        <text class="hero-date">{{ formatDateCN(anniversary.date) }}</text>
        <view v-if="anniversary.is_yearly_repeat" class="yearly-badge">每年重复</view>

        <!-- 数字展示 -->
        <view class="count-display">
          <view v-if="currentUnit === 'ymd' && !anniversary.is_yearly_repeat" class="count-ymd">
            <view v-if="breakdown.years" class="count-group">
              <text class="count-num">{{ breakdown.years }}</text>
              <text class="count-label">年</text>
            </view>
            <view v-if="breakdown.months" class="count-group">
              <text class="count-num">{{ breakdown.months }}</text>
              <text class="count-label">月</text>
            </view>
            <view class="count-group">
              <text class="count-num">{{ breakdown.days }}</text>
              <text class="count-label">天</text>
            </view>
          </view>
          <view v-else-if="currentUnit === 'md' && !anniversary.is_yearly_repeat" class="count-ymd">
            <view v-if="breakdown.months" class="count-group">
              <text class="count-num">{{ breakdown.months }}</text>
              <text class="count-label">月</text>
            </view>
            <view class="count-group">
              <text class="count-num">{{ breakdown.days }}</text>
              <text class="count-label">天</text>
            </view>
          </view>
          <view v-else-if="currentUnit === 'wd'" class="count-ymd">
            <view v-if="breakdown.weeks" class="count-group">
              <text class="count-num">{{ breakdown.weeks }}</text>
              <text class="count-label">周</text>
            </view>
            <view class="count-group">
              <text class="count-num">{{ breakdown.days }}</text>
              <text class="count-label">天</text>
            </view>
          </view>
          <view v-else class="count-single">
            <text class="count-big">{{ Math.abs(totalDays) }}</text>
            <text class="count-unit-big">天</text>
          </view>
        </view>

        <text class="count-desc">{{ breakdown.label }}</text>
      </view>

      <!-- 单位切换 -->
      <view class="unit-tabs">
        <view
          v-for="tab in unitTabs"
          :key="tab.key"
          class="unit-tab"
          :class="{ active: currentUnit === tab.key }"
          @click="currentUnit = tab.key"
        >
          <text class="tab-text">{{ tab.label }}</text>
        </view>
      </view>

      <!-- 操作按钮 -->
      <view class="action-section">
        <button class="edit-btn" @tap="goEdit">编辑纪念日</button>
        <button class="delete-btn" @tap="handleDelete">删除纪念日</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad, onShow } from '@dcloudio/uni-app'
import { useAnniversaryStore } from '@/stores/anniversary'
import { anniversaryApi, type Anniversary } from '@/api/anniversary'
import { formatDateCN, formatByUnit, calcDaysDiff, type DateUnit } from '@/utils/dateCalc'

const anniversaryStore = useAnniversaryStore()

const loading = ref(true)
const anniversary = ref<Anniversary | null>(null)
const currentUnit = ref<DateUnit>('d')
const currentId = ref('')

const unitTabs = [
  { key: 'ymd' as DateUnit, label: '年/月/日' },
  { key: 'md' as DateUnit, label: '月/日' },
  { key: 'wd' as DateUnit, label: '周/日' },
  { key: 'd' as DateUnit, label: '日' }
]

const totalDays = computed(() =>
  anniversary.value ? calcDaysDiff(anniversary.value.date, anniversary.value.is_yearly_repeat) : 0
)

const breakdown = computed(() => {
  if (!anniversary.value) return { label: '', days: 0 }
  return formatByUnit(anniversary.value.date, currentUnit.value, anniversary.value.is_yearly_repeat)
})

onLoad((options: any) => {
  const id = options?.id
  if (!id) {
    uni.navigateBack()
    return
  }
  currentId.value = id
})

onShow(async () => {
  if (!currentId.value) return
  loading.value = true
  const { data, error } = await anniversaryApi.getById(currentId.value)
  loading.value = false
  if (error || !data) {
    uni.showToast({ title: '加载失败', icon: 'none' })
    return
  }
  anniversary.value = data
})

function goBack() {
  uni.navigateBack()
}

function goEdit() {
  const id = currentId.value
  if (!id) return
  uni.navigateTo({ url: `/pages/anniversary-form/index?id=${id}` })
}

async function handleDelete() {
  uni.showModal({
    title: '确认删除',
    content: `确定要删除"${anniversary.value?.title}"吗？`,
    success: async (res) => {
      if (!res.confirm || !anniversary.value) return
      const { error } = await anniversaryStore.deleteAnniversary(anniversary.value.id)
      if (error) {
        uni.showToast({ title: '删除失败', icon: 'none' })
        return
      }
      uni.showToast({ title: '已删除', icon: 'success' })
      setTimeout(() => uni.navigateBack(), 500)
    }
  })
}
</script>

<style lang="scss" scoped>
.detail-page {
  width: 100%;
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.nav-bar {
  background: #fff;
  padding-top: calc(20rpx + env(safe-area-inset-top));
  border-bottom: 1rpx solid #eee;

  .nav-content {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;

    .nav-left {
      width: 80rpx;
      .nav-icon {
        font-size: 40rpx;
        color: #333;
      }
    }

    .nav-title {
      flex: 1;
      text-align: center;
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }

    .nav-right {
      width: 120rpx;
      text-align: right;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .nav-edit {
        font-size: 30rpx;
        color: #EEC362;
        padding: 20rpx 0;
      }
    }
  }
}

.loading-area {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  .loading-text { font-size: 28rpx; color: #999; }
}

.detail-content {
  padding: 30rpx;
}

.hero-card {
  background: linear-gradient(135deg, #EEC362 0%, #FFD54F 100%);
  border-radius: 32rpx;
  padding: 50rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(238, 195, 98, 0.4);
  position: relative;
  overflow: hidden;
  margin-bottom: 24rpx;

  .hero-icon {
    font-size: 80rpx;
    margin-bottom: 16rpx;
  }

  .hero-title {
    font-size: 40rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 12rpx;
  }

  .hero-date {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.75);
    margin-bottom: 40rpx;
  }

  .yearly-badge {
    position: absolute;
    top: 24rpx;
    right: 24rpx;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 20rpx;
    padding: 6rpx 20rpx;
    font-size: 22rpx;
    color: #fff;
  }

  .count-display {
    margin-bottom: 20rpx;
  }

  .count-ymd {
    display: flex;
    align-items: baseline;
    gap: 20rpx;

    .count-group {
      display: flex;
      align-items: baseline;

      .count-num {
        font-size: 96rpx;
        font-weight: bold;
        color: #fff;
        line-height: 1;
      }

      .count-label {
        font-size: 36rpx;
        color: rgba(255, 255, 255, 0.9);
        margin-left: 4rpx;
      }
    }
  }

  .count-single {
    display: flex;
    align-items: baseline;

    .count-big {
      font-size: 120rpx;
      font-weight: bold;
      color: #fff;
      line-height: 1;
    }

    .count-unit-big {
      font-size: 44rpx;
      color: rgba(255, 255, 255, 0.9);
      margin-left: 8rpx;
    }
  }

  .count-desc {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.85);
  }
}

.unit-tabs {
  background: #fff;
  border-radius: 20rpx;
  padding: 16rpx;
  display: flex;
  gap: 12rpx;
  margin-bottom: 24rpx;

  .unit-tab {
    flex: 1;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 12rpx;
    background: #f5f5f5;

    &.active {
      background: linear-gradient(135deg, #EEC362 0%, #FFD54F 100%);
    }

    .tab-text {
      font-size: 26rpx;
      color: #666;
    }

    &.active .tab-text {
      color: #fff;
      font-weight: bold;
    }
  }
}

.action-section {
  margin-top: 20rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;

  .edit-btn {
    width: 100%;
    height: 88rpx;
    background: linear-gradient(135deg, #EEC362 0%, #FFD54F 100%);
    color: #fff;
    font-size: 32rpx;
    font-weight: bold;
    border: none;
    border-radius: 44rpx;
    box-shadow: 0 8rpx 24rpx rgba(238, 195, 98, 0.4);
  }

  .delete-btn {
    width: 100%;
    height: 88rpx;
    background: #fff;
    color: #ff4d4f;
    font-size: 32rpx;
    border: 2rpx solid #ff4d4f;
    border-radius: 44rpx;
  }
}
</style>
