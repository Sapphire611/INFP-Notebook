<template>
  <view class="form-page">
    <!-- 顶部导航 -->
    <view class="nav-bar">
      <view class="nav-content">
        <view class="nav-left" @click="goBack">
          <text class="nav-icon">←</text>
        </view>
        <text class="nav-title">{{ isEdit ? '编辑纪念日' : '添加纪念日' }}</text>
        <view class="nav-right"></view>
      </view>
    </view>

    <scroll-view class="form-content" scroll-y>
      <!-- 图标选择 -->
      <view class="form-item">
        <text class="form-label">图标</text>
        <view class="icon-selector">
          <view
            v-for="emoji in iconOptions"
            :key="emoji"
            class="icon-option"
            :class="{ active: form.icon === emoji }"
            @click="form.icon = emoji"
          >
            <text class="icon-emoji">{{ emoji }}</text>
          </view>
        </view>
      </view>

      <!-- 标题 -->
      <view class="form-item">
        <text class="form-label">标题</text>
        <input
          v-model="form.title"
          class="form-input"
          placeholder="例如：恋爱纪念日"
          maxlength="20"
        />
      </view>

      <!-- 日期 -->
      <view class="form-item">
        <text class="form-label">日期</text>
        <picker mode="date" :value="form.date" @change="onDateChange">
          <view class="form-picker">
            <text :class="{ placeholder: !form.date }">
              {{ form.date ? formatDateCN(form.date) : '请选择日期' }}
            </text>
          </view>
        </picker>
      </view>

      <!-- 类型 -->
      <view class="form-item">
        <text class="form-label">类型</text>
        <view class="type-selector">
          <view
            class="type-option"
            :class="{ active: form.type === 'past' }"
            @click="form.type = 'past'"
          >
            <text class="type-text">已过去</text>
            <text class="type-desc">记录已经发生的日子</text>
          </view>
          <view
            class="type-option"
            :class="{ active: form.type === 'future' }"
            @click="form.type = 'future'"
          >
            <text class="type-text">倒数</text>
            <text class="type-desc">期待即将到来的日子</text>
          </view>
        </view>
      </view>

      <!-- 每年重复 -->
      <view class="form-item">
        <view class="form-row">
          <view class="form-label-group">
            <text class="form-label">每年重复</text>
            <text class="form-hint">适用于生日、结婚纪念日等</text>
          </view>
          <switch :checked="form.is_yearly_repeat" @change="onSwitchChange" color="#EEC362" />
        </view>
      </view>

      <!-- 保存按钮 -->
      <view class="form-actions">
        <button class="save-btn" @click="handleSave" :disabled="!canSave">
          {{ isEdit ? '保存修改' : '创建纪念日' }}
        </button>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { useAnniversaryStore } from '@/stores/anniversary'
import { formatDateCN } from '@/utils/dateCalc'
import { anniversaryApi } from '@/api/anniversary'

const userStore = useUserStore()
const anniversaryStore = useAnniversaryStore()

const iconOptions = ['🎂', '❤️', '🎉', '🎓', '💍', '🏆', '✈️', '🎁', '🌟', '📅', '🎈', '🌹']

const isEdit = ref(false)
const editId = ref('')

const form = ref({
  icon: '🎂',
  title: '',
  date: '',
  type: 'past' as 'past' | 'future',
  is_yearly_repeat: false
})

const canSave = computed(() => form.value.title.trim() && form.value.date)

onLoad((options: any) => {
  if (options?.id) {
    isEdit.value = true
    editId.value = options.id
    loadData(options.id)
  }
})

async function loadData(id: string) {
  const { data, error } = await anniversaryApi.getById(id)
  if (error || !data) {
    uni.showToast({ title: '加载失败', icon: 'none' })
    return
  }
  form.value = {
    icon: data.icon,
    title: data.title,
    date: data.date,
    type: data.type,
    is_yearly_repeat: data.is_yearly_repeat
  }
}

function onDateChange(e: any) {
  form.value.date = e.detail.value
}

function onSwitchChange(e: any) {
  form.value.is_yearly_repeat = e.detail.value
}

async function handleSave() {
  if (!canSave.value) return

  const userId = userStore.userInfo.id
  if (!userId) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    return
  }

  uni.showLoading({ title: '保存中...' })

  let result
  if (isEdit.value) {
    result = await anniversaryStore.updateAnniversary(editId.value, form.value)
  } else {
    result = await anniversaryStore.addAnniversary({ user_id: userId, ...form.value })
  }

  uni.hideLoading()

  if (result.error) {
    uni.showToast({ title: '保存失败', icon: 'none' })
    return
  }

  uni.showToast({ title: '保存成功', icon: 'success' })
  setTimeout(() => {
    uni.navigateBack()
  }, 500)
}

function goBack() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.form-page {
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
      width: 80rpx;
    }
  }
}

.form-content {
  flex: 1;
  padding: 30rpx;
}

.form-item {
  background: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;

  .form-label {
    display: block;
    font-size: 28rpx;
    color: #666;
    margin-bottom: 20rpx;
  }

  .form-input {
    width: 100%;
    font-size: 32rpx;
    color: #333;
    padding: 20rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
  }

  .form-picker {
    padding: 20rpx;
    background: #f5f5f5;
    border-radius: 12rpx;
    font-size: 32rpx;
    color: #333;

    .placeholder {
      color: #999;
    }
  }

  .form-row {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .form-label-group {
      flex: 1;

      .form-label {
        margin-bottom: 8rpx;
      }

      .form-hint {
        display: block;
        font-size: 24rpx;
        color: #999;
      }
    }
  }
}

.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;

  .icon-option {
    width: 100rpx;
    height: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    border-radius: 16rpx;
    border: 3rpx solid transparent;

    &.active {
      background: #fff5e6;
      border-color: #EEC362;
    }

    .icon-emoji {
      font-size: 48rpx;
    }
  }
}

.type-selector {
  display: flex;
  gap: 20rpx;

  .type-option {
    flex: 1;
    padding: 30rpx 20rpx;
    background: #f5f5f5;
    border-radius: 16rpx;
    border: 3rpx solid transparent;
    display: flex;
    flex-direction: column;
    align-items: center;

    &.active {
      background: #fff5e6;
      border-color: #EEC362;
    }

    .type-text {
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 8rpx;
    }

    .type-desc {
      font-size: 24rpx;
      color: #999;
      text-align: center;
    }
  }
}

.form-actions {
  margin-top: 40rpx;

  .save-btn {
    width: 100%;
    height: 96rpx;
    background: linear-gradient(135deg, #EEC362 0%, #FFD54F 100%);
    color: #fff;
    font-size: 36rpx;
    font-weight: bold;
    border: none;
    border-radius: 48rpx;
    box-shadow: 0 8rpx 24rpx rgba(238, 195, 98, 0.4);

    &[disabled] {
      opacity: 0.5;
    }
  }
}
</style>
