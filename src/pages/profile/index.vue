<template>
  <view class="profile-page">
    <!-- 顶部黄色区域 -->
    <view class="profile-header">
      <view class="header-content">
        <text class="header-title">&nbsp;</text>
        <text class="header-subtitle">&nbsp;</text>
      </view>
    </view>

    <view class="page-content">
      <!-- 用户信息区域 -->
      <view class="user-section">
        <view v-if="!userInfo" class="not-login">
          <view class="avatar-placeholder">
            <text class="avatar-icon">📒</text>
          </view>
          <text class="welcome-text">欢迎来到 INFP的备忘录</text>
          <text class="login-tip">登录后开始记录生活点滴</text>
          <button class="wechat-login-btn" @click="handleWechatLogin">
            <text class="wechat-icon">📱</text>
            <text class="btn-text">微信登录</text>
          </button>
        </view>

        <view v-else class="logged-in">
          <view class="user-header">
            <image
              v-if="userInfo?.avatarUrl"
              class="user-avatar"
              :src="userInfo.avatarUrl"
              mode="aspectFill"
            />
            <view v-else class="user-avatar-placeholder">
              <text class="avatar-text">
                {{ userInfo?.nickName?.charAt(0) || 'I' }}
              </text>
            </view>
            <view class="user-info">
              <text class="user-nickname">{{ userInfo?.nickName || '未设置昵称' }}</text>
              <view v-if="userInfo?.mbti" class="mbti-badge">
                <text class="mbti-emoji">{{ getMbtiEmoji(userInfo.mbti) }}</text>
                <text class="mbti-text">{{ userInfo.mbti }}</text>
              </view>
              <text v-else class="user-tag">未设置 MBTI</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 功能菜单列表 -->
      <view class="menu-section">
        <view
          v-for="item in menuItems"
          :key="item.id"
          class="menu-item"
          @click="handleMenuClick(item)"
        >
          <view class="menu-left">
            <text class="menu-icon">{{ item.icon }}</text>
            <view class="menu-text">
              <text class="menu-title">{{ item.title }}</text>
              <text
                class="menu-subtitle"
                :style="item.id === 2 && userInfo?.mbti ? { color: getMbtiColor(userInfo.mbti) } : {}"
              >
                {{ getSubtitle(item) }}
              </text>
            </view>
          </view>
          <text v-if="item.arrow" class="menu-arrow">›</text>
        </view>
      </view>

      <!-- 退出登录按钮 -->
      <view v-if="userInfo" class="logout-section">
        <button class="logout-btn" @click="handleLogout">
          退出登录
        </button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

// 页面显示时重新加载用户信息
onShow(() => {
  userStore.loadUserInfo()
})

// 菜单项配置
const menuItems = [
  {
    id: 1,
    icon: '📒',
    title: '个人资料',
    subtitle: '编辑你的信息',
    arrow: true
  },
  {
    id: 2,
    icon: '🧠',
    title: 'MBTI 设置',
    arrow: true
  },
  {
    id: 3,
    icon: '💭',
    title: '关于 MBTI',
    subtitle: '了解人格分类理论',
    arrow: true
  }
]

// 获取菜单副标题
const getSubtitle = (item: any) => {
  if (item.id === 2) {
    return userInfo.value?.mbti || '设置你的人格类型'
  }
  return item.subtitle
}

// 处理菜单点击
const handleMenuClick = (item: any) => {
  // 需要登录的功能
  if (!userInfo.value && (item.id === 1 || item.id === 2)) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    return
  }

  // 个人资料
  if (item.id === 1) {
    uni.navigateTo({
      url: '/pages/profile-edit/index'
    })
    return
  }

  // MBTI 设置
  if (item.id === 2) {
    uni.navigateTo({
      url: '/pages/mbti-setting/index'
    })
    return
  }

  // 关于 MBTI
  if (item.id === 3) {
    uni.showModal({
      title: '关于 MBTI',
      content: "MBTI（迈尔斯-布里格斯类型指标）是一种人格分类理论，基于荣格的心理类型理论发展而来。\n\n它将人格分为16种类型，通过4个维度来描述：\n• 外向(E) vs 内向(I)\n• 感觉(S) vs 直觉(N)\n• 思考(T) vs 情感(F)\n• 判断(J) vs 知觉(P)\n\n每种类型都有独特的特质和优势，帮助你更好地认识自己和他人。",
      showCancel: false,
      confirmText: '了解了'
    })
    return
  }
}

// 微信登录
const handleWechatLogin = () => {
  uni.navigateTo({
    url: '/pages/login/index'
  })
}

// 退出登录
const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        userStore.logout()
      }
    }
  })
}

// MBTI 相关工具函数
const getMbtiEmoji = (mbti: string) => {
  const emojiMap: Record<string, string> = {
    'INTJ': '🏛️',
    'INTP': '🧪',
    'ENTJ': '👑',
    'ENTP': '😈',
    'INFJ': '🔮',
    'INFP': '🦋',
    'ENFJ': '🗡',
    'ENFP': '🐶',
    'ISTJ': '📋',
    'ISFJ': '🧑‍⚕️',
    'ESTJ': '📏',
    'ESFJ': '🤝',
    'ISTP': '🔧',
    'ISFP': '🎨',
    'ESTP': '🕶️',
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
</script>

<style lang="scss" scoped>
.profile-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  overflow: hidden;
  box-sizing: border-box;
}

.profile-header {
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(135deg, #EEC362 0%, #FFD54F 100%);
  padding: 20rpx 60rpx 15rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  flex-shrink: 0;

  .header-content {
    .header-title {
      display: block;
      font-size: 44rpx;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 8rpx;
    }

    .header-subtitle {
      display: block;
      font-size: 28rpx;
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.page-content {
  padding: 40rpx 60rpx;
  flex: 1;
}

// 用户信息区域
.user-section {
  border-radius: 32rpx;
  margin-bottom: 30rpx;
  margin-top: 0;

  // 未登录状态 - 白色背景
  .not-login {
    background: #ffffff;
    border-radius: 32rpx;
    padding: 60rpx 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);

    .avatar-placeholder {
      width: 160rpx;
      height: 160rpx;
      background: #f5f5f5;
      border-radius: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30rpx;

      .avatar-icon {
        font-size: 80rpx;
      }
    }

    .welcome-text {
      font-size: 36rpx;
      font-weight: bold;
      color: #333333;
      margin-bottom: 16rpx;
    }

    .login-tip {
      font-size: 26rpx;
      color: #999999;
      margin-bottom: 40rpx;
    }

    .wechat-login-btn {
      background: #ffffff;
      border-radius: 50rpx;
      padding: 16rpx 100rpx;
      display: flex;
      align-items: center;
      gap: 12rpx;
      border: 2rpx solid #e5e5e5;

      &::after {
        border: none;
      }

      .wechat-icon {
        font-size: 32rpx;
      }

      .btn-text {
        font-size: 28rpx;
        color: #EEC362;
        font-weight: 500;
      }
    }
  }

  // 已登录状态 - 黄色背景
  .logged-in {
    background: linear-gradient(135deg, #EEC362 0%, #FFD54F 100%);
    border-radius: 32rpx;
    padding: 60rpx 40rpx;
    box-shadow: 0 20rpx 60rpx rgba(238, 195, 98, 0.3);

    .user-header {
      display: flex;
      align-items: center;
      gap: 30rpx;

      .user-avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 60rpx;
        border: 4rpx solid rgba(255, 255, 255, 0.5);
      }

      .user-avatar-placeholder {
        width: 120rpx;
        height: 120rpx;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 60rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 4rpx solid rgba(255, 255, 255, 0.5);

        .avatar-text {
          font-size: 48rpx;
          color: #ffffff;
          font-weight: bold;
        }
      }

      .user-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 16rpx;

        .user-nickname {
          font-size: 36rpx;
          font-weight: bold;
          color: #ffffff;
        }

        .mbti-badge {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 40rpx;
          padding: 12rpx 24rpx;
          display: inline-flex;
          align-items: center;
          gap: 8rpx;
          align-self: flex-start;
          border: 2rpx solid rgba(255, 255, 255, 0.3);

          .mbti-emoji {
            font-size: 24rpx;
          }

          .mbti-text {
            font-size: 24rpx;
            color: #ffffff;
            font-weight: 500;
          }
        }

        .user-tag {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.7);
        }
      }
    }
  }
}

// 功能菜单列表
.menu-section {
  background: #ffffff;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
  margin-bottom: 40rpx;

  .menu-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 40rpx;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      border-bottom: none;
    }

    .menu-left {
      display: flex;
      align-items: center;
      gap: 24rpx;
      flex: 1;

      .menu-icon {
        font-size: 48rpx;
        width: 80rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f5f5;
        border-radius: 20rpx;
      }

      .menu-text {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 8rpx;

        .menu-title {
          font-size: 32rpx;
          color: #333;
          font-weight: 500;
        }

        .menu-subtitle {
          font-size: 24rpx;
          color: #999;
        }
      }
    }

    .menu-arrow {
      font-size: 48rpx;
      color: #999;
    }
  }
}

// 退出登录按钮
.logout-section {
  .logout-btn {
    width: 100%;
    height: 88rpx;
    background: #ffffff;
    border-radius: 24rpx;
    font-size: 32rpx;
    color: #f56c6c;
    border: none;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);

    &::after {
      border: none;
    }
  }
}
</style>
