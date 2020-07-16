import articleApi from '~/api/article'
import { ArticleApiData } from '~/api/article/types'

const articleCache: { [key: string]: any } = {}

export function getArticleContent(pageName: string, forceLoad = false): Promise<ArticleApiData.GetContent> {
  return new Promise((resolve, reject) => {
    if (articleCache[pageName] && !forceLoad) resolve(articleCache[pageName])
    articleApi.getContent(pageName)
      .then(data => {
        articleCache[pageName] = data
        resolve(data)
      })
      .catch(reject)
  })
}