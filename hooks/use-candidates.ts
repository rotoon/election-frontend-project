import api from '@/lib/api'
import { getApiErrorMessage } from '@/lib/error'
import { transformCandidates } from '@/lib/transforms'
import {
  Candidate,
  CandidateItem,
  CreateCandidatePayload,
  GetCandidatesQuery,
  ManageCandidatesResult,
  UpdateCandidatePayload,
} from '@/types/candidate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Hook to fetch Candidates (Voter) - ไม่เปลี่ยน
export function useCandidates(constituencyId?: string | number | null) {
  return useQuery({
    queryKey: ['candidates', constituencyId],
    queryFn: async () => {
      const { data } = await api.get('/public/candidates', {
        params: {
          limit: 1000,
          ...(constituencyId ? { constituencyId } : {}),
        },
      })
      const candidates = data.candidate || data.data || []
      return transformCandidates(candidates) as Candidate[]
    },
  })
}

// Hook to fetch Candidates (EC Management - Paginated with search/sort)
export function useManageCandidates(params: GetCandidatesQuery) {
  const {
    constituencyId,
    partyId,
    provinceId,
    page = 1,
    limit = 10,
    search,
    sortBy,
    order,
  } = params

  return useQuery<ManageCandidatesResult>({
    queryKey: [
      'manage-candidates',
      constituencyId,
      partyId,
      provinceId,
      page,
      limit,
      search,
      sortBy,
      order,
    ],
    queryFn: async () => {
      const queryParams = new URLSearchParams()
      queryParams.set('page', page.toString())
      queryParams.set('limit', limit.toString())

      if (search) queryParams.set('search', search)
      if (sortBy) queryParams.set('sortBy', sortBy)
      if (order) queryParams.set('order', order)
      if (partyId && partyId !== 'all')
        queryParams.set('partyId', partyId.toString())
      if (constituencyId && constituencyId !== 'all')
        queryParams.set('constituencyId', constituencyId.toString())
      if (provinceId && provinceId !== 'all')
        queryParams.set('provinceId', provinceId.toString())

      const { data } = await api.get(`/ec/candidates?${queryParams.toString()}`)

      // API ใหม่ return: { total, candidate: [], page, limit, totalPages }
      const candidates: CandidateItem[] = data.candidate || []
      const total =
        data.total ??
        data.meta?.total ??
        data.pagination?.total ??
        data.totalCount ??
        0

      const meta = {
        total,
        page: data.page ?? data.meta?.page ?? page,
        limit: data.limit ?? data.meta?.limit ?? limit,
        totalPages:
          data.totalPages ??
          data.meta?.totalPages ??
          Math.max(1, Math.ceil(total / limit)),
      }

      return { candidates, meta }
    },
  })
}

// POST /ec/candidates — สร้างผู้สมัครใหม่
export function useCreateCandidateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateCandidatePayload) => {
      await api.post('/ec/candidates', payload)
    },
    onSuccess: () => {
      toast.success('เพิ่มผู้สมัครสำเร็จ')
      queryClient.invalidateQueries({ queryKey: ['manage-candidates'] })
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      queryClient.invalidateQueries({ queryKey: ['ec-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'เพิ่มผู้สมัครไม่สำเร็จ'))
    },
  })
}

// PATCH /ec/candidates/:id — แก้ไขผู้สมัคร
export function useUpdateCandidateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number
      payload: UpdateCandidatePayload
    }) => {
      await api.patch(`/ec/candidates/${id}`, payload)
    },
    onSuccess: () => {
      toast.success('แก้ไขข้อมูลผู้สมัครสำเร็จ')
      queryClient.invalidateQueries({ queryKey: ['manage-candidates'] })
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      queryClient.invalidateQueries({ queryKey: ['ec-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'แก้ไขไม่สำเร็จ'))
    },
  })
}

// DELETE /ec/candidates/:id — ลบผู้สมัคร
export function useDeleteCandidateMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/ec/candidates/${id}`)
    },
    onSuccess: () => {
      toast.success('ลบผู้สมัครสำเร็จ')
      queryClient.invalidateQueries({ queryKey: ['manage-candidates'] })
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      queryClient.invalidateQueries({ queryKey: ['ec-stats'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
    },
    onError: (error: unknown) => {
      toast.error(getApiErrorMessage(error, 'ลบไม่สำเร็จ'))
    },
  })
}
