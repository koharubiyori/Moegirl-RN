import request from '~/utils/moeRequest'

export function getHint(searchWord, srlimit = 10){
  return request({
    params: {
      action: 'query',
      list: 'search',
      srsearch: searchWord,
      srlimit,
      srwhat: 'text'
    }
  })
}

export function search(searchWord, offset){
  return request({
    params: {
      action: 'query',
      list: 'search',
      srsearch: searchWord,
      continue: '-||',
      sroffset: offset,
      srprop: 'timestamp|redirecttitle|snippet|categoriesnippet|sectiontitle',
      srenablerewrites: 1      
    }
  })
}