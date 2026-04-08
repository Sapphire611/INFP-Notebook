<template>
  <view class="home-page">
    <!-- 顶部标题 -->
    <view class="chat-header">
      <view class="header-content">
        <view class="header-text">
          <text class="header-title">纪念日</text>
          <text class="header-subtitle">记住每一个重要的日子</text>
        </view>
      </view>
    </view>

    <!-- 加载中 -->
    <view v-if="anniversaryStore.loading" class="loading-area">
      <text class="loading-text">加载中...</text>
    </view>

    <!-- 未登录 -->
    <view v-else-if="!userStore.userInfo?.id" class="empty-area">
      <text class="empty-emoji">🔐</text>
      <text class="empty-title">请先登录</text>
      <text class="empty-desc">登录后可以创建和查看纪念日</text>
      <button class="action-btn" @click="goLogin">去登录</button>
    </view>

    <!-- 空状态 -->
    <view v-else-if="anniversaryStore.list.length === 0" class="empty-area">
      <text class="empty-emoji">🗓️</text>
      <text class="empty-title">还没有纪念日</text>
      <text class="empty-desc">点击右下角按钮，添加第一个纪念日吧</text>
    </view>

    <!-- 有数据 -->
    <scroll-view v-else class="content-area" scroll-y>
      <!-- 第一个纪念日大卡片 -->
      <view
        class="pinned-card"
        @click="goDetail(anniversaryStore.pinnedAnniversary!.id)"
      >
        <view class="pinned-icon">{{ anniversaryStore.pinnedAnniversary!.icon }}</view>
        <text class="pinned-title">{{ anniversaryStore.pinnedAnniversary!.title }}</text>
        <view class="pinned-count">
          <text class="count-number">{{ Math.abs(anniversaryStore.pinnedAnniversary!.daysCount) }}</text>
          <text class="count-unit">天</text>
        </view>
        <text class="pinned-label">
          {{ getPinnedLabel(anniversaryStore.pinnedAnniversary!) }}
        </text>
        <text class="pinned-date">{{ formatDateCN(anniversaryStore.pinnedAnniversary!.date) }}</text>
        <view v-if="anniversaryStore.pinnedAnniversary!.is_yearly_repeat" class="yearly-badge">
          每年重复
        </view>
      </view>

      <!-- 其余纪念日列表 -->
      <view v-if="anniversaryStore.otherAnniversaries.length > 0" class="list-section">
        <text class="list-title">其他纪念日</text>
        <view
          v-for="item in anniversaryStore.otherAnniversaries"
          :key="item.id"
          class="list-item"
          @click="goDetail(item.id)"
        >
          <text class="item-icon">{{ item.icon }}</text>
          <view class="item-info">
            <text class="item-title">{{ item.title }}</text>
            <text class="item-date">{{ formatDateCN(item.date) }}</text>
          </view>
          <view class="item-right">
            <text class="item-count">{{ Math.abs(item.daysCount) }}</text>
            <text class="item-unit">天{{ item.isFuture ? '后' : '前' }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 右下角添加按钮（登录后显示） -->
    <view v-if="userStore.userInfo?.id" class="fab" @click="goAdd">
      <text class="fab-icon">+</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { useAnniversaryStore } from '@/stores/anniversary'
import { formatDateCN } from '@/utils/dateCalc'
import type { AnniversaryDisplay } from '@/stores/anniversary'

const userStore = useUserStore()
const anniversaryStore = useAnniversaryStore()

onShow(() => {
  userStore.loadUserInfo()
  if (userStore.userInfo?.id) {
    anniversaryStore.fetchList(userStore.userInfo.id)
  }
})

function getPinnedLabel(item: AnniversaryDisplay): string {
  if (item.daysCount === 0) return '就是今天！'
  if (item.is_yearly_repeat) return item.isFuture ? '距下次还有' : '今天就是！'
  return item.isFuture ? '距这一天还有' : '已经过去了'
}

function goDetail(id: string) {
  uni.navigateTo({ url: `/pages/anniversary-detail/index?id=${id}` })
}

function goAdd() {
  uni.navigateTo({ url: '/pages/anniversary-form/index' })
}

function goLogin() {
  uni.navigateTo({ url: '/pages/login/index' })
}
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
  position: relative;
}

.chat-header {
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(135deg, #EEC362 0%, #FFD54F 100%);
  padding: 20rpx 60rpx 15rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
  flex-shrink: 0;

  .header-content {
    display: flex;
    align-items: center;

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

.loading-area,
.empty-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40rpx;

  .loading-text {
    font-size: 28rpx;
    color: #999;
  }

  .empty-emoji {
    font-size: 120rpx;
    margin-bottom: 30rpx;
  }

  .empty-title {
    font-size: 40rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 16rpx;
  }

  .empty-desc {
    font-size: 28rpx;
    color: #999;
    text-align: center;
    line-height: 1.6;
    margin-bottom: 50rpx;
  }

  .action-btn {
    background: linear-gradient(135deg, #EEC362 0%, #FFD54F 100%);
    color: #fff;
    border: none;
    border-radius: 50rpx;
    padding: 0 60rpx;
    font-size: 32rpx;
    height: 88rpx;
    line-height: 88rpx;
  }
}

.content-area {
  flex: 1;
  overflow: hidden;
  padding-bottom: 160rpx;
}

/* 大卡片 */
.pinned-card {
  margin: 30rpx 30rpx 0;
  background: linear-gradient(135deg, #EEC362 0%, #FFD54F 100%);
  border-radius: 32rpx;
  padding: 50rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 8rpx 24rpx rgba(238, 195, 98, 0.4);
  position: relative;
  overflow: hidden;

  .pinned-icon {
    font-size: 80rpx;
    margin-bottom: 16rpx;
  }

  .pinned-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #fff;
    margin-bottom: 30rpx;
  }

  .pinned-count {
    display: flex;
    align-items: baseline;
    margin-bottom: 12rpx;

    .count-number {
      font-size: 120rpx;
      font-weight: bold;
      color: #fff;
      line-height: 1;
    }

    .count-unit {
      font-size: 40rpx;
      color: rgba(255, 255, 255, 0.9);
      margin-left: 8rpx;
    }
  }

  .pinned-label {
    font-size: 28rpx;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 16rpx;
  }

  .pinned-date {
    font-size: 26rpx;
    color: rgba(255, 255, 255, 0.7);
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
}

/* 列表 */
.list-section {
  margin: 30rpx 30rpx 0;

  .list-title {
    font-size: 28rpx;
    color: #999;
    margin-bottom: 16rpx;
    display: block;
  }
}

.list-item {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.05);

  .item-icon {
    font-size: 56rpx;
    margin-right: 24rpx;
  }

  .item-info {
    flex: 1;
    overflow: hidden;

    .item-title {
      display: block;
      font-size: 32rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 8rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .item-date {
      display: block;
      font-size: 24rpx;
      color: #999;
    }
  }

  .item-right {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    flex-shrink: 0;
    margin-left: 20rpx;

    .item-count {
      font-size: 48rpx;
      font-weight: bold;
      color: #EEC362;
      line-height: 1;
    }

    .item-unit {
      font-size: 24rpx;
      color: #EEC362;
      margin-left: 4rpx;
    }
  }
}

/* FAB */
.fab {
  position: fixed;
  right: 40rpx;
  bottom: calc(120rpx + env(safe-area-inset-bottom));
  width: 100rpx;
  height: 100rpx;
  border-radius: 50rpx;
  background: linear-gradient(135deg, #EEC362 0%, #FFD54F 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8rpx 24rpx rgba(238, 195, 98, 0.5);
  z-index: 200;

  .fab-icon {
    font-size: 60rpx;
    color: #fff;
    line-height: 1;
    margin-top: -4rpx;
  }
}
</style>
