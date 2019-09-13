import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, TouchableWithoutFeedback,
  StyleSheet
} from 'react-native'
import Dialog from 'react-native-dialog'

export default class Alert extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      visible: false,
      title: '',
      content: '',
      checkText: '',
      closeText: '',
      onTapCheck: new Function,
      onTapClose: new Function
    }
  }
  
  show ({
    title = '提示',
    content = '',
    checkText = '确定',
    closeText = '取消',
    onTapCheck = this.hide,
    onTapClose = this.hide
  }){
    this.setState({ visible: true, title, content, checkText, onTapCheck, closeText, onTapClose })
  }

  hide = () =>{
    this.setState({ visible: false })
  }

  render (){
    const {visible, title, content, checkText, closeText, onTapCheck, onTapClose} = this.state

    return (
      <View>
        <Dialog.Container visible={visible}>
          <Dialog.Title>{title}</Dialog.Title>
          <Dialog.Description>{content}</Dialog.Description>
          <Dialog.Button label={checkText} onPress={onTapCheck} style={{ marginRight: 10 }} />
          <Dialog.Button label={closeText} onPress={onTapClose} />
        </Dialog.Container>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  
})