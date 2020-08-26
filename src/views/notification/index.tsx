import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, StyleSheet, TouchableOpacity, View, LayoutAnimation, RefreshControl } from 'react-native'
import notificationApi from '~/api/notification'
import { NotificationData } from '~/api/notification/types'
import { useTheme, Text } from 'react-native-paper'
import ViewContainer from '~/components/ViewContainer'
import useLayoutAnimation from '~/hooks/useLayoutAnimation'
import MyStatusBar from '~/components/MyStatusBar'
import MyToolbar from '~/components/MyToolbar'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import NotificationItem from './components/Item'
import { useObserver } from 'mobx-react-lite'
import store from '~/mobx'
import toast from '~/utils/toast'
import dialog from '~/utils/dialog'
import i from './lang'

export interface Props {

}

export interface RouteParams {

}

type NotificationList = {
  list: NotificationData[]
  status: 0 | 1 | 2 | 2.1 | 3 | 4 | 5
  continue: string | null
}

function NotificationPage(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const [notificationList, setNotificationList] = useState<NotificationList>({
    list: [],
    status: 1,
    continue: null
  })

  useEffect(() => {
    load(true)
  }, [])

  useLayoutAnimation()

  function load(force = false) {
    if ([2, 2.1, 4, 5].includes(notificationList.status) && !force) return Promise.resolve()
    setNotificationList(prevVal => force ? { list: [], status: 2.1, continue: null } : { ...prevVal, status: 2 })
    
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

  function markReadAllNotifications() {
    dialog.loading.show()
    store.user.markReadAllNotifications()
      .finally(dialog.loading.hide)
      .then(() => {
        setNotificationList(prevVal => ({
          ...prevVal,
          list: prevVal.list.map(item => ({ ...item, read: '1' }))
        }))
        setTimeout(() => toast(i.index.markReadAllNotifications.success), 50)
      })
      .catch(() => toast(i.index.markReadAllNotifications.netErr))
  }
  
  return useObserver(() => 
    <ViewContainer grayBgColor>
      <MyStatusBar />  
      <MyToolbar
        title={i.index.title}
        leftIcon="keyboard-backspace"
        rightIcon="done-all"
        onPressLeftIcon={() => navigation.goBack()}
        onPressRightIcon={() => markReadAllNotifications()}
      />   
      
      <FlatList 
        data={notificationList.list} 
        onEndReachedThreshold={1}
        onEndReached={() => load()}
        style={{ flex: 1 }}
        renderItem={item => 
          <NotificationItem 
            key={item.index}
            notificationData={item.item}
            onPress={() => item.item.title && navigation.push('article', { pageName: item.item.title.full })}
            onPressAvatar={username => navigation.push('article', { pageName: 'User:' + username })}
          />
        }

        refreshControl={
          <RefreshControl 
            colors={[theme.colors.accent]} 
            onRefresh={() => load(true)} 
            refreshing={notificationList.status === 2.1} 
          />
        }

        ListFooterComponent={{
          0: () => 
            <TouchableOpacity onPress={() => load()}>
              <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{i.index.netErr}</Text>
              </View>
            </TouchableOpacity>,
          1: () => null,
          2: () => <ActivityIndicator color={theme.colors.accent} size={50} style={{ marginVertical: 10 }} />,
          2.1: () => null,
          3: () => null,
          4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: theme.colors.disabled }}>{i.index.allLoaded}</Text>,
          5: () => null
        }[notificationList.status]()}
      />
    </ViewContainer>
  )
}

export default NotificationPage

const styles = StyleSheet.create({
  
})