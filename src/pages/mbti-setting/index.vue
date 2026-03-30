<template>
  <view class="mbti-setting-page">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="nav-back" @click="handleBack">
        <text class="back-icon">‹</text>
      </view>
      <view class="nav-title">
        <text class="title-text">选择 MBTI</text>
      </view>
      <view class="nav-placeholder"></view>
    </view>

    <view class="page-content">
      <!-- 标题说明 -->
      <view class="header-section">
        <text class="page-title">选择你的 MBTI 类型</text>
        <text class="page-description">
          MBTI 是一种人格类型理论，将人格分为 16 种类型
        </text>
      </view>

      <!-- MBTI 类型列表 -->
      <scroll-view class="mbti-list" scroll-y>
        <view
          v-for="item in MBTI_TYPES"
          :key="item.type"
          :class="['mbti-item', { selected: selectedMbti === item.type }]"
          :style="{
            borderColor: selectedMbti === item.type ? getMbtiColor(item.type) : 'transparent',
            background: selectedMbti === item.type ? getMbtiLightColor(item.type) : '#ffffff'
          }"
          @click="selectMbti(item.type)"
        >
          <view class="mbti-item-content">
            <view
              class="mbti-type-badge"
              :style="{ background: `linear-gradient(135deg, ${getMbtiColor(item.type)} 0%, ${getMbtiSecondaryColor(item.type)} 100%)` }"
            >
              <text class="mbti-emoji">{{ getMbtiEmoji(item.type) }}</text>
            </view>
            <view class="mbti-info">
              <text class="mbti-name">{{ item.type }} · {{ item.name }}</text>
              <text class="mbti-description">{{ item.description }}</text>
            </view>
          </view>
          <view
            v-if="selectedMbti === item.type"
            class="check-icon"
            :style="{ background: getMbtiColor(item.type) }"
          >
            ✓
          </view>
        </view>
      </scroll-view>

      <!-- 保存按钮 -->
      <view class="button-section">
        <button
          class="save-button"
          @click="handleSave"
          :loading="isSubmitting"
          :disabled="isSubmitting"
        >
          {{ isSubmitting ? '保存中...' : '保存' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { wechatAuthApi } from '@/api/supabase'

const userStore = useUserStore()

/**
 * 返回上一页
 */
const handleBack = () => {
  uni.navigateBack({
    delta: 1
  })
}

// MBTI 类型定义
const MBTI_TYPES = [
  { type: 'INTJ', name: '建筑师', description: '富有想象力和战略性的思想家' },
  { type: 'INTP', name: '逻辑学家', description: '具有创造力的发明家' },
  { type: 'ENTJ', name: '指挥官', description: '大胆、富有想象力的领导者' },
  { type: 'ENTP', name: '辩论家', description: '聪明好奇的思想者' },
  { type: 'INFJ', name: '提倡者', description: '安静而神秘的理想主义者' },
  { type: 'INFP', name: '调停者', description: '富有诗意和同理心的利他主义者' },
  { type: 'ENFJ', name: '主人公', description: '富有魅力和鼓舞人心的领导者' },
  { type: 'ENFP', name: '竞选者', description: '热情洋溢和富有创造力的社交家' },
  { type: 'ISTJ', name: '物流师', description: '实际和注重事实的个人' },
  { type: 'ISFJ', name: '守卫者', description: '非常专注而温暖的守护者' },
  { type: 'ESTJ', name: '总经理', description: '出色的管理者' },
  { type: 'ESFJ', name: '执政官', description: '极有同情心、受欢迎的社交家' },
  { type: 'ISTP', name: '鉴赏家', description: '大胆而实际的实验家' },
  { type: 'ISFP', name: '探险家', description: '灵活而有魅力的艺术家' },
  { type: 'ESTP', name: '企业家', description: '聪明、精力充沛的冒险家' },
  { type: 'ESFP', name: '表演者', description: '自发的、精力充沛的娱乐者' }
]

const userInfo = ref(uni.getStorageSync('userInfo') || null)
const selectedMbti = ref(userInfo.value?.mbti || '')
const isSubmitting = ref(false)

// 选择 MBTI
const selectMbti = (type: string) => {
  selectedMbti.value = type
}

// 保存 MBTI 设置
const handleSave = async () => {
  if (!selectedMbti.value) {
    uni.showToast({
      title: '请选择 MBTI 类型',
      icon: 'none'
    })
    return
  }

  try {
    isSubmitting.value = true

    // 获取当前用户信息
    const currentUserInfo = userStore.userInfo
    if (!currentUserInfo || !currentUserInfo.openid) {
      throw new Error('用户未登录')
    }

    // 调用 Supabase API 更新 MBTI
    // 注意：这里我们将 mbti 信息存储在 profile_name 字段中，或者你可以在数据库中添加专门的 mbti 字段
    const result = await wechatAuthApi.updateProfile(currentUserInfo.openid, {
      mbti: selectedMbti.value
    })

    console.log('更新 MBTI 结果:', result)

    if (result.success) {
      // 使用 userStore 更新用户信息（同时更新 store 和本地存储）
      await userStore.login({
        ...currentUserInfo,
        mbti: selectedMbti.value
      })

      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })

      // 延迟返回上一页
      setTimeout(() => {
        uni.navigateBack()
      }, 1500)
    } else {
      const errorMsg = result?.error || '更新失败'
      throw new Error(errorMsg)
    }
  } catch (error: any) {
    console.error('保存失败:', error)
    uni.showToast({
      title: error.message || '保存失败，请重试',
      icon: 'none'
    })
  } finally {
    isSubmitting.value = false
  }
}

// MBTI 相关工具函数
const getMbtiEmoji = (mbti: string) => {
  const emojiMap: Record<string, string> = {
    'INTJ': '🏛️',
    'INTP': '🔬',
    'ENTJ': '👑',
    'ENTP': '💡',
    'INFJ': '🔮',
    'INFP': '📒',
    'ENFJ': '🌟',
    'ENFP': '✨',
    'ISTJ': '📋',
    'ISFJ': '🛡️',
    'ESTJ': '🎯',
    'ESFJ': '🤝',
    'ISTP': '🔧',
    'ISFP': '🎨',
    'ESTP': '🎮',
    'ESFP': '🎭'
  }
  return emojiMap[mbti] || '🧠'
}

const getMbtiColor = (mbti: string) => {
  const colorMap: Record<string, string> = {
    // NT - 理性主义者（紫人）
    'INTJ': '#9B59B6',
    'INTP': '#8E44AD',
    'ENTJ': '#9B59B6',
    'ENTP': '#8E44AD',
    // NF - 理想主义者（绿色）
    'INFJ': '#66BB6A',
    'INFP': '#66BB6A',
    'ENFJ': '#66BB6A',
    'ENFP': '#66BB6A',
    // SJ - 守护者（黄人）
    'ISTJ': '#F39C12',
    'ISFJ': '#F1C40F',
    'ESTJ': '#F39C12',
    'ESFJ': '#F1C40F',
    // SP - 艺术创造者（蓝人）
    'ISTP': '#3498DB',
    'ISFP': '#2980B9',
    'ESTP': '#3498DB',
    'ESFP': '#2980B9'
  }
  return colorMap[mbti] || '#66BB6A'
}

const getMbtiSecondaryColor = (mbti: string) => {
  const secondaryMap: Record<string, string> = {
    // NT - 理性主义者（紫人）
    'INTJ': '#A569BD',
    'INTP': '#9B59B6',
    'ENTJ': '#A569BD',
    'ENTP': '#9B59B6',
    // NF - 理想主义者（绿色）
    'INFJ': '#86CC8A',
    'INFP': '#86CC8A',
    'ENFJ': '#86CC8A',
    'ENFP': '#86CC8A',
    // SJ - 守护者（黄人）
    'ISTJ': '#F7B731',
    'ISFJ': '#F4D03F',
    'ESTJ': '#F7B731',
    'ESFJ': '#F4D03F',
    // SP - 艺术创造者（蓝人）
    'ISTP': '#5DADE2',
    'ISFP': '#5499C7',
    'ESTP': '#5DADE2',
    'ESFP': '#5499C7'
  }
  return secondaryMap[mbti] || '#86CC8A'
}

const getMbtiLightColor = (mbti: string) => {
  const lightMap: Record<string, string> = {
    // NT - 理性主义者（紫人）
    'INTJ': '#F5Eef9',
    'INTP': '#F4Ecf6',
    'ENTJ': '#F5Eef9',
    'ENTP': '#F4Ecf6',
    // NF - 理想主义者（绿色）
    'INFJ': '#F0F9EB',
    'INFP': '#F0F9EB',
    'ENFJ': '#F0F9EB',
    'ENFP': '#F0F9EB',
    // SJ - 守护者（黄人）
    'ISTJ': '#FEF9E7',
    'ISFJ': '#FEF5E7',
    'ESTJ': '#FEF9E7',
    'ESFJ': '#FEF5E7',
    // SP - 艺术创造者（蓝人）
    'ISTP': '#EBF5FB',
    'ISFP': '#E8F6F3',
    'ESTP': '#EBF5FB',
    'ESFP': '#E8F6F3'
  }
  return lightMap[mbti] || '#F0F9EB'
}
</script>

<style lang="scss" scoped>
.mbti-setting-page {
  min-height: 100vh;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 30rpx 20rpx;
  padding-top: calc(40rpx + env(safe-area-inset-top));
  background: #ffffff;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);

  .nav-back {
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s ease;

    &:active {
      transform: scale(0.9);
      opacity: 0.7;
    }

    .back-icon {
      font-size: 80rpx;
      color: #333333;
      font-weight: 300;
      line-height: 1;
    }
  }

  .nav-title {
    flex: 1;
    text-align: center;

    .title-text {
      font-size: 36rpx;
      font-weight: bold;
      color: #333333;
    }
  }

  .nav-placeholder {
    width: 80rpx;
  }
}

.page-content {
  flex: 1;
  padding: 40rpx;
  display: flex;
  flex-direction: column;
}

.header-section {
  text-align: center;
  margin-bottom: 40rpx;

  .page-title {
    display: block;
    font-size: 44rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
  }

  .page-description {
    display: block;
    font-size: 26rpx;
    color: #999;
    line-height: 1.6;
  }
}

.mbti-list {
  flex: 1;
  height: 0;
  margin-bottom: 40rpx;

  .mbti-item {
    background: #ffffff;
    border-radius: 24rpx;
    padding: 32rpx;
    margin-bottom: 20rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border: 3rpx solid transparent;
    box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;

    .mbti-item-content {
      display: flex;
      align-items: center;
      gap: 24rpx;
      flex: 1;

      .mbti-type-badge {
        width: 100rpx;
        height: 100rpx;
        border-radius: 20rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .mbti-emoji {
          font-size: 48rpx;
        }
      }

      .mbti-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        .mbti-name {
          font-size: 32rpx;
          font-weight: bold;
          color: #333;
        }

        .mbti-description {
          font-size: 24rpx;
          color: #999;
          line-height: 1.5;
        }
      }
    }

    .check-icon {
      width: 48rpx;
      height: 48rpx;
      border-radius: 24rpx;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 28rpx;
      font-weight: bold;
      flex-shrink: 0;
    }
  }
}

.button-section {
  .save-button {
    width: 100%;
    height: 100rpx;
    background: linear-gradient(135deg, #66bb6a 0%, #81c784 100%);
    border-radius: 50rpx;
    font-size: 32rpx;
    font-weight: bold;
    color: #ffffff;
    border: none;
    box-shadow: 0 20rpx 60rpx rgba(102, 187, 106, 0.3);

    &::after {
      border: none;
    }

    &:active {
      transform: scale(0.98);
      box-shadow: 0 10rpx 40rpx rgba(102, 187, 106, 0.4);
    }
  }
}
</style>
