import request from '~/utils/moeRequest'

export function getRecentChanges (params){
  return request({
    params: {
      action: 'query',
      list: 'recentchanges',
      rcnamespace: 0,
      rclimit: 'max',
      ...params
    }
  })
}