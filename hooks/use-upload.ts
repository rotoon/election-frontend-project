import api from '@/lib/api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

interface UploadOptions {
  folder?: string
}

interface UploadResult {
  url: string
}

export function useUploadFile() {
  return useMutation<UploadResult, Error, { file: File } & UploadOptions>({
    mutationFn: async ({ file, folder }) => {
      const formData = new FormData()
      formData.append('file', file)
      if (folder) formData.append('folder', folder)

      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      return data as UploadResult
    },
    onError: () => {
      toast.error('อัปโหลดไฟล์ไม่สำเร็จ')
    },
  })
}
