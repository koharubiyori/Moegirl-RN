import request from '~/utils/moeRequest'

export function getArticle(name = 'Mainpage'){
  return request({
    params: {
      action: 'parse',
      page: name,
      redirects: 1,
      prop: 'text|categories|templates|sections|images'
    }
  })
}