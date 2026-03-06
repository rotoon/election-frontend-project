export interface PublicConstituency {
  id: number
  province: string
  zone_number: number
  name: string
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
