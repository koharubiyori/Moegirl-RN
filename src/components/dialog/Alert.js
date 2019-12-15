import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
  StyleSheet
} from 'react-native'
import Dialog from 'react-native-dialog'

Alert.propTypes = {
  getRef: PropTypes.object
}

function Alert(props){
  const [visible, setVisible] = useState(false)
  const [params, setParams] = useState({
    title: '',
    content: '',
    checkText: '',
    onTapCheck: new Function
  })

  if(props.getRef) props.getRef.current = { show, hide }

  function show({
    title = '提示',
    content = '',
    checkText = '确定',
    onTapCheck = new Function
  }){
    setVisible(true)
    setParams({ title, content, checkText, onTapCheck: () =>{ onTapCheck(); hide() }})
  }

  function hide(){
    setVisible(false)
  }

  return (
    <Dialog.Container visible={visible}
     onBackButtonPress={hide}
     onBackdropPress={hide}
    >
      <Dialog.Title>{params.title}</Dialog.Title>
      <Dialog.Description>{params.content}</Dialog.Description>
      <Dialog.Button label={params.checkText} onPress={params.onTapCheck} style={{ color: $colors.main }} />
    </Dialog.Container>
  )
}

export default Alert