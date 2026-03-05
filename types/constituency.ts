import { PaginationMeta } from './common'

export interface Constituency {
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

export interface ConstituencyCandidate {
  id: number
  number: number
  firstName: string
  lastName: string
  imageUrl: string
  partyName?: string
}

export interface AvailableDistrict {
  id: number
  name: string
  provinceId: number
  constituencyId: number | null
}

export interface ManageConstituenciesResult {
  constituencies: Constituency[]
  meta: PaginationMeta
}
