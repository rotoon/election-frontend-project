import { PaginationMeta } from './common'

// === GET Response Types ===

/** แต่ละ item ใน list จาก GET /ec/candidates */
export interface CandidateItem {
  id: number
  citizenId: string
  number: number
  firstName: string
  lastName: string
  candidatePolicy: string | null
  imageUrl: string
  partyId: number
  constituencyId: number
  party: {
    name: string
  }
  constituency: {
    number: number
    province: {
      id: number
      name: string
    }
  }
}

/** Response จาก GET /ec/candidates (Paginated) */
export interface GetCandidatesResponse {
  total: number
  candidate: CandidateItem[]
  page: number
  limit: number
  totalPages: number
}

/** Query params สำหรับดึงรายการ */
export interface GetCandidatesQuery {
  page?: number
  limit?: number
  search?: string
  sortBy?: 'id' | 'number' | 'firstName' | 'lastName'
  order?: 'asc' | 'desc'
  partyId?: number | string
  constituencyId?: number | string
  provinceId?: number | string
}

// === Mutation Payload Types ===

/** สร้างผู้สมัคร POST /ec/candidates */
export interface CreateCandidatePayload {
  citizenId: string
  number: number
  firstName: string
  lastName: string
  candidatePolicy?: string
  imageUrl: string
  partyId: number
  constituencyId: number
}

/** แก้ไขผู้สมัคร PATCH /ec/candidates/:id (Partial) */
export interface UpdateCandidatePayload {
  citizenId?: string
  number?: number
  firstName?: string
  lastName?: string
  candidatePolicy?: string
  imageUrl?: string
  partyId?: number
  constituencyId?: number
}

// === Mutation Response Types ===

/** Response จาก POST / PATCH */
export interface MutateCandidateResponse {
  message: string
  data: {
    id: number
    citizenId: string
    number: number
    firstName: string
    lastName: string
    candidatePolicy: string | null
    imageUrl: string
    partyId: number
    constituencyId: number
  }
}

/** Response จาก DELETE */
export interface DeleteCandidateResponse {
  message: string
}

// === Internal Types (for hooks) ===

export interface ManageCandidatesResult {
  candidates: CandidateItem[]
  meta: PaginationMeta
}

// === Legacy voter type (ไม่เปลี่ยน) ===

export interface Candidate {
  id: number
  full_name: string
  candidate_number: number
  national_id?: string
  image_url: string
  party?: {
    id: number
    name: string
    logo_url: string
    color: string
    policy?: string
  } | null
}
