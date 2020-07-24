import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import searchApi from '~/api/search'
import MyStatusBar from '~/components/MyStatusBar'
import ViewContainer from '~/components/ViewContainer'
import storage from '~/utils/storage'
import toast from '~/utils/toast'
import Header from './components/Header'
import RecentSearch from './components/RecentSearch'
import SearchHint from './components/SearchHint'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import dialog from '~/utils/dialog'
import i from './lang'

export interface Props {

}

export interface RouteParams {

}

export interface SearchHistory {
  keyword: string
  byHint: boolean
}

function SearchPage(props: PropsWithChildren<Props>) {
  const navigation = useTypedNavigation()
  const [searchWord, setSearchWord] = useState('')
  const [searchHint, setSearchHint] = useState<string[] | null>(null)
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const setTimeoutKey = useRef(0)

  useEffect(() => {
    let data = storage.get('searchHistory') || []
    setSearchHistory(data)
  }, [])

  function changeText(text: string) {
    setSearchWord(text)
    text = text.trim()
    clearTimeout(setTimeoutKey.current)
    if (!text) return setSearchHint(null)
    setTimeoutKey.current = setTimeout(() => searchApi.getHint(text).then(data => 
      setSearchHint(data.query.search.map(item => item.title))
    ), 1000) as any as number
  }

  // 更新搜索历史
  function updateSearchHistory(keyword: string, byHint: boolean): SearchHistory[] {
    let searchHistoryData = searchHistory.filter(item => item.keyword !== keyword)
    searchHistoryData.unshift({ keyword, byHint })
    storage.set('searchHistory', searchHistoryData)
    setTimeout(() => setSearchHistory(searchHistoryData), 1000)
    return searchHistoryData
  }

  function toSearchResultPage(keyword: string) {
    let trimmedKeyword = keyword.trim()
    if (!trimmedKeyword) {
      toast(i.index.keywordEmptyMsg, 'center')
      return
    }

    navigation.push('searchResult', { keyword })
    updateSearchHistory(keyword, false)
  }

  function toArticlePage(keyword: string) {
    updateSearchHistory(keyword, true)
    navigation.push('article', { pageName: keyword })
  }

  async function clearSearchHistory () {
    await dialog.confirm.show({
      content: i.index.clearSearchHistory.check,
    })

    storage.remove('searchHistory')
    setSearchHistory([])
    toast(i.index.clearSearchHistory.success)
  }

  return (
    <ViewContainer>
      <MyStatusBar blackText />
      <Header 
        value={searchWord} 
        onChangeText={changeText} 
        onSubmit={() => toSearchResultPage(searchWord)}
      />
      {searchWord ? 
        <SearchHint titles={searchHint} onPressTitle={toArticlePage} />
      : 
        <RecentSearch 
          titles={searchHistory}
          onPressDelete={clearSearchHistory}
          onPressTitle={title => title.byHint ? toArticlePage(title.keyword) : toSearchResultPage(title.keyword)}
        />
      }
    </ViewContainer>
  )
}

export default SearchPage