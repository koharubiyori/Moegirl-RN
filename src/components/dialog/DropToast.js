import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Animated, 
  StyleSheet, NativeModules
} from 'react-native'

export default class DropToast extends React.Component{
  static propTypes = {
    
  }

  constructor (props){
    super(props)
    this.state = {
      transitionTop: new Animated.Value(-56 - NativeModules.StatusBarManager.HEIGHT),
      content: '',
      status: 0,
      queue: []
    }
  }

  show = content =>{
    if(this.state.status === 1){
      return this.setState({ queue: this.state.queue.concat([content]) })
    }

    this.setState({ content, status: 1 })
    Animated.timing(this.state.transitionTop, {
      toValue: NativeModules.StatusBarManager.HEIGHT,
      duration: 200
    }).start(() =>{
      setTimeout(() =>{
        // 等待hide结束，检查队列，若有等待的消息则500毫秒后显示
        this.hide().then(() =>{
          if(this.state.queue.length){
            var content = this.state.queue.pop()
            this.setState({ queue: this.state.queue })
            setTimeout(() => this.show(content), 500)
          }
        })
      }, 3000)
    })
  }
  
  hide = () =>{
    return new Promise((resolve, reject) =>{
      Animated.timing(this.state.transitionTop, {
        toValue: -56 - NativeModules.StatusBarManager.HEIGHT,
        duration: 200
      }).start(() =>{
        this.setState({ status: 0 })
        resolve()
      })
    })
  }

  render (){
    return (
      <Animated.View style={{ ...styles.main, top: this.state.transitionTop }}>
        <Text style={{ color: 'white' }} numberOfLines={2}>{this.state.content}</Text>
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  main: {
    height: 56,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0
  }
})