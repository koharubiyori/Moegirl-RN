import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import searchApi from '~/api/search'
import StatusBar from '~/components/StatusBar'
import ViewContainer from '~/components/ViewContainer'
import storage from '~/utils/storage'
import toast from '~/utils/toast'
import Header from './components/Header'
import RecentSearch from './components/RecentSearch'
import SearchHint from './components/SearchHint'

export interface Props {

}

export interface RouteParams {

}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams>

function Search(props: PropsWithChildren<FinalProps>) {
  const [searchWord, setSearchWord] = useState('')
  const [searchHint, setSearchHint] = useState<string[] | null>(null)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const setTimeoutKey = useRef(0)

  useEffect(() => {
    let data = storage.get('searchHistory')  
    data && setSearchHistory(data)
  }, [])

  function changeText(text: string) {
    text = text.trim()
    setSearchWord(text)
    clearTimeout(setTimeoutKey.current)
    if (!text) return setSearchHint(null)
    setTimeoutKey.current = setTimeout(() => searchApi.getHint(text).then(data => 
      setSearchHint(data.query.search.map(item => item.title))
    ), 1000) as any as number
  }

  function toSearchResultView(text = searchWord.trim()) {
    if (!text) {
      toast.show('搜索关键词不能为空', 'center')
      return
    }

    let searchHistoryData = searchHistory.filter(item => item !== text)
    searchHistoryData.unshift(text)
    setSearchHistory(searchHistoryData)
    storage.set('searchHistory', searchHistoryData)

    props.navigation.push('searchResult', { searchWord: text })
  }

  function clearSearchHistory () {
    $dialog.confirm.show({
      content: '确定要删除所有搜索记录吗？',
      onPressCheck: () => {
        storage.remove('searchHistory')
        setSearchHistory([])
        toast.show('操作成功')
      }
    })
  }

  return (
    <ViewContainer>
      <StatusBar blackText />
      <Header value={searchWord} 
        onChangeText={changeText} 
        onSubmit={() => toSearchResultView()}
      />
      {searchWord 
        ? <SearchHint titles={searchHint} onPressTitle={toSearchResultView} />
        : <RecentSearch 
          titles={searchHistory}
          onPressDelete={clearSearchHistory}
          onPressTitle={toSearchResultView}
        />
      }
    </ViewContainer>
  )
}

export default Search