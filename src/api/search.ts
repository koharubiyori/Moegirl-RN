import request from '~/utils/moeRequest'
import { SearchApiData } from './search.d'

function getHint(searchWord: string, srlimit = 10) {
  return request<SearchApiData.GetHint>({
    params: {
      action: 'query',
      list: 'search',
      srsearch: searchWord,
      srlimit,
      srwhat: 'text'
    }
  })
}

function search(searchWord: string, offset: number) {
  return request<SearchApiData.Search>({
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

const searchApi = { getHint, search }
export default searchApi