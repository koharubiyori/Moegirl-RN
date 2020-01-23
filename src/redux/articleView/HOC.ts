import articleApi from '~/api/article'
import { ApiData } from '~/api/article.d'
import store from '~/redux'
import myConnect from '~/utils/redux/myConnect'
import { ADD, State } from './index'

const { dispatch, getState } = store

export const getContent = (pageName: string, forceLoad = false): Promise<ApiData.GetContent> => new Promise((resolve, reject) => {
  const { articleView } = getState()

  var cache = articleView.pagesCache[pageName]
  if (cache && !forceLoad) { return resolve(cache) }

  articleApi.getContent(pageName)
    .then(data => {
      if (data.error) return reject(data.error)
      dispatch({ type: ADD, name: pageName, data })
      resolve(data)
    })
    .catch(reject)
})

interface ConnectedDispatch {
  $articleView: {
    getContent: typeof getContent
  }
}

export type ArticleViewConnectedProps = ConnectedDispatch & {
  state: { articleView: State }
}

export const articleViewHOC = myConnect('$articleView', { getContent })