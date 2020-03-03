import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View, LayoutAnimation, RefreshControl } from 'react-native'
import notificationApi from '~/api/notification'
import { NotificationData } from '~/api/notification.d'
import Toolbar from '~/components/Toolbar'
import Item from './components/Item'
import { markReadAllNotifications } from '~/redux/user/HOC'
import StatusBar from '~/components/StatusBar'
import { useTheme, Text } from 'react-native-paper'
import ViewContainer from '~/components/ViewContainer'
import useLayoutAnimation from '~/hooks/useLayoutAnimation'

export interface Props {

}

export interface RouteParams {

}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams>

type NotificationList = {
  list: NotificationData[]
  status: 0 | 1 | 2 | 3 | 4 | 5
  continue: string | null
}

export default function Notifications(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const [notificationList, setNotificationList] = useState<NotificationList>({
    list: [],
    status: 1,
    continue: null
  })

  useEffect(() => {
    load(true)
    markReadAllNotifications()
  }, [])

  useLayoutAnimation(
    LayoutAnimation.create(200, LayoutAnimation.Types.easeIn, LayoutAnimation.Properties.opacity)
  )

  function load(force = false) {
    if ([2, 4, 5].includes(notificationList.status) && !force) return Promise.resolve()
    setNotificationList(prevVal => force ? { list: [], status: 2, continue: null } : { ...prevVal, status: 2 })
    
    return notificationApi.get(force ? null : notificationList.continue)
      .then(data => {
        setNotificationList(prevVal => ({
          list: prevVal.list.concat(data.query.notifications.list.reverse()),
          status: 3,
          continue: data.query.notifications.continue
        }))

        if (data.query.notifications.continue === null && data.query.notifications.list.length !== 0) {
          setNotificationList(prevVal => ({ ...prevVal, status: 4 }))
        }
        if (data.query.notifications.list.length === 0) {
          setNotificationList(prevVal => ({ ...prevVal, status: 5 }))
        }
      })
  }
  
  return (
    <ViewContainer grayBgColor>
      <StatusBar />  
      <Toolbar
        title="通知"
        leftIcon="keyboard-backspace"
        onPressLeftIcon={() => props.navigation.goBack()}
      />   
      
      <FlatList data={notificationList.list} 
        onEndReachedThreshold={1}
        onEndReached={() => load()}
        style={{ flex: 1 }}
        renderItem={item => <Item 
          key={item.index}
          notificationData={item.item}
          onPress={() => item.item.title && props.navigation.push('article', { link: item.item.title.full })}
          onPressAvatar={username => props.navigation.push('article', { link: 'User:' + username })}
        />}

        refreshControl={<RefreshControl 
          colors={[theme.colors.accent]} 
          onRefresh={() => load(true)} 
          refreshing={false} 
        />}

        ListFooterComponent={{
          0: () => 
            <TouchableOpacity onPress={() => load()}>
              <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
                <Text>加载失败，点击重试</Text>
              </View>
            </TouchableOpacity>,
          1: () => null,
          2: () => <ActivityIndicator color={theme.colors.accent} size={50} style={{ marginVertical: 10 }} />,
          3: () => null,
          4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: theme.colors.disabled }}>已经没有啦</Text>,
          5: () => null
        }[notificationList.status]()}
      />
    </ViewContainer>
  )
}

const styles = StyleSheet.create({
  
})