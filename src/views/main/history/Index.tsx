import React, { PropsWithChildren, useEffect, useState } from 'react'
import { DeviceEventEmitter, ScrollView, Text, View } from 'react-native'
import { BrowsingHistory } from '~/utils/saveHistory'
import storage from '~/utils/storage'
import Header from '../components/Header'
import Item from './components/Item'
import Title from './components/Title'

export interface Props {

}

type FinalProps = Props & __Navigation.InjectedNavigation

function dateFormat(timestamp: number, prefix?: string) {
  let date = new Date(timestamp)
  const bu_ling = (val: number) => val < 10 ? '0' + val : val.toString()

  let dateArr = [date.getFullYear(), bu_ling(date.getMonth() + 1), bu_ling(date.getDate())]
  new Date().getFullYear() === date.getFullYear() && dateArr.shift()
  let timeArr = [bu_ling(date.getHours()), bu_ling(date.getMinutes())]
  if (prefix) {
    return `${prefix} ${timeArr.join(':')}`
  } else {
    return `${dateArr.join('/')} ${timeArr.join(':')}`
  }
}

export type BrowsingHistoryWithViewDate = BrowsingHistory & { date: string }
type HistoryRecordLists = {
  all: BrowsingHistoryWithViewDate[]
  today: BrowsingHistoryWithViewDate[]
  yesterday: BrowsingHistoryWithViewDate[]
  ago: BrowsingHistoryWithViewDate[]
}

function Finds(props: PropsWithChildren<FinalProps>) {
  const initLists = (): HistoryRecordLists => ({
    all: [],
    today: [],
    yesterday: [],
    ago: [],
  })

  const [lists, setLists] = useState(initLists())

  useEffect(() => {
    refresh()
    DeviceEventEmitter.addListener('refreshHistory', () => refresh())
    DeviceEventEmitter.addListener('clearHistory', () => setLists(initLists()))

    return () => {
      DeviceEventEmitter.removeListener('refreshHistory')
      DeviceEventEmitter.removeListener('clearHistory')
    }
  }, [])

  async function refresh () {
    let list = await storage.get('browsingHistory')
    if (!list) { return }

    let lists: HistoryRecordLists = {
      all: list as BrowsingHistoryWithViewDate[],
      today: [],
      yesterday: [],
      ago: []
    }

    let now = new Date()
    now.setDate(now.getDate() - 1)
    let yesterdayBeginTimestamp = now.setHours(0, 0, 0, 0)
    let yesterdayEndTimestamp = now.setHours(23, 59, 59, 999)

    list.forEach(item => {
      if (item.timestamp > yesterdayEndTimestamp) {
        (item as BrowsingHistoryWithViewDate).date = dateFormat(item.timestamp, '今天')
        lists.today.push(item as BrowsingHistoryWithViewDate)
      } else if (item.timestamp < yesterdayBeginTimestamp) {
        (item as BrowsingHistoryWithViewDate).date = dateFormat(item.timestamp)
        lists.ago.push(item as BrowsingHistoryWithViewDate)
      } else {
        (item as BrowsingHistoryWithViewDate).date = dateFormat(item.timestamp, '昨天')
        lists.yesterday.push(item as BrowsingHistoryWithViewDate)
      }
    })

    setLists(lists)
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Header title="浏览历史" />

      {!lists.all.length ? <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }}>
          <Text style={{ color: '#666', fontSize: 18 }}>暂无记录</Text>
        </View>
      </> : <>
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
      </>}
    </View>
  )
}

export default Finds