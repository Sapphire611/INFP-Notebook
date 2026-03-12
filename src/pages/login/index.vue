<template>
  <view class="login-page">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="nav-back" @click="handleBack">
        <text class="back-icon">‹</text>
      </view>
      <view class="nav-title">
        <text class="title-text">登录</text>
      </view>
      <view class="nav-placeholder"></view>
    </view>

    <!-- 装饰性背景圆圈 -->
    <view class="bg-decoration">
      <view class="circle circle-1"></view>
      <view class="circle circle-2"></view>
      <view class="circle circle-3"></view>
    </view>

    <view class="login-container">
      <!-- Logo 区域 -->
      <view class="logo-container">
        <view class="logo">
          <text class="logo-emoji">📒</text>
        </view>
        <text class="logo-title">INFP的备忘录</text>
        <view class="logo-underline"></view>
      </view>

      <!-- 欢迎文字 -->
      <view class="welcome-text">
        <text class="title">欢迎回来</text>
        <text class="description">记录生活，珍惜当下</text>
      </view>

      <!-- 登录按钮 -->
      <view class="login-button-container">
        <button class="login-button" @click="handleWechatLogin" :loading="isLoading" :disabled="isLoading">
          <view class="button-content">
            <text v-if="!isLoading" class="wechat-icon">💬</text>
            <text class="button-text">
              {{ isLoading ? '登录中...' : '微信一键登录' }}
            </text>
          </view>
        </button>

        <!-- 功能特点 -->
        <view class="features">
          <view class="feature-item">
            <text class="feature-icon">✅</text>
            <text class="feature-text">待办清单</text>
          </view>
          <view class="feature-item">
            <text class="feature-icon">📝</text>
            <text class="feature-text">备忘提醒</text>
          </view>
          <view class="feature-item">
            <text class="feature-icon">🎉</text>
            <text class="feature-text">重要日子</text>
          </view>
        </view>
      </view>

      <!-- 底部提示 -->
      <view class="tips">
        <text class="tips-text">登录即代表同意</text>
        <text class="tips-link">用户协议</text>
        <text class="tips-text">和</text>
        <text class="tips-link">隐私政策</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isLoading = ref(false)

/**
 * 返回上一页
 */
const handleBack = () => {
  uni.navigateBack({
    delta: 1
  })
}

/**
 * 微信一键登录
 */
const handleWechatLogin = async () => {
  try {
    isLoading.value = true

    // 调用云函数登录
    const res = await uni.cloud.callFunction({
      name: 'login',
      data: {}
    })

    console.log('云函数登录结果:', res)

    if (res.result && res.result.success) {
      const { userInfo } = res.result

      // 使用 userStore 保存用户信息（同时更新 store 和本地存储）
      userStore.login({
        openid: userInfo.openid,
        nickName: userInfo.nickName || 'INFP 用户',
        avatarUrl: userInfo.avatarUrl || '',
        mbti: userInfo.mbti || ''
      })

      uni.showToast({
        title: '登录成功',
        icon: 'success'
      })

      // 延迟跳转
      setTimeout(() => {
        // 如果是第一次登录（没有昵称），跳转到资料完善页面
        if (!userInfo.nickName || userInfo.nickName === '新用户') {
          uni.redirectTo({
            url: '/pages/profile-edit/index'
          })
        } else {
          // 否则跳转到"我的"页面
          uni.switchTab({
            url: '/pages/profile/index'
          })
        }
      }, 500)
    } else {
      throw new Error(res.result?.error || '登录失败')
    }
  } catch (error: any) {
    console.error('微信登录失败:', error)
    uni.showToast({
      title: error.message || '登录失败，请重试',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
// 定义动画关键帧
@keyframes float {

  0%,
  100% {
    transform: translateY(0) scale(1);
  }

  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

@keyframes pulse {

  0%,
  100% {
    opacity: 0.6;
    transform: scale(1);
  }

  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.login-page {
  position: relative;
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #EEC362 0%, #FFD54F 100%);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;

  .nav-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx 20rpx;
    padding-top: calc(20rpx + env(safe-area-inset-top));
    flex-shrink: 0;
    z-index: 100;

    .nav-back {
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      &:active {
        transform: scale(0.9);
        opacity: 0.7;
      }

      .back-icon {
        font-size: 60rpx;
        color: #ffffff;
        font-weight: 300;
        line-height: 1;
      }
    }

    .nav-title {
      flex: 1;
      text-align: center;

      .title-text {
        font-size: 32rpx;
        font-weight: bold;
        color: #ffffff;
      }
    }

    .nav-placeholder {
      width: 60rpx;
    }
  }

  // 装饰性背景圆圈
  .bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: pulse 4s ease-in-out infinite;

    &.circle-1 {
      width: 300rpx;
      height: 300rpx;
      top: -100rpx;
      right: -100rpx;
      animation-delay: 0s;
    }

    &.circle-2 {
      width: 200rpx;
      height: 200rpx;
      bottom: 100rpx;
      left: -50rpx;
      animation-delay: 1s;
    }

    &.circle-3 {
      width: 150rpx;
      height: 150rpx;
      top: 50%;
      right: 30rpx;
      animation-delay: 2s;
    }
  }
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 60rpx 40rpx;
  box-sizing: border-box;

  // Logo 区域
  .logo-container {
    margin-bottom: 30rpx;
    margin-top: 20rpx;
    text-align: center;
    animation: slideUp 0.8s ease-out;

    .logo {
      width: 160rpx;
      height: 160rpx;
      background: linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%);
      border-radius: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.2);
      margin: 0 auto 15rpx;
      animation: float 3s ease-in-out infinite;

      .logo-emoji {
        font-size: 80rpx;
      }
    }

    .logo-title {
      display: block;
      font-size: 44rpx;
      font-weight: bold;
      color: #ffffff;
      letter-spacing: 2rpx;
      margin-bottom: 10rpx;
      text-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    }

    .logo-underline {
      width: 80rpx;
      height: 6rpx;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 3rpx;
      margin: 0 auto;
    }
  }

  // 欢迎文字
  .welcome-text {
    margin-bottom: 50rpx;
    text-align: center;
    animation: slideUp 0.8s ease-out 0.2s backwards;

    .title {
      display: block;
      font-size: 44rpx;
      font-weight: bold;
      color: #ffffff;
      margin-bottom: 10rpx;
      text-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
    }

    .description {
      display: block;
      font-size: 26rpx;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 300;
    }
  }

  // 登录按钮容器
  .login-button-container {
    width: 100%;
    margin-bottom: 50rpx;
    animation: slideUp 0.8s ease-out 0.4s backwards;

    .login-button {
      width: 100%;
      height: 120rpx;
      background: linear-gradient(135deg, #ffffff 0%, #f8fff9 100%);
      border-radius: 60rpx;
      border: 4rpx solid rgba(102, 187, 106, 0.3);
      box-shadow: 0 15rpx 40rpx rgba(102, 187, 106, 0.3);
      margin-bottom: 40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      line-height: 1;

      &::after {
        border: none;
      }

      &:active {
        transform: scale(0.98);
        box-shadow: 0 10rpx 30rpx rgba(102, 187, 106, 0.4);
        background: linear-gradient(135deg, #f8fff9 0%, #e8f5e9 100%);
      }

      .button-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16rpx;
        width: 100%;
        height: 100%;

        .wechat-icon {
          font-size: 48rpx;
          line-height: 1;
        }

        .button-text {
          font-size: 40rpx;
          font-weight: bold;
          background: linear-gradient(135deg, #66bb6a 0%, #81c784 100%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }
      }
    }

    // 功能亮点
    .features {
      display: flex;
      justify-content: space-around;
      gap: 20rpx;

      .feature-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10rpx;
        padding: 24rpx 15rpx;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 20rpx;
        backdrop-filter: blur(20rpx);

        .feature-icon {
          font-size: 40rpx;
        }

        .feature-text {
          font-size: 24rpx;
          color: rgba(255, 255, 255, 0.9);
          font-weight: 500;
        }
      }
    }
  }

  // 底部提示
  .tips {
    text-align: center;
    animation: fadeIn 1s ease-out 0.6s backwards;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8rpx;

    .tips-text {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.6);
    }

    .tips-link {
      font-size: 24rpx;
      color: rgba(255, 255, 255, 0.9);
      text-decoration: underline;
      font-weight: 500;
    }
  }
}
}
</style>
