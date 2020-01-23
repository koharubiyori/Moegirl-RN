export namespace EditApiData {
  interface GetCode {
    parse: {
      title: string
      pageid: number
      wikitext: { '*': string }
    }
  }

  interface GetPreview {
    parse: {
      title: string
      pageid: number
      text: { '*': string }
    }
  }

  interface GetLastTimestamp {
    continue: {
      rvcontinue: string
      continue: string
    }

    query: {
      pages: {
        [pageId: number]: {
          pageid: number
          ns: number
          title: string
          revisions: { timestamp: string }[]
        }
      }
    }
  }

  interface GetToken {
    query: {
      tokens: {
        csrftoken: string
      }
    }
  }

  interface EditArticle {
    result: string
    pageid: number
    title: string
    contentmodel: string
    nochange?: ''
    error?: { code: string }
  }
}