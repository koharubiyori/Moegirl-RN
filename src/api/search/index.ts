// query和search都是获取条目列表，query和search区分的规则为：query不依赖用户的输入，search根据用户输入进行请求

import moeRequest from '~/request/moegirl'
import { SearchApiData } from './types'

function getHint(searchWord: string, srlimit = 10) {
  return moeRequest<SearchApiData.GetHint>({
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
  return moeRequest<SearchApiData.Search>({
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
  return moeRequest<SearchApiData.SearchByCategory>({
    params: {
      action: 'query',
      format: 'json',
      prop: 'pageimages|categories',
      cllimit: 500,
      generator: 'categorymembers',
      pilimit: '50',
      gcmtitle: 'Category:' + category,
      gcmprop: 'sortkey|sortkeyprefix',
      gcmnamespace: '0',
      continue: 'gcmcontinue||',
      ...(nextKey ? { 
        gcmcontinue: nextKey,
      } : {}),
      gcmlimit: '50',
      pithumbsize: thumbSize,
      clshow: '!hidden'
    }
  })
}

const searchApi = { getHint, search, searchByCategory }
export default searchApi