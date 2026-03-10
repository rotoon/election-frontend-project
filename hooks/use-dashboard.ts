import api from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

import {
  DashboardData,
  PublicConstituency,
  ProvincesWithConstituenciesResponse,
  ApiConstituencyResultResponse,
} from '@/types/dashboard'

export function useProvincesWithConstituencies() {
  return useQuery<ProvincesWithConstituenciesResponse>({
    queryKey: ['provinces-with-constituencies'],
    queryFn: async () => {
      const { data } = await api.get('/public/provinces-with-constituencies')
      const payload = data.data
      if (payload?.updateAt) {
        payload.updateAt = new Date(payload.updateAt)
      }
      return payload
    },
  })
}

export function usePublicConstituencies() {
  return useQuery<PublicConstituency[]>({
    queryKey: ['public-constituencies'],
    queryFn: async () => {
      const { data } = await api.get('/public/constituencies')

      interface ApiConstituency {
        id: number
        province: string
        zoneNumber: number
      }

      return (data.data || []).map((c: ApiConstituency) => ({
        id: c.id,
        province: c.province,
        zone_number: c.zoneNumber,
        name: `เขต ${c.zoneNumber} ${c.province}`,
      }))
    },
  })
}

export function useElectionResults() {
  return useQuery<DashboardData>({
    queryKey: ['election-results'],
    queryFn: async () => {
      const { data } = await api.get('/public/results')
      return {
        ...data.data,
        turnout: data.data.turnout || data.data.voteTurnout,
      }
    },
    staleTime: 10000,
  })
}

export function useConstituencyResult(id: number | null) {
  return useQuery<ApiConstituencyResultResponse>({
    queryKey: ['constituency-result', id],
    queryFn: async () => {
      if (!id) throw new Error('No id provided')
      // Ensure the endpoint exactly matches the user requirement
      const { data } = await api.get(`/public/contstituencies-result/${id}`)
      return data.data
    },
    enabled: !!id,
  })
}
