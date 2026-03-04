import { Constituency, District, Province } from './location'

export interface User {
  id: number
  citizenId: string
  firstName: string
  lastName: string
  address: string
  province?: Province | { id: number; name: string }
  district?: District | { id: number; name: string }
  constituency?:
    | Constituency
    | { id: number; number: number; isClosed: boolean }
    | null
    | undefined
  roles: string[]
  createdAt?: string
}

// API response from /admin/users
export interface AdminUserResponse {
  id: number
  citizenId: string
  firstName: string
  lastName: string
  address?: string
  province?: { id: number; name: string }
  provinceId?: number
  districtId?: number
  constituencyId?: number
  roles: { role: { id: number; name: string } }[]
  createdAt?: string
}

export interface ManageUsersResult {
  users: User[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
