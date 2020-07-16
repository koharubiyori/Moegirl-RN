export interface RecentChangesData {
  type: 'edit' | 'new'
  ns: number
  title: string
  pageid: number
  revid: number
  old_revid: number
  rcid: number
  timestamp: string
}

export interface RandomPageData {
  ns: number
  id: number
  title: string
}

export namespace QueryApiData {
  interface GetRecentChanges {
    continue: {
      rccontinue: string
      continue: string
    }

    limits: { recentchanges: number }
    query: { recentchanges: RecentChangesData[] }
  }

  interface GetRandomPages {
    continue: {
      rncontinue: string
      continue: string
    }

    query: { random: RandomPageData[] }
  }
}