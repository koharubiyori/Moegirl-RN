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

export namespace ApiData {
  interface GetRecentChanges {
    batchcomplete: string
    continue: {
      rccontinue: string
      continue: string
    }

    limits: { recentchanges: number }
    query: { recentchanges: RecentChangesData[] }
  }

  interface GetRandomPages {
    batchcomplete: string
    continue: {
      rncontinue: string
      continue: string
    }

    quary: { random: RandomPageData[] }
  }
}