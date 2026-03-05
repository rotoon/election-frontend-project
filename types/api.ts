/**
 * API Response Types (camelCase format from backend)
 * These match the raw API response structure before transformation
 */

export interface ApiConstituency {
  id: number
  number: number
  provinceId: number
  isClosed: boolean
  districts?: {
    id: number
    name: string
  }[]
  province?: {
    id: number
    name: string
  }
}

export interface ApiCandidate {
  id: number
  firstName: string
  lastName: string
  number: number
  candidatePolicy?: string | null
  imageUrl: string
  party?: ApiPartyInCandidate
}

export interface ApiPartyInCandidate {
  id: number
  name: string
  logoUrl: string
  policy?: string
}

export interface ApiParty {
  id: number
  name: string
  logoUrl: string | null
  policy: string | null
}

export interface ApiError {
  response?: {
    data?: {
      message?: string
    }
  }
  message?: string
}
