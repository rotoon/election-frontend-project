/**
 * API response transformers: camelCase → snake_case
 * Centralizes data transformation from API format to frontend format
 */

import type { ApiCandidate, ApiConstituency, ApiParty } from '@/types/api'

// Constituency transformation
export interface TransformedConstituency {
  id: number
  province: string
  provinceId: number
  zone_number: number
  is_poll_open: boolean
}

export function transformConstituency(
  c: ApiConstituency,
): TransformedConstituency {
  return {
    id: c.id,
    province: c.province?.name || `จังหวัด ${c.provinceId}`,
    provinceId: c.provinceId,
    zone_number: c.number,
    is_poll_open: !c.isClosed,
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
    party: c.party
      ? {
          id: c.party.id,
          name: c.party.name,
          logo_url: c.party.logoUrl,
          policy: policy,
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
