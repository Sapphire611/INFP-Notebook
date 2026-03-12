<script setup lang="ts">
import { onLaunch, onShow, onHide } from '@dcloudio/uni-app'
import { useUserStore } from '@/stores/user'

onLaunch(() => {
  console.log('App Launch')

  // 初始化云开发
  if (uni.cloud.init) {
    uni.cloud.init({
      // 替换为你的云开发环境 ID
      // 在微信开发者工具 -> 云开发 -> 设置 -> 环境设置中找到
      env: 'cloud1-3gyscan677c04421', // ⚠️ 请替换为你的真实环境 ID
      traceUser: true // 是否在控制台记录用户访问
    })
    console.log('云开发初始化成功')
  } else {
    console.warn('当前环境不支持云开发')
  }

  // 初始化用户信息
  const userStore = useUserStore()
  userStore.loadUserInfo()
})

onShow(() => {
  console.log('App Show')
})

onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
page {
  background-color: #f5f5f5;
  font-size: 16px;
  line-height: 1.5;
  color: #333;
}
</style>
