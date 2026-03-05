import api from '@/lib/api'
import { getApiErrorMessage } from '@/lib/error'
import { transformConstituencies } from '@/lib/transforms'
import { Constituency, ManageConstituenciesResult } from '@/types/constituency'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export type { Constituency } from '@/types/constituency'

// Hook to fetch All Constituencies (Public / Admin / EC)
export function useConstituencies(provinceId?: string | null) {
  return useQuery({
    queryKey: ['constituencies', provinceId],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (provinceId && provinceId !== 'all') {
        params.set('provinceId', provinceId)
        params.set('limit', '1000') // Ensure we get all for dropdowns
      }
      const { data } = await api.get(`/ec/constituencies?${params.toString()}`)

      const rawData =
        data.data || data.constituency || (Array.isArray(data) ? data : [])
      return transformConstituencies(rawData) as Constituency[]
    },
  })
}

// Hook for EC Control Page with server-side pagination
export function useManageConstituencies(params: {
  provinceId?: string | null
  page?: number
  limit?: number
}) {
  const { provinceId, page = 1, limit = 10 } = params

  return useQuery<ManageConstituenciesResult>({
    queryKey: ['manage-constituencies', provinceId, page, limit],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      queryParams.set('page', page.toString())
      queryParams.set('limit', limit.toString())

      if (provinceId && provinceId !== 'all') {
        queryParams.set('provinceId', provinceId)
      }

      const { data } = await api.get(
        `/ec/constituencies?${queryParams.toString()}`,
      )

      const rawData =
        data.data || data.constituency || (Array.isArray(data) ? data : [])

      const constituencies = transformConstituencies(rawData) as Constituency[]

      const total =
        data.total ??
        data.meta?.total ??
        data.pagination?.total ??
        data.totalCount ??
        constituencies.length

      const meta = {
        total,
        page: data.page ?? data.meta?.page ?? page,
        limit: data.limit ?? data.meta?.limit ?? limit,
        totalPages:
          data.totalPages ??
          data.meta?.totalPages ??
          Math.max(1, Math.ceil(total / limit)),
      }

      return {
        constituencies,
        meta,
      }
    },
  })
}

// Hook for Admin Constituencies Page
export function useAdminConstituencies(params: {
  provinceId?: string | null
  page?: number
  limit?: number
}) {
  const { provinceId, page = 1, limit = 10 } = params

  return useQuery<ManageConstituenciesResult>({
    queryKey: ['admin-constituencies', provinceId, page, limit],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      queryParams.set('page', page.toString())
      queryParams.set('limit', limit.toString())

      if (provinceId && provinceId !== 'all') {
        queryParams.set('provinceId', provinceId)
      }

      const { data } = await api.get(
        `/admin/constituencies?${queryParams.toString()}`,
      )

      const rawData = Array.isArray(data)
        ? data
        : data.data || data.constituency || []

      const constituencies = transformConstituencies(rawData) as Constituency[]

      const total =
        data.total ??
        data.meta?.total ??
        data.pagination?.total ??
        data.totalCount ??
        constituencies.length

      const meta = {
        total,
        page: data.page ?? data.meta?.page ?? page,
        limit: data.limit ?? data.meta?.limit ?? limit,
        totalPages:
          data.totalPages ??
          data.meta?.totalPages ??
          Math.max(1, Math.ceil(total / limit)),
      }

      return {
        constituencies,
        meta,
      }
    },
  })
}

// Hook to fetch Constituency Status (Poll Open/Closed)
export function useConstituencyStatus(constituencyId?: string | number | null) {
  return useQuery({
    queryKey: ['constituency', constituencyId],
    queryFn: async () => {
      const { data } = await api.get('/voter/constituency')
      const c = data.data
      return {
        is_poll_open: !c.isClosed,
      }
    },
  })
}

export function useTogglePollMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.post(`/ec/constituencies/${id}/toggle`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['constituencies'] })
      queryClient.invalidateQueries({ queryKey: ['manage-constituencies'] })
      queryClient.invalidateQueries({ queryKey: ['constituency'] })
      queryClient.invalidateQueries({ queryKey: ['results'] })
      toast.success('บันทึกสถานะเรียบร้อย')
    },
    onError: () => toast.error('เกิดข้อผิดพลาดในการเปลี่ยนสถานะ'),
  })
}

export function useOpenAllPollsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.post('/ec/constituencies/open-all')
    },
    onSuccess: () => {
      toast.success('เปิดหีบเลือกตั้งทั้งหมดแล้ว')
      queryClient.invalidateQueries({ queryKey: ['constituencies'] })
      queryClient.invalidateQueries({ queryKey: ['manage-constituencies'] })
    },
    onError: () => toast.error('เกิดข้อผิดพลาดในการเปิดหีบ'),
  })
}

export function useCloseAllPollsMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await api.post('/ec/constituencies/close-all')
    },
    onSuccess: () => {
      toast.success('ปิดหีบเลือกตั้งทั้งหมดแล้ว')
      queryClient.invalidateQueries({ queryKey: ['constituencies'] })
      queryClient.invalidateQueries({ queryKey: ['manage-constituencies'] })
    },
    onError: () => toast.error('เกิดข้อผิดพลาดในการปิดหีบ'),
  })
}

export function useCreateConstituencyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: { province: string; zoneNumber: number }) => {
      await api.post('/admin/constituencies', {
        number: payload.zoneNumber,
        provinceId: parseInt(payload.province),
      })
    },
    onSuccess: () => {
      toast.success('เพิ่มเขตเลือกตั้งสำเร็จ')
      queryClient.invalidateQueries({ queryKey: ['constituencies'] })
      queryClient.invalidateQueries({ queryKey: ['admin-constituencies'] })
      queryClient.invalidateQueries({ queryKey: ['manage-constituencies'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'เพิ่มเขตเลือกตั้งไม่สำเร็จ'))
    },
  })
}

export function useDeleteConstituencyMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/admin/constituencies/${id}`)
    },
    onSuccess: () => {
      toast.success('ลบเขตเลือกตั้งสำเร็จ')
      queryClient.invalidateQueries({ queryKey: ['constituencies'] })
      queryClient.invalidateQueries({ queryKey: ['admin-constituencies'] })
      queryClient.invalidateQueries({ queryKey: ['manage-constituencies'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'ลบไม่สำเร็จ'))
    },
  })
}
