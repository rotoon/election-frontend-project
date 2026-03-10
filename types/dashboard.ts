export interface PublicConstituency {
  id: number
  province: string
  zone_number: number
  name: string
}

export interface ApiConstituency {
  id: number
  number: number
  provinceId: number
  isClosed: boolean
}

export interface ProvinceWithConstituencies {
  id: number
  name: string
  constituencies: ApiConstituency[]
}

export interface ProvincesWithConstituenciesResponse {
  countingProgress: number
  provinces: ProvinceWithConstituencies[]
  updateAt?: Date
}

export interface DashboardPartyStat {
  id: number
  name: string
  color?: string
  seats: number
  logoUrl: string
  leader?: string
  [key: string]: string | number | undefined
}

export interface DashboardConstituencyCandidate {
  voteCount: number
  partyId: number
  partyName: string
  partyColor: string
}

export interface DashboardConstituency {
  province: string
  candidates: DashboardConstituencyCandidate[]
}

export interface DashboardData {
  totalVotes: number
  turnout: number
  countingProgress: number
  partyStats: DashboardPartyStat[]
  constituencies: DashboardConstituency[]
  updateAt: Date
}

export interface ApiConstituencyResultCandidate {
  id: number
  fullName: string
  candidatePolicy: string
  number?: number
  imageUrl?: string
  party: {
    id: number
    name: string
    logoUrl: string
    color?: string
  }
  votes: number
}

export interface ApiConstituencyResultResponse {
  id: number
  province: {
    id: number
    name: string
  }
  candidates: ApiConstituencyResultCandidate[]
}
