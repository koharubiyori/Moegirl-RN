export interface ArticleCategoryData {
  sortkey: string
  '*': string
}

export interface ArticleTemplateData {
  ns: number
  exists?: ''
  '*': string
}

export interface ArticleImageNormalizedData {
  from: string
  to: string
}

export interface ArticleSectionData {
  toclevel: number
  level: string
  line: string
  number: string
  index: string
  fromtitle: string
  byteoffset: number
  anchor: string
}

export interface ArticleImageInfoData {
  url: string
  descriptionurl: string
  descriptionshorturl: string
}

export namespace ArticleApiData {
  interface GetContent {
    error?: any
    
    parse: {
      title: string
      pageid: number
      redirects: any[]
      text: { '*': string }
      categories: any[]
      templates: ArticleTemplateData[]
      images: string[]
      sections: ArticleTemplateData[]
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

  interface getImgUrl {
    query: {
      normalized: ArticleImageNormalizedData[]
      pages: {
        [pageId: number]: {
          pageid: number
          ns: number
          title: string
          imagerepository: string
          imageinfo: ArticleImageInfoData[]
        }
      }
    }
  }
}