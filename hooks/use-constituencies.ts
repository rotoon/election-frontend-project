import api from '@/lib/api'
import { getApiErrorMessage } from '@/lib/error'
import { transformConstituencies } from '@/lib/transforms'
import { Constituency, ManageConstituenciesResult } from '@/types/constituency'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

export type { Constituency } from '@/types/constituency'

// Hook to fetch All Constituencies (Public / Admin / EC)
export function useConstituencies() {
  return useQuery({
    queryKey: ['constituencies'],
    queryFn: async () => {
      const { data } = await api.get('/ec/constituencies')

      const rawData =
        data.data || data.constituency || (Array.isArray(data) ? data : [])
      return transformConstituencies(rawData) as Constituency[]
    },
  })
}

// Hook for EC Control Page with server-side pagination
export function useManageConstituencies(params: {
  province?: string | null
  page?: number
  limit?: number
}) {
  const { province, page = 1, limit = 10 } = params

  return useQuery<ManageConstituenciesResult>({
    queryKey: ['manage-constituencies', province, page, limit],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      queryParams.set('page', page.toString())
      queryParams.set('limit', limit.toString())

      if (province && province !== 'all') {
        queryParams.set('province', province)
      }

      const { data } = await api.get(
        `/ec/constituencies?${queryParams.toString()}`,
      )

      const rawData =
        data.data || data.constituency || (Array.isArray(data) ? data : [])

      const constituencies = transformConstituencies(rawData) as Constituency[]

      const meta = {
        total: data.total ?? constituencies.length,
        page: data.page ?? page,
        limit: data.limit ?? limit,
        totalPages:
          data.totalPages ??
          Math.max(1, Math.ceil(constituencies.length / limit)),
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
  province?: string | null
  page?: number
  limit?: number
}) {
  const { province, page = 1, limit = 10 } = params
  const hasProvinceFilter = province && province !== 'all'

  return useQuery<ManageConstituenciesResult>({
    queryKey: ['admin-constituencies', province, page, limit],
    queryFn: async () => {
      if (hasProvinceFilter) {
        // Backend ไม่รองรับ filter province — ดึงทั้งหมดแล้ว filter ฝั่ง client
        const { data } = await api.get('/admin/constituencies?limit=9999')
        const allData = Array.isArray(data)
          ? data
          : data.data || data.constituency || []

        const filtered = allData.filter(
          (c: { provinceId: number }) =>
            c.provinceId === parseInt(province as string),
        )

        const total = filtered.length
        const totalPages = Math.max(1, Math.ceil(total / limit))
        const start = (page - 1) * limit
        const paginatedData = filtered.slice(start, start + limit)

        const constituencies = transformConstituencies(
          paginatedData,
        ) as Constituency[]

        return {
          constituencies,
          meta: { total, page, limit, totalPages },
        }
      }

      // ไม่มี filter → ใช้ server-side pagination ปกติ
      const queryParams = new URLSearchParams()
      queryParams.set('page', page.toString())
      queryParams.set('limit', limit.toString())

      const { data } = await api.get(
        `/admin/constituencies?${queryParams.toString()}`,
      )

      const rawData = Array.isArray(data)
        ? data
        : data.data || data.constituency || []

      const constituencies = transformConstituencies(rawData) as Constituency[]

      const meta = {
        total: data.total ?? constituencies.length,
        page: data.page ?? page,
        limit: data.limit ?? limit,
        totalPages:
          data.totalPages ??
          Math.max(1, Math.ceil((data.total ?? constituencies.length) / limit)),
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
    mutationFn: async ({ id, isOpen }: { id: number; isOpen: boolean }) => {
      await api.patch(`/ec/control/${id}`, { isPollOpen: isOpen })
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
      await api.post('/ec/control/open-all')
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
      await api.post('/ec/control/close-all')
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
