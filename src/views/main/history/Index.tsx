import React, { PropsWithChildren, useEffect, useState } from 'react'
import { DeviceEventEmitter, ScrollView, Text, View, ActivityIndicator } from 'react-native'
import { BrowsingHistory } from '~/utils/saveHistory'
import storage from '~/utils/storage'
import Header from '../components/Header'
import Item from './components/Item'
import Title from './components/Title'
import { useTheme } from 'react-native-paper'
import ViewContainer from '~/components/ViewContainer'

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
  const theme = useTheme()
  const initLists = (): HistoryRecordLists => ({
    all: [],
    today: [],
    yesterday: [],
    ago: [],
  })

  const [lists, setLists] = useState(initLists())
  const [status, setStatus] = useState<0 | 1 | 2 | 3>(1)

  useEffect(() => {
    refresh()
    DeviceEventEmitter.addListener('refreshHistory', () => refresh())
    DeviceEventEmitter.addListener('clearHistory', () => {
      setStatus(0)
      setLists(initLists())
    })

    return () => {
      DeviceEventEmitter.removeListener('refreshHistory')
      DeviceEventEmitter.removeListener('clearHistory')
    }
  }, [])

  function refresh () {
    setStatus(2)
    let list = storage.get('browsingHistory')
    console.log(list)
    if (!list) return setStatus(0)

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
    setStatus(3)
  }

  return (
    <ViewContainer>
      <Header title="浏览历史" />
      {{
        0: () => 
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.colors.placeholder, fontSize: 18 }}>暂无记录</Text>
          </View>,
        1: () => null,
        2: () => 
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator color={theme.colors.primary} size={50} />
          </View>,
        3: () =>
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
      }[status]()}
    </ViewContainer>
  )
}

export default Finds