import React, { PropsWithChildren, useEffect, useState, useCallback } from 'react'
import { DeviceEventEmitter, ScrollView, Text, View, ActivityIndicator } from 'react-native'
import { BrowsingHistory } from '~/utils/saveHistory'
import storage from '~/utils/storage'
import Item from './components/Item'
import Title from './components/Title'
import { useTheme } from 'react-native-paper'
import ViewContainer from '~/components/ViewContainer'
import MyToolbar from '~/components/MyToolbar'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import dialog from '~/utils/dialog'
import toast from '~/utils/toast'
import { useFocusEffect } from '@react-navigation/native'
import useLayoutAnimation from '~/hooks/useLayoutAnimation'

export interface Props {

}

export interface RouteParams {

}

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

export type BrowsingHistoryWithDiffDate = BrowsingHistory & { date: string }
type HistoryRecordLists = {
  all: BrowsingHistoryWithDiffDate[]
  today: BrowsingHistoryWithDiffDate[]
  yesterday: BrowsingHistoryWithDiffDate[]
  ago: BrowsingHistoryWithDiffDate[]
}

function HistoryPage(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const initLists = (): HistoryRecordLists => ({
    all: [],
    today: [],
    yesterday: [],
    ago: [],
  })

  const [lists, setLists] = useState(initLists())
  const [status, setStatus] = useState<0 | 1 | 2 | 3>(1)

  useLayoutAnimation()
  useFocusEffect(useCallback(refresh, []))

  function refresh () {
    setStatus(2)
    let list = storage.get('browsingHistory')
    if (!list) return setStatus(0)

    let lists: HistoryRecordLists = {
      all: list as BrowsingHistoryWithDiffDate[],
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
        ;(item as BrowsingHistoryWithDiffDate).date = dateFormat(item.timestamp, '今天')
        lists.today.push(item as BrowsingHistoryWithDiffDate)
      } else if (item.timestamp < yesterdayBeginTimestamp) {
        ;(item as BrowsingHistoryWithDiffDate).date = dateFormat(item.timestamp)
        lists.ago.push(item as BrowsingHistoryWithDiffDate)
      } else {
        ;(item as BrowsingHistoryWithDiffDate).date = dateFormat(item.timestamp, '昨天')
        lists.yesterday.push(item as BrowsingHistoryWithDiffDate)
      }
    })

    console.log(lists)
    setLists(lists)
    setStatus(3)
  }

  async function clearHistory () {
    await dialog.confirm.show({ content: '确定要清空浏览历史吗？' })
    storage.remove('browsingHistory')
    toast('已清除所有浏览历史')
    setLists(initLists())
    setStatus(0)
  }

  return (
    <ViewContainer>
      <MyToolbar 
        title="浏览历史"
        leftIcon="keyboard-backspace"
        rightIcon={lists.all.length === 0 ? undefined : 'delete'}
        onPressLeftIcon={navigation.goBack}
        onPressRightIcon={clearHistory}
      />
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
              <Item data={item} key={item.title} onPress={pageName => navigation.push('article', { pageName })} />  
            )}

            {lists.yesterday.length ? <Title text="昨天" style={{ marginTop: 10 }} /> : null }
            {lists.yesterday.map(item =>
              <Item data={item} key={item.title} onPress={pageName => navigation.push('article', { pageName })} />  
            )}

            {lists.ago.length ? <Title text="更早" style={{ marginTop: 10 }} /> : null }
            {lists.ago.map(item =>
              <Item data={item} key={item.title} onPress={pageName => navigation.push('article', { pageName })} />  
            )}

            <View style={{ height: 10 }} />
          </ScrollView>
      }[status]()}
    </ViewContainer>
  )
}

export default HistoryPage