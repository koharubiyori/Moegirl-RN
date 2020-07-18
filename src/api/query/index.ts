// query和search都是获取条目列表，query和search区分的规则为：query不依赖用户的输入，search根据用户输入进行请求
import moeRequest from '~/request/moegirl'
import { QueryApiData } from './types'

function getRecentChanges () {
  return moeRequest<QueryApiData.GetRecentChanges>({
    params: {
      action: 'query',
      list: 'recentchanges',
      rcnamespace: 0,
      rclimit: 'max'
    }
  })
}

function getRandomPages (rnlimit = 5) {
  return moeRequest<QueryApiData.GetRandomPages>({
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