import request from '~/utils/moeRequest'
import { WatchListApiData } from './watchList.d'

function isWatched(title: string) {
  return request<WatchListApiData.GetPageInfo>({
    params: {
      action: 'query',
      prop: 'info',
      titles: title,
      inprop: 'watched',
      intestactions: ''
    }
  }).then(data => {
    const onlyPageData = Object.values(data.query.pages)[0]
    return 'watched' in onlyPageData
  })
}

function getList(nextKey?: string) {
  return request<WatchListApiData.GetWatchList>({
    params: {
      action: 'query',
      generator: 'watchlistraw',
      ...(nextKey ? {
        continue: 'gwrcontinue||',
        generator: 'watchlistraw',
        gwrcontinue: nextKey
      } : {})
    }
  })
}

function getMainImages(titles: string[]) {
  return request<WatchListApiData.GetImages>({
    params: {
      action: 'query',
      prop: 'pageimages',
      titles: titles.join('|'),
      pithumbsize: 500
    }
  }).then(data => {
    var { pages } = data.query
    return Object.values(pages).map(item => item.thumbnail)
  })
}

async function getListWithImage(nextKey?: string) {
  const pagesData = await getList(nextKey)
  const titles = Object.values(pagesData.query.pages).map(item => item.title)
  const images = await getMainImages(titles)
  
  return titles.map((title, index) => ({ title, image: images[index] }))
}

function getToken() {
  return request<WatchListApiData.GetToken>({
    params: {
      action: 'query',
      meta: 'tokens',
      type: 'watch'
    }
  }) 
}

function executeSetWatchStatus(token: string, title: string, unwatch?: boolean) {
  return request({
    params: {
      action: 'watch',
      format: 'json',
      ...(unwatch ? { unwatch: 1 } : {}),
      titles: title,
      redirects: 1,
      token
    }
  })
}

async function setWatchStatus(title: string, unwatch?: boolean) {
  try {
    const tokenData = await getToken()
    const token = tokenData.query.tokens.watchtoken
    executeSetWatchStatus(token, title, unwatch)
  } catch (e) {
    return Promise.reject(e)
  }
}

const watchListApi = { isWatched, getListWithImage, setWatchStatus }
export default watchListApi