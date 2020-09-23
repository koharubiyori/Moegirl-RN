import articleApi from '~/api/article'
import { ArticleApiData } from '~/api/article/types'
import store from '~/mobx'

const articleCache: { [key: string]: any } = {}

export function getArticleContent(pageName: string, forceLoad = false): Promise<ArticleApiData.GetContent> {
  return new Promise((resolve, reject) => {
    const pageNameWithSource = `${store.settings.source}_${store.settings.lang}_${pageName}`
    
    if (articleCache[pageNameWithSource] && !forceLoad) resolve(articleCache[pageNameWithSource])
    articleApi.getContent(pageName)
      .then(data => {
        articleCache[pageNameWithSource] = data
        resolve(data)
      })
      .catch(reject)
  })
}