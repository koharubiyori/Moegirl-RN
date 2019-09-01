import request from '~/utils/moeRequest'

export function getHint(searchWord){
  return request({
    params: {
      action: 'query',
      list: 'search',
      srsearch: searchWord,
      titles: 10,
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