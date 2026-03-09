import {
  ApiCandidateResult,
  ConstituencyResultData,
  ResultItem,
  Vote,
} from '@/types/vote'
import api from '@/lib/api'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

// Hook to fetch My Vote
export function useMyVote(userId?: number | string) {
  return useQuery({
    queryKey: ['my-vote', userId],
    queryFn: async () => {
      try {
        const { data } = await api.get('/voter/my-vote')
        const v = data.data
        if (!v) return null
        return {
          ...v,
          candidate_id: v.candidateId,
          user_id: v.userId,
        } as Vote
      } catch {
        return null
      }
    },
    enabled: !!userId,
  })
}

// Mutation to Vote
export function useVoteMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      userId: number | string
      candidateId: string | number
      constituencyId: string | number
      isUpdate?: boolean
    }) => {
      const method = payload.isUpdate ? api.put : api.post
      const { data } = await method('/voter/vote', {
        candidateId: Number(payload.candidateId),
      })
      // If the response explicitly says ok: false, it's an error.
      // Otherwise, if it returns a vote object (which doesn't have .ok), it's a success.
      if (data.ok === false) {
        console.error('Vote Request Failed:', {
          method: payload.isUpdate ? 'PUT' : 'POST',
          data,
        })
        throw new Error(data.message || data.error || 'การลงคะแนนล้มเหลว')
      }

      return data
    },
    onSuccess: (data, variables) => {
      toast.success('ลงคะแนนเรียบร้อยแล้ว')
      queryClient.invalidateQueries({
        queryKey: ['my-vote', variables.userId],
      })
      queryClient.invalidateQueries({
        queryKey: ['results', variables.constituencyId],
      })
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] })
      queryClient.invalidateQueries({ queryKey: ['ec-stats'] })
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] })
    },
    onError: (error: AxiosError<{ message?: string; error?: string }>) => {
      console.error('Vote Error:', error)
      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'การลงคะแนนล้มเหลว'
      toast.error(message)
    },
  })
}

// =============================================================================
// MOCK DATA FOR CONSTITUENCY RESULTS
// TODO: Remove this mock data when backend API is ready
// =============================================================================

const MOCK_PARTIES = [
  { id: 1, name: 'พรรคก้าวไกล', color: '#FF6B00', logo_url: null },
  { id: 2, name: 'พรรคเพื่อไทย', color: '#ED1C24', logo_url: null },
  { id: 3, name: 'พรรคภูมิใจไทย', color: '#1E3A8A', logo_url: null },
  { id: 4, name: 'พรรคพลังประชารัฐ', color: '#2563EB', logo_url: null },
  { id: 5, name: 'พรรครวมไทยสร้างชาติ', color: '#7C3AED', logo_url: null },
  { id: 6, name: 'พรรคประชาธิปัตย์', color: '#3B82F6', logo_url: null },
  { id: 7, name: 'พรรคชาติไทยพัฒนา', color: '#10B981', logo_url: null },
  { id: 8, name: 'พรรคประชาชาติ', color: '#059669', logo_url: null },
]

const MOCK_FIRST_NAMES = [
  'สมชาย', 'สมหญิง', 'ประยุทธ์', 'ยิ่งลักษณ์', 'อภิสิทธิ์', 'พิธา',
  'ศิริกัญญา', 'ชัชชาติ', 'วิโรจน์', 'รังสิมันต์', 'ธนาธร', 'กรณ์',
  'อนุทิน', 'สุดารัตน์', 'จุรินทร์', 'เศรษฐา', 'แพทองธาร', 'วราวุธ',
]

const MOCK_LAST_NAMES = [
  'ใจดี', 'รักชาติ', 'พัฒนา', 'ศรีสุข', 'มั่งมี', 'เจริญกิจ',
  'สุขสันต์', 'วงศ์ไทย', 'พิทักษ์', 'บุญมาก', 'แสงทอง', 'รุ่งเรือง',
  'ชาญวิทย์', 'สง่างาม', 'เกียรติศักดิ์', 'ปิยะนุช', 'ลิ้มประยูร', 'ชินวัตร',
]

// Seeded random number generator for consistent mock data per constituency
function seededRandom(seed: number) {
  const x = Math.sin(seed * 9999) * 10000
  return x - Math.floor(x)
}

function generateMockResults(constituencyId: number): ConstituencyResultData {
  const seed = constituencyId
  const numCandidates = 3 + Math.floor(seededRandom(seed) * 5) // 3-7 candidates

  const results: ResultItem[] = []
  let totalVotes = 0

  for (let i = 0; i < numCandidates; i++) {
    const candidateSeed = seed * 100 + i
    const partyIndex = Math.floor(seededRandom(candidateSeed) * MOCK_PARTIES.length)
    const firstNameIndex = Math.floor(seededRandom(candidateSeed + 1) * MOCK_FIRST_NAMES.length)
    const lastNameIndex = Math.floor(seededRandom(candidateSeed + 2) * MOCK_LAST_NAMES.length)

    // Vote distribution: leader gets most, others taper off
    const baseVotes = Math.floor(seededRandom(candidateSeed + 3) * 30000) + 5000
    const voteMultiplier = Math.max(0.1, 1 - (i * 0.25)) // 1.0, 0.75, 0.5, 0.25...
    const voteCount = Math.floor(baseVotes * voteMultiplier)
    totalVotes += voteCount

    // 10% chance of independent candidate (no party)
    const isIndependent = seededRandom(candidateSeed + 4) < 0.1

    results.push({
      rank: i + 1,
      voteCount,
      candidate: {
        id: constituencyId * 100 + i,
        first_name: MOCK_FIRST_NAMES[firstNameIndex],
        last_name: MOCK_LAST_NAMES[lastNameIndex],
        candidate_number: i + 1,
        image_url: '',
        personal_policy: '',
        party: isIndependent ? null : MOCK_PARTIES[partyIndex],
      },
    })
  }

  // Sort by vote count descending and reassign ranks
  results.sort((a, b) => b.voteCount - a.voteCount)
  results.forEach((r, idx) => { r.rank = idx + 1 })

  return {
    pollOpen: true,
    results,
    totalVotes,
  }
}

// =============================================================================
// END MOCK DATA
// =============================================================================

// Hook to fetch Detailed Results for a Constituency
// NOTE: Currently returns MOCK DATA. Switch to real API when backend is ready.
export function useConstituencyResults(
  constituencyId?: string | number | null,
) {
  return useQuery<ConstituencyResultData>({
    queryKey: ['results', constituencyId],
    queryFn: async () => {
      if (!constituencyId)
        return { pollOpen: false, results: [], totalVotes: 0 }

      // =====================================================================
      // MOCK MODE: Return mock data instead of calling API
      // TODO: Remove this block and uncomment the API call below when ready
      // =====================================================================
      const mockData = generateMockResults(Number(constituencyId))
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300))
      return mockData
      // =====================================================================
      // END MOCK MODE
      // =====================================================================

      /* REAL API CALL - Uncomment when backend is ready:
      const { data } = await api.get(
        `/public/results?constituencyId=${constituencyId}`,
      )
      const apiData = data.data // { isPollOpen, candidates, totalVotes }

      // Map candidates to results with rank
      const mappedResults = (apiData.candidates || []).map(
        (r: ApiCandidateResult, index: number) => ({
          rank: index + 1,
          voteCount: r.voteCount,
          candidate: {
            id: r.candidateId,

            first_name: r.candidateName ? r.candidateName.split(' ')[0] : '',
            last_name: r.candidateName
              ? r.candidateName.split(' ').slice(1).join(' ')
              : '',
            candidate_number: r.candidateNumber,
            image_url: r.imageUrl || '',
            personal_policy: '',
            party: {
              id: r.partyId,
              name: r.partyName,
              logo_url: null,
              color: r.partyColor,
            },
          },
        }),
      )

      return {
        pollOpen: apiData.isPollOpen,
        results: mappedResults,
        totalVotes: apiData.totalVotes,
      }
      */
    },
    enabled: !!constituencyId,
  })
}
