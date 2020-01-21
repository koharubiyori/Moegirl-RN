import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, 
  StyleSheet
} from 'react-native'
import StatusBar from '~/components/StatusBar'
import toast from '~/utils/toast'
import Header from './components/Header'
import SearchHint from './components/SearchHint'
import RecentSearch from './components/RecentSearch'
import storage from '~/utils/storage'
import { getHint } from '~/api/search'

export interface Props {

}

type FinalProps = Props & __Navigation.InjectedNavigation

function Search(props: PropsWithChildren<FinalProps>) {
  const [searchWord, setSearchWord] = useState('')
  const [searchHint, setSearchHint] = useState<string[] | null>(null)
  const [searchHistory, setSearchHistory] = useState([])
  const setTimeoutKey = useRef(0)

  useEffect(() => {
    storage.get('searchHistory').then(data => data && setSearchHistory(data))
  }, [])

  function changeText(text: string) {
    text = text.trim()
    setSearchWord(text)
    clearTimeout(setTimeoutKey.current)
    if (!text) return setSearchHint(null)
    setTimeoutKey.current = setTimeout(() => getHint(text).then(data => 
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
      onTapCheck: () => {
        storage.remove('searchHistory')
        setSearchHistory([])
        toast.show('操作成功')
      }
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar blackText color="white" />
      <Header value={searchWord} 
        onChangeText={changeText} 
        onSubmit={() => toSearchResultView()}
      />
      {searchWord 
        ? <SearchHint titles={searchHint} onTapTitle={toSearchResultView} />
        : <RecentSearch 
          titles={searchHistory}
          onTapDelete={clearSearchHistory}
          onTapTitle={toSearchResultView}
        />
      }
    </View>
  )
}

export default Search