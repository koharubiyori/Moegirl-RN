import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, 
  StyleSheet
} from 'react-native'
import StatusBar from '~/components/StatusBar'
import toast from '~/utils/toast'
import Header from './Header'
import SearchHint from './SearchHint'
import RecentSearch from './RecentSearch'
import storage from '~/utils/storage'
import { getHint } from '~/api/search'

const NavigationContext = React.createContext()

export { NavigationContext }

export default class Search extends React.Component{
  static propTypes = {
    navigation: PropTypes.object
  }

  constructor (props){
    super(props)
    this.state = {
      searchWord: '',
      searchHint: null,
      searchHistory: []
    }

    this.setTimeoutKey = 0

    storage.get('searchHistory').then(data => data && this.setState({ searchHistory: data }))
  }

  changeText = text =>{
    text = text.trim()
    this.setState({ searchWord: text })
    clearTimeout(this.setTimeoutKey)
    if(!text){ return this.setState({ searchHint: null }) }
    this.setTimeoutKey = setTimeout(() => getHint(text).then(data => this.setState({
      searchHint: data.query.search.map(item => item.title)
    })), 1000)
  }

  toSearchResultView = (text = this.state.searchWord.trim()) =>{
    if(!text){
      toast.show('搜索关键词不能为空', 'center')
      return
    }

    var searchHistory = this.state.searchHistory.filter(item => item !== text)
    searchHistory.unshift(text)
    this.setState({ searchHistory })
    storage.set('searchHistory', searchHistory)

    this.props.navigation.push('searchResult', { searchWord: text })
  }

  clearSearchHistory = () =>{
    $dialog.confirm.show({
      content: '确定要删除所有搜索记录吗？',
      onTapCheck: () =>{
        storage.remove('searchHistory')
        this.setState({ searchHistory: [] })
        toast.show('操作成功')
        $dialog.confirm.hide()
      }
    })
  }

  render (){
    return (
      <NavigationContext.Provider value={this.props.navigation}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <StatusBar blackText color="white" />
          <Header value={this.state.searchWord} 
            onChangeText={this.changeText} 
            onSubmit={() => this.toSearchResultView()}
          />
          {this.state.searchWord ? 
            <SearchHint titles={this.state.searchHint} onTapTitle={title => this.toSearchResultView(title)} />
          : 
            <RecentSearch 
              titles={this.state.searchHistory}
              onTapDelete={this.clearSearchHistory}
              onTapTitle={title => this.toSearchResultView(title)}
            />
          }
        </View>
      </NavigationContext.Provider>
    )
  }
}

const styles = StyleSheet.create({
  main: {

  },

  mainHeader: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20
  }
})