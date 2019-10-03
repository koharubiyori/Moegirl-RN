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
      onTapClose: new Function,

      input: '',
      inputPlaceholder: '',
      hasInput: false,
    }
  }
  
  show ({
    title = '提示',
    content = '',
    checkText = '确定',
    closeText = '取消',
    onTapCheck = new Function,
    onTapClose = new Function,
    hasInput = false,
    inputPlaceholder,
  }){
    this.setState({ visible: true, title, content, checkText, 
      onTapCheck: () =>{ onTapCheck(this.state.hasInput ? this.state.input : undefined); this.hide() }, 
      closeText, 
      onTapClose: () =>{ onTapClose(); this.hide() },
      hasInput, inputPlaceholder
    })
  }

  hide = () =>{
    this.setState({ visible: false })
  }

  render (){
    const {visible, title, content, checkText, closeText, onTapCheck, onTapClose, hasInput, input, inputPlaceholder} = this.state

    return (
      <View>
        <Dialog.Container visible={visible}>
          <Dialog.Title>{title}</Dialog.Title>
          {content ? <Dialog.Description>{content}</Dialog.Description> : null}
          {hasInput ?
            <Dialog.Input autoFocus placeholder={inputPlaceholder} value={input} 
              onChangeText={val => this.setState({ input: val })}
              wrapperStyle={styles.input}
            />
          : null}
          <Dialog.Button label={closeText} onPress={onTapClose} style={{ marginRight: 10, color: $colors.main }} />
          <Dialog.Button label={checkText} onPress={onTapCheck} style={{ color: $colors.main }} />
        </Dialog.Container>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: $colors.main,
    borderRadius: 5,
    paddingVertical: 0,
    paddingLeft: 5
  }
})