import request from '~/utils/moeRequest'
import { QueryApiData } from './query.d'

function getRecentChanges () {
  return request<QueryApiData.GetRecentChanges>({
    params: {
      action: 'query',
      list: 'recentchanges',
      rcnamespace: 0,
      rclimit: 'max'
    }
  })
}

function getRandomPages (rnlimit = 5) {
  return request<QueryApiData.GetRandomPages>({
    params: {
      action: 'query',
      list: 'random',
      rnnamespace: 0,
      rnlimit
    }
  })
}

function getPagesByCategory (category: string, nextKey: string) {
  return request({
    params: {
      action: 'query',
      format: 'json',
      prop: 'categoryinfo|pageimages',
      continue: 'gcmcontinue||',
      generator: 'categorymembers',
      utf8: 1,
      pilimit: '50',
      gcmtitle: 'Category:' + category,
      gcmprop: 'sortkey|sortkeyprefix',
      gcmnamespace: '0',
      ...(nextKey ? { gcmcontinue: nextKey } : {}),
      gcmlimit: '50'
    }
  })
}

const queryApi = { getRecentChanges, getRandomPages, getPagesByCategory }
export default queryApi