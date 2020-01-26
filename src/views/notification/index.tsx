import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View, LayoutAnimation, RefreshControl } from 'react-native'
import notificationApi from '~/api/notification'
import { NotificationData } from '~/api/notification.d'
import Toolbar from '~/components/Toolbar'
import Item from './components/Item'

export interface Props {

}

export interface RouteParams {

}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams>

type NotificationList = {
  list: NotificationData[]
  status: number
  continue: string
}

export default function Notifications(props: PropsWithChildren<FinalProps>) {
  // 未读通知超过50条也只能显示50条，太懒不想处理这部分了_(:з」∠)_
  const [uncheckedNotificationList, setUncheckedNotificationList] = useState<NotificationData[]>([])
  const [notificationList, setNotificationList] = useState<NotificationList>({
    list: [],
    status: 1,
    continue: ''
  })

  useEffect(() => {
    reloadAll(true)
    notificationApi.checkAll()
  }, [])

  useEffect(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, LayoutAnimation.Types.easeIn, LayoutAnimation.Properties.opacity)
    )
  })

  function loadUnChecked(force = false) {
    force && setUncheckedNotificationList([])
    return notificationApi.get(false)
      .then(data => {
        setUncheckedNotificationList(data.query.notifications.list.reverse())
      })
  }

  function loadChecked(force = false) {
    if ([2, 4, 5].includes(notificationList.status) && !force) return Promise.resolve()
    setNotificationList(prevVal => force ? { list: [], status: 2, continue: '' } : { ...prevVal, status: 2 })
    
    return notificationApi.get(true, force ? '' : notificationList.continue)
      .then(data => {
        console.log(data)
        setNotificationList(prevVal => ({
          list: prevVal.list.concat(data.query.notifications.list.reverse()),
          status: 3,
          continue: data.query.notifications.continue
        }))

        if (data.query.notifications.continue === '' && data.query.notifications.list.length !== 0) {
          setNotificationList(prevVal => ({ ...prevVal, status: 4 }))
        }
        if (data.query.notifications.list.length === 0) {
          setNotificationList(prevVal => ({ ...prevVal, status: 5 }))
        }
      })
  }

  function reloadAll(force = false) {
    return Promise.all([loadChecked(force), loadUnChecked(force)])
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: '#eee' }}>
      <Toolbar
        title="通知"
        leftIcon="keyboard-backspace"
        onPressLeftIcon={() => props.navigation.goBack()}
      />   
      
      <FlatList data={uncheckedNotificationList.concat(notificationList.list)} 
        onEndReachedThreshold={1}
        onEndReached={() => loadChecked()}
        style={{ flex: 1 }}
        renderItem={item => <Item 
          key={item.index}
          notificationData={item.item}
          onPress={() => props.navigation.push('article', { link: item.item.title.full })}
        />}

        refreshControl={<RefreshControl 
          colors={[$colors.main]} 
          onRefresh={() => reloadAll(true)} 
          refreshing={false} 
        />}

        ListFooterComponent={(({
          0: () => 
            <TouchableOpacity onPress={() => loadChecked()}>
              <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
                <Text>加载失败，点击重试</Text>
              </View>
            </TouchableOpacity>,
          2: () => <ActivityIndicator color={$colors.main} size={50} style={{ marginVertical: 10 }} />,
          4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: '#666' }}>已经没有啦</Text>,
        } as { [status: number]: () => JSX.Element | null })[notificationList.status] || (() => {}))()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  
})