<template>
  <view class="profile-edit-page">
    <!-- 顶部导航栏 -->
    <view class="nav-header">
      <view class="nav-back" @click="handleBack">
        <text class="back-icon">‹</text>
      </view>
      <view class="nav-title">
        <text class="title-text">修改资料</text>
      </view>
      <view class="nav-placeholder"></view>
    </view>

    <view class="page-content">
      <!-- 头像设置 -->
      <view class="avatar-section">
        <text class="section-label">头像</text>
        <button
          class="avatar-button"
          open-type="chooseAvatar"
          @chooseavatar="handleChooseAvatar"
        >
          <view class="avatar-container">
            <image
              v-if="avatarUrl"
              class="avatar-image"
              :src="avatarUrl"
              mode="aspectFill"
            />
            <view v-else class="avatar-placeholder">
              <text class="avatar-placeholder-text">
                {{ nickName?.charAt(0) || '头' }}
              </text>
            </view>
            <view class="avatar-edit-hint">
              <text class="camera-icon">📷</text>
              <text class="hint-text">点击修改</text>
            </view>
          </view>
        </button>
      </view>

      <!-- 表单区域 -->
      <view class="form-section">
        <!-- 昵称 -->
        <view class="form-item">
          <view class="form-label-row">
            <text class="form-label">昵称</text>
            <text class="required-mark">*</text>
          </view>
          <input
            class="form-input"
            type="nickname"
            placeholder="请输入您的昵称"
            v-model="nickName"
            maxlength="20"
          />
        </view>

        <!-- 提示信息 -->
        <view class="form-tips">
          <text class="tips-icon">💡</text>
          <text class="tips-text">
            完善个人信息后可以更好地使用服务
          </text>
        </view>
      </view>

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
import { onShow } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'
import { wechatAuthApi } from '@/api/supabase'
import { uploadFileToStorage } from '@/utils/storage'

const userStore = useUserStore()
const nickName = ref('')
const avatarUrl = ref('')
const isSubmitting = ref(false)

// 页面显示时加载当前用户信息
onShow(() => {
  const userInfo = userStore.userInfo
  if (userInfo) {
    nickName.value = userInfo.nickName || ''
    avatarUrl.value = userInfo.avatarUrl || ''
  }
})

/**
 * 返回上一页
 */
const handleBack = () => {
  uni.navigateBack({
    delta: 1
  })
}

/**
 * 选择头像 - 上传到 Supabase Storage
 */
const handleChooseAvatar = async (e: any) => {
  const tmpUrl = e.detail.avatarUrl
  if (!tmpUrl) return

  // 已经是 Supabase 公共 URL，直接使用
  if (!tmpUrl.startsWith('http://tmp/') && !tmpUrl.startsWith('wxfile://')) {
    avatarUrl.value = tmpUrl
    return
  }

  uni.showLoading({ title: '上传头像中...' })
  const { url, error } = await uploadFileToStorage(tmpUrl)
  uni.hideLoading()

  if (error) {
    uni.showToast({ title: '头像上传失败', icon: 'none' })
    return
  }

  avatarUrl.value = url
}

/**
 * 保存个人信息
 */
const handleSave = async () => {
  // 验证昵称
  if (!nickName.value || nickName.value.trim().length === 0) {
    uni.showToast({
      title: '请输入昵称',
      icon: 'none'
    })
    return
  }

  try {
    isSubmitting.value = true

    // 获取当前用户信息
    const userInfo = userStore.userInfo
    if (!userInfo || !userInfo.openid) {
      throw new Error('用户未登录')
    }

    // 调用 Supabase API 更新用户信息
    const result = await wechatAuthApi.updateProfile(userInfo.openid, {
      nickName: nickName.value.trim(),
      avatarUrl: avatarUrl.value
    })

    console.log('更新用户信息结果:', result)

    if (result.success && result.userInfo) {
      // 使用 userStore 更新用户信息（同时更新 store 和本地存储）
      await userStore.login({
        ...userInfo,
        nickName: result.userInfo.nickName,
        avatarUrl: result.userInfo.avatarUrl
      })

      uni.showToast({
        title: '保存成功',
        icon: 'success'
      })

      // 延迟跳转到"我的"页面
      setTimeout(() => {
        uni.switchTab({
          url: '/pages/profile/index'
        })
      }, 1500)
    } else {
      const errorMsg = result.error || '更新失败'
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
</script>

<style lang="scss" scoped>
.profile-edit-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #EEC362 0%, #FFD54F 100%);
  display: flex;
  flex-direction: column;
}

.nav-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 40rpx 30rpx 30rpx;
  padding-top: calc(20rpx + env(safe-area-inset-top));
  box-sizing: border-box;

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
      color: #ffffff;
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
      color: #ffffff;
    }
  }

  .nav-placeholder {
    width: 80rpx;
  }
}

.page-content {
  flex: 1;
  padding: 0 40rpx 60rpx;

  // 头像设置
  .avatar-section {
    margin-bottom: 60rpx;

    .section-label {
      display: block;
      font-size: 48rpx;
      color: rgba(255, 255, 255, 0.95);
      font-weight: 500;
      margin-bottom: 24rpx;
      text-align: center;
    }

    .avatar-button {
      width: 240rpx;
      height: 240rpx;
      margin: 0 auto;
      display: block;
      padding: 0;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 120rpx;
      border: 6rpx solid rgba(255, 255, 255, 0.5);
      backdrop-filter: blur(20rpx);
      overflow: hidden;
      transition: all 0.3s ease;

      &::after {
        border: none;
      }

      &:active {
        transform: scale(0.95);
        border-color: rgba(255, 255, 255, 0.8);
      }

      .avatar-container {
        width: 100%;
        height: 100%;
        position: relative;

        .avatar-image {
          width: 100%;
          height: 100%;
          border-radius: 120rpx;
        }

        .avatar-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.3);

          .avatar-placeholder-text {
            font-size: 80rpx;
            color: #ffffff;
            font-weight: bold;
          }
        }

        .avatar-edit-hint {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 60rpx;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8rpx;

          .camera-icon {
            font-size: 32rpx;
          }

          .hint-text {
            font-size: 24rpx;
            color: rgba(255, 255, 255, 0.9);
            font-weight: 500;
          }
        }
      }
    }
  }

  // 表单区域
  .form-section {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 40rpx;
    padding: 60rpx 40rpx;
    margin-bottom: 40rpx;
    box-shadow: 0 20rpx 60rpx rgba(0, 0, 0, 0.1);

    .form-item {
      margin-bottom: 40rpx;

      .form-label-row {
        display: flex;
        align-items: center;
        margin-bottom: 20rpx;

        .form-label {
          font-size: 32rpx;
          color: #333;
          font-weight: 500;
        }

        .required-mark {
          font-size: 32rpx;
          color: #f56c6c;
          margin-left: 8rpx;
        }
      }

      .form-input {
        width: 100%;
        height: 90rpx;
        background: #f5f5f5;
        border-radius: 20rpx;
        border: 2rpx solid #e5e5e5;
        padding: 0 30rpx;
        font-size: 28rpx;
        color: #333;
        box-sizing: border-box;
        transition: all 0.3s ease;

        &:focus {
          border-color: #66bb6a;
          background: #fff;
          box-shadow: 0 0 0 4rpx rgba(102, 187, 106, 0.1);
        }
      }
    }

    .form-tips {
      display: flex;
      align-items: center;
      gap: 16rpx;
      padding: 24rpx;
      background: #f0f9eb;
      border-radius: 16rpx;

      .tips-icon {
        font-size: 32rpx;
      }

      .tips-text {
        flex: 1;
        font-size: 24rpx;
        color: #66bb6a;
        line-height: 1.5;
      }
    }
  }

  // 保存按钮
  .button-section {
    .save-button {
      width: 100%;
      height: 100rpx;
      background: linear-gradient(135deg, #ffffff 0%, #f8fff9 100%);
      border-radius: 50rpx;
      border: 4rpx solid rgba(238, 195, 98, 0.3);
      box-shadow: 0 20rpx 60rpx rgba(238, 195, 98, 0.3);
      font-size: 32rpx;
      font-weight: bold;
      color: #66bb6a;
      line-height: 100rpx;
      padding: 0;
      transition: all 0.3s ease;

      &::after {
        border: none;
      }

      &:active {
        transform: scale(0.98);
        box-shadow: 0 10rpx 40rpx rgba(102, 187, 106, 0.4);
      }
    }
  }
}
</style>
