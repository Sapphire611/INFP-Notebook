<template>
  <view class="home-page">
    <!-- 顶部标题 -->
    <view class="chat-header">
      <view class="header-content">
        <view class="header-text">
          <text class="header-title">INFP的备忘录</text>
          <text class="header-subtitle">做你自己就好</text>
        </view>
      </view>
    </view>

    <!-- 占位内容区域 -->
    <view class="content-area">
      <view class="placeholder-content">
        <text class="welcome-emoji">📒</text>
        <text class="welcome-title">欢迎来到备忘录</text>

        <view class="tips-section">
          <text class="tips-icon">💡</text>
          <text class="tips-text">目前还什么功能都没做</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

onShow(() => {
  // 每次页面显示时检查登录状态
  userStore.loadUserInfo()
})
</script>

<style lang="scss" scoped>
.home-page {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
  overflow: hidden;
  box-sizing: border-box;
}

.chat-header {
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(135deg, #EEC362 0%, #FFD54F 100%);
  padding: 40rpx 60rpx 30rpx;
  padding-top: calc(40rpx + env(safe-area-inset-top));
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
  flex-shrink: 0;

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-text {
      flex: 1;

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
}

.content-area {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 40rpx 60rpx;
}

.placeholder-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  text-align: center;

  .welcome-emoji {
    font-size: 120rpx;
    margin-bottom: 30rpx;
  }

  .welcome-title {
    font-size: 48rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 40rpx;
  }

  .welcome-description {
    font-size: 28rpx;
    color: #666;
    line-height: 1.6;
    text-align: center;
    margin-bottom: 60rpx;
  }

  .feature-cards {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
    margin-bottom: 40rpx;

    .feature-card {
      background: #ffffff;
      border-radius: 24rpx;
      padding: 40rpx;
      box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;

      .card-icon {
        font-size: 64rpx;
        margin-bottom: 16rpx;
      }

      .card-title {
        font-size: 32rpx;
        font-weight: bold;
        color: #333;
        margin-bottom: 8rpx;
      }

      .card-desc {
        font-size: 24rpx;
        color: #999;
        line-height: 1.5;
      }
    }
  }

  .tips-section {
    background: linear-gradient(135deg, #f0f9eb 0%, #e6eac2 100%);
    border-radius: 20rpx;
    padding: 24rpx 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16rpx;

    .tips-icon {
      font-size: 32rpx;
    }

    .tips-text {
      font-size: 26rpx;
      color: #EEC362;
      line-height: 1.5;
    }
  }
}
</style>
