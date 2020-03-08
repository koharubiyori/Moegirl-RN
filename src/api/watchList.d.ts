export namespace WatchListApiData {
  interface GetWatchList {
    continue: {
      gwrcontinue: string
      continue: string
    }
    
    query: {
      pages: {
        [pageId: number]: {
          pageid: number
          ns: number
          title: string
        }
      }
    }
  }
  
  interface GetPageInfo {
    query: {
      pages: {
        [pageId: number]: {
          pageid: number
          ns: number
          title: string
          contentmodel: string
          pagelanguage: string
          pagelanguagehtmlcode: string
          pagelanguagedir: string
          touched: string
          lastrevid: number
          watched?: ''
        }
      }
    }
  }

  interface GetImages {
    query: {
      pages: {
        [pageId: number]: {
          pageid: number
          ns: number
          title: string
          pageimage: string
          
          thumbnail: {
            source: string
            width: number
            height: number
          }
        }
      }
    }
  }

  interface GetToken {
    query: {
      tokens: {
        watchtoken: string
      }
    }
  }
}