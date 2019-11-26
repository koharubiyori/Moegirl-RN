import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text,
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
      onTapCheck: new Function
    }
  }
  
  show ({
    title = '提示',
    content = '',
    checkText = '确定',
    onTapCheck = new Function
  }){
    this.setState({ visible: true, title, content, checkText, onTapCheck: () =>{ onTapCheck(); this.hide() } })
  }

  hide = () =>{
    this.setState({ visible: false })
  }

  render (){
    const {visible, title, content, checkText, onTapCheck} = this.state

    return (
      <Dialog.Container visible={visible}
       onBackButtonPress={() => this.setState({ visible: false })}
       onBackdropPress={() => this.setState({ visible: false })}
      >
        <Dialog.Title>{title}</Dialog.Title>
        <Dialog.Description>{content}</Dialog.Description>
        <Dialog.Button label={checkText} onPress={onTapCheck} style={{ color: $colors.main }} />
      </Dialog.Container>
    )
  }
}

const styles = StyleSheet.create({
  
})