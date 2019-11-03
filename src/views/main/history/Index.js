import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ScrollView,
  StyleSheet, DeviceEventEmitter
} from 'react-native'
import storage from '~/utils/storage'
import StatusBar from '~/components/StatusBar'
import Header from '../components/Header'
import Item from './components/Item'
import Title from './components/Title'

function dateFormat(timestamp, prefix){
  var date = new Date(timestamp)
  function supply(val){
    if(val < 10){
      return '0' + val
    }
    return val
  }

  var dateArr = [date.getFullYear(), supply(date.getMonth() + 1), supply(date.getDate())]
  var timeArr = [supply(date.getHours()), supply(date.getMinutes())]
  if(prefix){
    return `${prefix} ${timeArr.join(':')}`
  }else{
    return `${dateArr.join('/')} ${timeArr.join(':')}`
  }
}

export default class Finds extends React.Component{
  static propTypes = {
 
  }

  constructor (props){
    super(props)

    var init = () => ({
      lists: {
        all: [],
        today: [],
        yesterday: [],
        ago: [],
      },

      status: 1
    })

    this.state = init()

    this.refresh()
    DeviceEventEmitter.addListener('refreshHistory', () => this.refresh())
    DeviceEventEmitter.addListener('clearHistory', () => this.setState(init()))
  }

  componentWillUnmount (){
    DeviceEventEmitter.removeListener('refreshHistory')
    DeviceEventEmitter.removeListener('clearHistory')
  }

  async refresh (){
    var list = await storage.get('browsingHistory')
    var lists = {
      all: list,
      today: [],
      yesterday: [],
      ago: []
    }

    var now = new Date()
    now.setDate(now.getDate() - 1)
    var yesterdayBeginTimestamp = now.setHours(0, 0, 0, 0)
    var yesterdayEndTimestamp = now.setHours(23, 59, 59, 999)

    list.forEach(item =>{
      if(item.timestamp > yesterdayEndTimestamp){
        item.date = dateFormat(item.timestamp, '今天')
        lists.today.push(item)
      }else if(item.timestamp < yesterdayBeginTimestamp){
        item.date = dateFormat(item.timestamp)
        lists.ago.push(item)
      }else{
        item.date = dateFormat(item.timestamp, '昨天')
        lists.yesterday.push(item)
      }
    })

    this.setState({ lists })
  }

  render (){
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar />
        <Header title="浏览历史" />

        {!this.state.lists.all.length ?
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }}>
            <Text style={{ color: '#666', fontSize: 18 }}>暂无记录</Text>
          </View>
        :
          <ScrollView style={{ paddingVertical: 5 }}>
            {this.state.lists.today.length ? <Title text="今天" style={{ marginTop: 10 }} /> : null }
            {this.state.lists.today.map(item =>
              <Item data={item} key={item.title} onPress={link => this.props.navigation.push('article', { link })} />  
            )}
  
            {this.state.lists.yesterday.length ? <Title text="昨天" style={{ marginTop: 10 }} /> : null }
            {this.state.lists.yesterday.map(item =>
              <Item data={item} key={item.title} onPress={link => this.props.navigation.push('article', { link })} />  
            )}
  
            {this.state.lists.ago.length ? <Title text="更早" style={{ marginTop: 10 }} /> : null }
            {this.state.lists.ago.map(item =>
              <Item data={item} key={item.title} onPress={link => this.props.navigation.push('article', { link })} />  
            )}

            <View style={{ height: 10 }} />
          </ScrollView>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: 'white'
  }
})