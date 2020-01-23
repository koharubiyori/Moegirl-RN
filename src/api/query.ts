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

const queryApi = { getRecentChanges, getRandomPages }
export default queryApi