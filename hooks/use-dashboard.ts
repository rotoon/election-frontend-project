import api from '@/lib/api'
import { useQuery } from '@tanstack/react-query'

import { DashboardData, PublicConstituency } from '@/types/dashboard'

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

export function useDashboardStats() {
  return useQuery<DashboardData>({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const { data } = await api.get('/public/stats')
      return {
        ...data.data,
        turnout: data.data.turnout || data.data.voteTurnout,
      }
    },
    staleTime: 10000,
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
