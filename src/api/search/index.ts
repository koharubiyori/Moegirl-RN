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

function getRecentChanges(options: {
  startISO: string
  namespace: string
  excludeUser?: string
  includeMinor: boolean
  includeRobot: boolean
  limit: number
}) {
  const rcshow: string[] = []
  !options.includeMinor && rcshow.push('!minor')
  !options.includeRobot && rcshow.push('!bot')

  return moeRequest<SearchApiData.getRecentChanges>({
    params: {
      action: 'query',
      list: 'recentchanges',
      rcend: options.startISO,
      rcnamespace: options.namespace,
      ...(options.excludeUser ? { rcexcludeuser: options.excludeUser } : {}),
      rcprop: 'tags|comment|flags|user|title|timestamp|ids|sizes|redirect',
      rcshow: rcshow.join('|'),
      rclimit: options.limit,
    }
  })
    .then(data => data.query.recentchanges)
}

const searchApi = { getHint, search, searchByCategory, getRecentChanges }
export default searchApi