import { createImageUpload } from 'novel/plugins'
import { toast } from 'sonner'
import { uploadImage } from './actions'

const onUpload = (file: File) => {
  const formData = new FormData()
  formData.append('file', file)
  const promise = uploadImage(formData)

  return new Promise((resolve) => {
    toast.promise(
      promise.then(async (res) => {
        if (res?.data.publicUrl) {
          const url = res.data.publicUrl
          // preload the image
          let image = new Image()
          image.src = url
          image.onload = () => {
            resolve(url)
          }
        } else {
          throw new Error(`Error uploading image. Please try again.`)
        }
      }),
      {
        loading: '上傳圖片中...',
        success: '圖片已成功上傳',
        error: (e) => e.message,
      },
    )
  })
}

export const uploadFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes('image/')) {
      toast.error('File type not supported.')
      return false
    } else if (file.size / 1024 / 1024 > 20) {
      toast.error('File size too big (max 20MB).')
      return false
    }
    return true
  },
})
