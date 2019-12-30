import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Animated, 
  StyleSheet, 
} from 'react-native'

SnackBar.propTypes = {
  getRef: PropTypes.object
}

function SnackBar(props){
  const [height, setHeight] = useState(45)
  const [transitionTop, setTransitionTop] = useState(new Animated.Value(-height))
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState('')
  const [queue, setQueue] = useState([])

  if(props.getRef) props.getRef.current = { show, hide }

  function show(content){
    if(visible) return setQueue(prevVal => prevVal.concat([content]))

    setContent(content)
    setVisible(true)

    Animated.timing(transitionTop, {
      toValue: 0,
      duration: 200
    }).start(() =>{
      setTimeout(() =>{
        // 等待hide结束，检查队列，若有等待的消息则500毫秒后显示
        hide().then(() =>{
          if(queue.length){
            let content = queue.pop()
            setQueue(queue)
            setTimeout(() => show(content), 500)
          }
        })
      }, 3000)
    })
  }

  function hide(){
    return new Promise((resolve, reject) =>{
      Animated.timing(transitionTop, {
        toValue: -height,
        duration: 200
      }).start(() =>{
        setVisible(false)
        resolve()
      })
    })
  }

  function layoutChange(e){
    setHeight(e.nativeEvent.layout.height)
  }

  return (
    !visible ? null :
    <Animated.View style={{ ...styles.main, bottom: transitionTop }} onLayout={layoutChange}>
      <Text style={{ color: 'white', lineHeight: 20 }}>{content}</Text>
    </Animated.View>
  )
}

export default SnackBar

const styles = StyleSheet.create({
  main: {
    minHeight: 45,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0
  }
})