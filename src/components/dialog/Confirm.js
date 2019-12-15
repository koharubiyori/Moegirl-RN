import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import Dialog from 'react-native-dialog'

Confirm.propTypes = {
  getRef: PropTypes.object
}

function Confirm(props){
  const [visible, setVisible] = useState(false)
  const [params, setParams] = useState({
    visible: false,
    title: '',
    content: '',
    checkText: '',
    closeText: '',
    onTapCheck: new Function,
    onTapClose: new Function,
    inputPlaceholder: '',
    hasInput: false,
  })
  const [inputVal, setInputVal] = useState('')

  if(props.getRef) props.getRef.current = { show, hide }

  function show ({
    title = '提示',
    content = '',
    checkText = '确定',
    closeText = '取消',
    onTapCheck = new Function,
    onTapClose = new Function,
    hasInput = false,
    inputPlaceholder,
  }){
    setVisible(true)
    setParams({ 
      title, 
      content, 
      checkText, 
      onTapCheck: inputVal =>{ onTapCheck(inputVal); hide() }, 
      closeText, 
      onTapClose: () =>{ onTapClose(); hide() },
      hasInput, 
      inputPlaceholder
    })
  }

  function hide(){
    setVisible(false)
  }

  const {title, content, checkText, closeText, onTapCheck, onTapClose, hasInput, inputPlaceholder} = params
  return (
    <Dialog.Container visible={visible} 
      onBackButtonPress={hide}
      onBackdropPress={hide}
    >
      <Dialog.Title>{title}</Dialog.Title>
      {content ? <Dialog.Description>{content}</Dialog.Description> : null}
      {hasInput ?
        <Dialog.Input autoFocus placeholder={inputPlaceholder} value={inputVal} 
          onChangeText={setInputVal}
          wrapperStyle={styles.input}
        />
      : null}
      <Dialog.Button label={closeText} onPress={onTapClose} style={{ marginRight: 10, color: '#ABABAB' }} />
      <Dialog.Button label={checkText} onPress={() => onTapCheck(inputVal)} style={{ color: $colors.main }} />
    </Dialog.Container>
  )
}

export default Confirm

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: $colors.main,
    borderRadius: 5,
    paddingVertical: 0,
    paddingLeft: 5
  }
})