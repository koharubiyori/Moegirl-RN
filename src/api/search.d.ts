export interface SearchHintData {
  ns: number
  title: string
  snippet: string
  timestamp: string
  wordcount: number
  size: number
  pageId: number
}

// 你没看错，正式搜索接口返回的数据比搜索提示的字段要少_(:з」∠)_
export interface SearchData {
  ns: number
  title: string
  snippet: string
  timestamp: string
}

export interface SearchByCategoryData {
  pageid: number
  ns: number
  title: string
  thumbnail: {
    source: string
    width: number
    height: number
  }
  pageimage: string
}

export namespace SearchApiData {
  interface GetHint {
    continue: {
      sroffset: number
      continue: string
    }
    
    query: {
      pages: {
        [pageId: number]: {
          ns: number
          title: string
          missing?: ''
        }
      }

      searchinfo: { totalhits: number }
      search: SearchData[]
    }
  }
  
  interface Search {
    continue: {
      sroffset: number
      continue: string
    }

    query: {
      searchinfo: { totalhits: number }
      search: SearchHintData[]
    }
  }

  interface SearchByCategory {
    continue?: {
      gcmcontinue: string
      continue: string
    }

    query: {
      pages: { [pageId: number]: SearchByCategoryData }
    }
  }
}