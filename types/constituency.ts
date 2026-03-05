import { PaginationMeta } from './common'

export interface Constituency {
  id: number
  province: string
  provinceId: number
  zone_number: number
  districts?: string[]
  is_poll_open: boolean
}

export interface ManageConstituenciesResult {
  constituencies: Constituency[]
  meta: PaginationMeta
}
