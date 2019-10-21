import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, FlatList, ActivityIndicator, TouchableOpacity,
  StyleSheet
} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import Button from '~/components/Button'
import StatusBar from '~/components/StatusBar'
import Item from './components/Item'
import { search } from '~/api/search'
import toast from '~/utils/toast'

export default class SearchResult extends React.Component{
  static propTypes = {
    navigation: PropTypes.object
  }

  constructor (props){
    super(props)
    this.state = {
      list: [],
      total: null,
      status: 1   // 1：初始值，2：加载中，3：加载成功，0：加载失败，4：全部加载完成，5：已加载，但结果为空
    }

    this.searchWord = this.props.navigation.getParam('searchWord')
  }

  componentDidMount (){
    this.loadList()
  }
  
  loadList = () =>{
    if(this.state.status === 4 || this.state.status === 2){ return }
    this.setState({ status: 2 })
    search(this.searchWord, this.state.list.length)
      .then(({query}) =>{
        if(!query.searchinfo.totalhits){
          this.setState({ status: 5 })
          return
        }

        var status = 3

        if(query.searchinfo.totalhits === this.state.list.length + query.search.length){
          status = 4
        }

        this.setState({
          total: query.searchinfo.totalhits,
          list: this.state.list.concat(query.search),
          status
        })
      }).catch(() =>{
        this.setState({ status: 0 })
        toast.show('加载失败，正在重试')
      })
  }

  render (){
    return (
      <View style={{ flex: 1 }}>
        <StatusBar blackText color="white" />
        <View style={styles.body}>
          <Button onPress={() => this.props.navigation.goBack()} rippleColor={$colors.light}>
            <Icon name="keyboard-backspace" size={25} color="#666" />
          </Button>

          <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>搜索：{this.searchWord}</Text>
        </View>

        {/* {this.state.total ?
          <View style={styles.totalHint}>
            <Text style={{ color: '#666' }}>共搜索到{this.state.total}结果</Text>
          </View>
        : null} */}

        <FlatList data={this.state.list} 
          onEndReachedThreshold={0.5}
          onEndReached={this.loadList}
          style={styles.list}
          renderItem={item => <Item 
            key={item.item.id}
            data={item.item}
            searchWord={this.searchWord} 
            onPress={link => this.props.navigation.push('article', { link })}
          />}

          ListFooterComponent={({
            0: () => 
            <TouchableOpacity onPress={this.loadList}>
              <View style={{ height: 50, justifyContent: 'center', alignContent: 'center', elevation: 2 }}>
                <Text>加载失败，点击重试</Text>
              </View>
            </TouchableOpacity>,
            2: () => <ActivityIndicator color={$colors.main} size={50} style={{ marginVertical: 10 }} />,
            4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: '#666' }}>已经没有啦</Text>
          }[this.state.status] || new Function)()}
          textBreakStrategy="balanced"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  body: {
    height: 55,
    elevation: 3,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
  },

  title: {
    color: '#666',
    fontSize: 18,
    marginLeft: 10,
  },

  totalHint: {
    
  },

  list: {
    flex: 1
  }
})