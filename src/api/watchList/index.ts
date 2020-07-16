import moeRequest from '~/request/moegirl'
import { WatchListApiData } from './types'

function isWatched(title: string) {
  return moeRequest<WatchListApiData.GetPageInfo>({
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
  return moeRequest<WatchListApiData.GetWatchList>({
    params: {
      action: 'query',
      prop: 'pageimages',
      list: 'watchlistraw',
      wrlimit: '50',
      pithumbsize: 500,
      ...(nextKey ? {
        continue: '-||pageimages',
        gwrcontinue: nextKey
      } : {})
    }
  })
}

function getMainImages(titles: string[]) {
  return moeRequest<WatchListApiData.GetImages>({
    method: 'post',
    params: {
      action: 'query',
      prop: 'pageimages',
      titles: titles.join('|'),
      pithumbsize: 500
    }
  })
}

function getListWithImage(nextKey?: string) {
  return moeRequest<WatchListApiData.GetWatchList>({
    params: {
      action: 'query',
      format: 'json',
      prop: 'pageimages|revisions',
      continue: 'gwrcontinue||',
      generator: 'watchlistraw',
      redirects: 1,
      rvprop: 'timestamp',
      gwrcontinue: nextKey,
      gwrlimit: '50',
      pithumbsize: 500,
      ...(nextKey ? {
        continue: 'gwrcontinue||',
        gwrcontinue: nextKey
      } : {})
    }
  })
}

function getToken() {
  return moeRequest<WatchListApiData.GetToken>({
    params: {
      action: 'query',
      meta: 'tokens',
      type: 'watch'
    }
  }) 
}

function executeSetWatchStatus(token: string, title: string, unwatch?: boolean) {
  return moeRequest({
    method: 'post',
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

async function setWatchStatus(title: string, watch: boolean) {
  try {
    const tokenData = await getToken()
    const token = tokenData.query.tokens.watchtoken
    return await executeSetWatchStatus(token, title, !watch)
  } catch (e) {
    return Promise.reject(e)
  }
}

const watchListApi = { isWatched, getListWithImage, setWatchStatus }
export default watchListApi