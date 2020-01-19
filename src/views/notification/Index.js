import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text,
  StyleSheet
} from 'react-native'
import { getNotifications } from '~/api/notification'
import Toolbar from '~/components/Toolbar'

Notifications.propTypes = {
  
}

export default function Notifications(props){
  const [notificationList, setNotificationList] = useState({
    list: [],
    status: 1,
    continue: ''
  })

  useEffect(() =>{
    load()
  }, [])

  function load(){
    getNotifications()
      .then(data =>{
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