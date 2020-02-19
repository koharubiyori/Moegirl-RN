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
      srprop: 'timestamp|redirecttitle|snippet|categoriesnippet|sectiontitle|pageimages',
      srenablerewrites: 1      
    }
  })
}

function searchByCategory (category: string, thumbSize: number, nextKey?: string) {
  return request<SearchApiData.SearchByCategory>({
    params: {
      action: 'query',
      format: 'json',
      prop: 'categoryinfo|pageimages',
      generator: 'categorymembers',
      pilimit: '50',
      gcmtitle: 'Category:' + category,
      gcmprop: 'sortkey|sortkeyprefix',
      gcmnamespace: '0',
      ...(nextKey ? { 
        gcmcontinue: nextKey,
        continue: 'gcmcontinue||' 
      } : {}),
      gcmlimit: '50',
      pithumbsize: thumbSize
    }
  })
}

const searchApi = { getHint, search, searchByCategory }
export default searchApi