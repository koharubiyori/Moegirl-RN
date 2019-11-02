import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Modal, Animated, TextInput, TouchableWithoutFeedback, TouchableOpacity,
  StyleSheet
} from 'react-native'
import { postComment } from '~/api/comment'
import toast from '~/utils/toast'

export default class CommentEditor extends React.Component{
  static propTypes = {
    targetId: PropTypes.string,
    pageId: PropTypes.number,
    onPosted: PropTypes.func,
  }

  constructor (props){
    super(props)
    this.state = {
      transitionOpacity: new Animated.Value(0),
      transitionTranslateY: new Animated.Value(120),
      visible: false,
      inputText: ''
    }
  }
  
  show = () =>{
    this.setState({ visible: true })
    setTimeout(() => this.refs.textInput.focus())
    Animated.timing(this.state.transitionOpacity, { toValue: 1, duration: 300, useNativeDriver: true }).start()
    Animated.timing(this.state.transitionTranslateY, { toValue: 0, duration: 300, useNativeDriver: true }).start()
  }

  hide = () =>{
    Animated.timing(this.state.transitionOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start()
    Animated.timing(this.state.transitionTranslateY, { toValue: 120, duration: 300, useNativeDriver: true })
      .start(() => this.setState({ visible: false }))
  }

  close = () =>{
    if(this.state.visible){
      if(this.state.inputText){
        $dialog.confirm.show({
          content: '关闭后当前编辑的评论内容将不会保存，是否关闭？',
          onTapCheck: () => this.hide()
        })
      }else{
        this.hide()
      }
    }else{
      this.props.navigation.goBack()
    }
  }

  submit = () =>{
    if(this.state.inputText === '0'){ return toast.show('因萌百评论系统的bug，不能以“0”作为评论内容') }

    toast.showLoading('提交中')
    postComment(this.props.pageId, this.state.inputText, this.props.targetId)
      .finally(toast.hide)
      .then(() =>{
        setTimeout(() => toast.showSuccess('发表成功'))
        this.setState({ inputText: '' })
        this.hide()
        this.props.onPosted()
      })
      .catch(e =>{
        console.log(e)
        toast.show('网络错误，请重试', 'center')
      })
  }
  
  // 使用组件id判断是否点击的是mask
  tapMaskToCloseSelf = e =>{
    this.refs.mask._component._nativeTag === e.target && this.close()
  }

  render (){
    return (
      <Modal transparent visible={this.state.visible} onRequestClose={this.close}>
        <TouchableWithoutFeedback onPress={this.tapMaskToCloseSelf}>
          <Animated.View style={{ ...styles.container, opacity: this.state.transitionOpacity }} ref="mask">
            <Animated.View style={{ ...styles.body, transform: [{ translateY: this.state.transitionTranslateY }] }}>
              <TextInput style={styles.input} multiline disableFullscreenUI autoCorrect={false}
                placeholder="说点什么吧..."
                textAlignVertical="top" 
                onChangeText={text => this.setState({ inputText: text })}
                ref="textInput"
              />
              
              <View style={{ marginTop: 10 }}>
                <TouchableOpacity onPress={this.submit} disabled={this.state.inputText.length === 0}>
                  <Text style={{ color: this.state.inputText.length === 0 ? '#ccc' : '#666', fontSize: 17, marginBottom: 10 }}>提交</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },

  body: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    paddingHorizontal: 10,
    paddingVertical: 15,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },

  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 7,
    borderRadius: 10,
    paddingHorizontal: 7
  }
})