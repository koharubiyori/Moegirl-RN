import React, { PropsWithChildren, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { getNotifications } from '~/api/notification'
import Toolbar from '~/components/Toolbar'

export interface Props {

}

type FinalProps = Props & __Navigation.InjectedNavigation

export default function Notifications(props: PropsWithChildren<FinalProps>) {
  const [notificationList, setNotificationList] = useState({
    list: [],
    status: 1,
    continue: ''
  })

  useEffect(() => {
    load()
  }, [])

  function load() {
    getNotifications()
      .then(data => {
        console.log(data)
      })
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Toolbar
        title="通知"
        leftIcon="keyboard-backspace"
        onPressLeftIcon={() => props.navigation.goBack()}
      />   
    </View>
  )
}

const styles = StyleSheet.create({
  
})