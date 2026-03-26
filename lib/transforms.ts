/**
 * API response transformers: camelCase → snake_case
 * Centralizes data transformation from API format to frontend format
 */

import type { ApiCandidate, ApiConstituency, ApiParty } from '@/types/api'
import type { ConstituencyCandidate } from '@/types/constituency'

// Constituency transformation
export interface TransformedConstituency {
  id: number
  province: string
  provinceId: number
  zone_number: number
  districts?: string[]
  districtIds?: number[]
  is_poll_open: boolean
  candidateCount: number
  candidates?: ConstituencyCandidate[]
}

export function transformConstituency(
  c: ApiConstituency,
): TransformedConstituency {
  const districts = c.districts?.map((d) => d.name)
  const districtIds = c.districts?.map((d) => d.id)
  const candidates: ConstituencyCandidate[] = (
    c.candidates?.map((candidate) => ({
      id: candidate.id,
      number: candidate.number,
      firstName: candidate.firstName,
      lastName: candidate.lastName,
      imageUrl: candidate.imageUrl,
      partyName: candidate.party?.name,
    })) || []
  ).sort((a, b) => a.number - b.number)
  return {
    id: c.id,
    province: c.province?.name || `จังหวัด ${c.provinceId}`,
    provinceId: c.provinceId,
    zone_number: c.number,
    districts,
    districtIds,
    is_poll_open: !c.isClosed,
    candidateCount: candidates.length,
    candidates,
  }
}

export function transformConstituencies(
  data: ApiConstituency[],
): TransformedConstituency[] {
  return data.map(transformConstituency)
}

// Candidate transformation
export interface TransformedCandidate {
  id: number
  full_name: string
  candidate_number: number
  image_url: string
  policy?: string
  constituency?: {
    number: number
    province: string
  } | null
  party: {
    id: number
    name: string
    logo_url: string
    policy?: string
  } | null
}

export function transformCandidate(c: ApiCandidate): TransformedCandidate {
  // Combine firstName + lastName (API เปลี่ยนจาก fullName เป็น firstName/lastName)
  const fullName = [c.firstName, c.lastName].filter(Boolean).join(' ')
  // นโยบาย: ใช้ candidatePolicy ก่อน, fallback เป็น party.policy
  const policy = c.candidatePolicy || c.party?.policy

  return {
    id: c.id,
    full_name: fullName,
    candidate_number: c.number,
    image_url: c.imageUrl,
    policy: policy || undefined,
    constituency: c.constituency
      ? {
          number: c.constituency.number,
          province: c.constituency.province.name,
        }
      : null,
    party: c.party
      ? {
          id: c.party.id,
          name: c.party.name,
          logo_url: c.party.logoUrl,
          policy: policy || undefined,
        }
      : null,
  }
}

export function transformCandidates(
  data: ApiCandidate[],
): TransformedCandidate[] {
  return data.map(transformCandidate)
}

// Party transformation
export interface TransformedParty {
  id: number
  name: string
  logoUrl: string
  logo_url: string
  policy: string
}

export function transformParty(p: ApiParty): TransformedParty {
  return {
    id: p.id,
    name: p.name,
    logoUrl: p.logoUrl || '',
    logo_url: p.logoUrl || '',
    policy: p.policy || '',
  }
}

export function transformParties(data: ApiParty[]): TransformedParty[] {
  return data.map(transformParty)
}
