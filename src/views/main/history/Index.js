import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, ScrollView,
  StyleSheet, DeviceEventEmitter
} from 'react-native'
import storage from '~/utils/storage'
import Header from '../components/Header'
import Item from './components/Item'
import Title from './components/Title'

function dateFormat(timestamp, prefix){
  let date = new Date(timestamp)
  function supply(val){
    if(val < 10){
      return '0' + val
    }
    return val
  }

  let dateArr = [date.getFullYear(), supply(date.getMonth() + 1), supply(date.getDate())]
  let timeArr = [supply(date.getHours()), supply(date.getMinutes())]
  if(prefix){
    return `${prefix} ${timeArr.join(':')}`
  }else{
    return `${dateArr.join('/')} ${timeArr.join(':')}`
  }
}

function Finds(props){
  const initLists = () => ({
    all: [],
    today: [],
    yesterday: [],
    ago: [],
  })

  const [lists, setLists] = useState(initLists())

  useEffect(() =>{
    refresh()
    DeviceEventEmitter.addListener('refreshHistory', () => refresh())
    DeviceEventEmitter.addListener('clearHistory', () => setState(init()))

    return () =>{
      DeviceEventEmitter.removeListener('refreshHistory')
      DeviceEventEmitter.removeListener('clearHistory')
    }
  }, [])

  async function refresh (){
    let list = await storage.get('browsingHistory')
    let lists = {
      all: list,
      today: [],
      yesterday: [],
      ago: []
    }

    let now = new Date()
    now.setDate(now.getDate() - 1)
    let yesterdayBeginTimestamp = now.setHours(0, 0, 0, 0)
    let yesterdayEndTimestamp = now.setHours(23, 59, 59, 999)

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

    setLists(lists)
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header title="浏览历史" />

      {!lists.all.length ?
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }}>
          <Text style={{ color: '#666', fontSize: 18 }}>暂无记录</Text>
        </View>
      :
        <ScrollView style={{ paddingVertical: 5 }}>
          {lists.today.length ? <Title text="今天" style={{ marginTop: 10 }} /> : null }
          {lists.today.map(item =>
            <Item data={item} key={item.title} onPress={link => props.navigation.push('article', { link })} />  
          )}

          {lists.yesterday.length ? <Title text="昨天" style={{ marginTop: 10 }} /> : null }
          {lists.yesterday.map(item =>
            <Item data={item} key={item.title} onPress={link => props.navigation.push('article', { link })} />  
          )}

          {lists.ago.length ? <Title text="更早" style={{ marginTop: 10 }} /> : null }
          {lists.ago.map(item =>
            <Item data={item} key={item.title} onPress={link => props.navigation.push('article', { link })} />  
          )}

          <View style={{ height: 10 }} />
        </ScrollView>
      }
    </View>
  )
}

export default Finds