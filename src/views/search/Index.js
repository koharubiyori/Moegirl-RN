import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ScrollView,
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
      recentSearch: null,
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

  toSearchResultView = () =>{
    const text = this.state.searchWord.trim()
    if(!text){
      toast.show('搜索关键词不能为空', 'center')
      return
    }

    this.props.navigation.push('searchResult', { searchWord: text })
  }

  render (){
    return (
      <NavigationContext.Provider value={this.props.navigation}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <StatusBar blackText color="white" />
          <Header value={this.state.searchWord} 
            onChangeText={this.changeText} 
            onSubmit={this.toSearchResultView}
          />
          {this.state.searchWord ? 
            <SearchHint titles={this.state.searchHint} />
          : 
            <RecentSearch />
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