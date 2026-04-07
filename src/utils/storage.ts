const SUPABASE_URL = 'https://lwkeudywhmvlimsasixo.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3a2V1ZHl3aG12bGltc2FzaXhvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM1MTIxNDksImV4cCI6MjA3OTA4ODE0OX0.O9tTR16ybNPWvh_4RY0_I43zbvVqaR75TFhN1vgn5jg'

/**
 * 上传文件到 Supabase Storage
 * @param filePath 微信临时文件路径（wxfile:// 或 http://tmp/）
 * @param bucket 存储桶名称
 * @param folder 文件夹路径
 */
export async function uploadFileToStorage(
  filePath: string,
  bucket: string = 'avatars',
  folder: string = 'user-avatars'
): Promise<{ url: string; error: string | null }> {
  try {
    // 只有 https:// 网络图片才需要先下载到本地
    // wxfile:// 和 http://tmp/ 是微信本地临时文件，直接使用
    let localFilePath = filePath

    if (filePath.startsWith('https://')) {
      const downloadResult = await uni.downloadFile({
        url: filePath,
        timeout: 15000
      })
      if (downloadResult.statusCode !== 200 || !downloadResult.tempFilePath) {
        return { url: '', error: '文件下载失败' }
      }
      localFilePath = downloadResult.tempFilePath
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const fileName = `${timestamp}-${randomStr}.jpg`
    const filePathStorage = `${folder}/${fileName}`
    const uploadUrl = `${SUPABASE_URL}/storage/v1/object/${bucket}/${filePathStorage}`

    const uploadResult = await uni.uploadFile({
      url: uploadUrl,
      filePath: localFilePath,
      name: 'file',
      header: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'image/jpeg',
        'x-upsert': 'true'
      },
      timeout: 30000
    })

    if (uploadResult.statusCode && uploadResult.statusCode >= 400) {
      const errorData = typeof uploadResult.data === 'string'
        ? (() => { try { return JSON.parse(uploadResult.data) } catch { return { message: uploadResult.data } } })()
        : uploadResult.data
      return { url: '', error: (errorData as any)?.message || `上传失败 (${uploadResult.statusCode})` }
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${filePathStorage}`
    return { url: publicUrl, error: null }

  } catch (err: any) {
    return { url: '', error: err.errMsg || err.message || '上传失败' }
  }
}
