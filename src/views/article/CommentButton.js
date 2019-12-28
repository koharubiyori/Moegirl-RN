import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet
} from 'react-native'
import { withNavigation } from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import commentHOC from '~/redux/comment/HOC'

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

CommentButton.propTypes = {
  id: PropTypes.number,
  onTap: PropTypes.func,
  getRef: PropTypes.object
}

const size = 60

function CommentButton(props){
  const [visible, setVisible] = useState(false)
  const [transitionBottom] = useState(new Animated.Value(-size))
  const showLock = useRef(true)     // 为了保证动画(条目加载成功两秒后显示)，声明一个变量用于判断前两秒不响应show方法
  const animateLock = useRef(false)

  if(props.getRef) props.getRef.current = { show, hide }

  useLayoutEffect(() =>{
    props.comment.setActiveId(props.id)
    props.comment.load()
    setTimeout(() =>{
      showLock.current = false
      show()
    }, 1000)
  }, [])

  function show(){
    if(animateLock.current || visible || showLock.current){ return }

    animateLock.current = true
    setVisible(true)
    Animated.timing(transitionBottom, {
      toValue: 30,
      duration: 150,
    })
      .start(() => animateLock.current = false)
  }

  function hide(){
    if(animateLock.current || !visible){ return }

    animateLock.current = true
    Animated.timing(transitionBottom, {
      toValue: -size,
      duration: 150,
    }).start(() =>{
      setVisible(false)
      animateLock.current = false
    })
  }

  function tap(){
    let state = props.comment.getActiveData()
    if(state.status === 0) props.comment.load()
    props.onTap()
  }

  const state = props.comment.getActiveData()
  return (
    !visible ? null :
    <AnimatedTouchableOpacity onPress={tap} style={{ ...styles.container, bottom: transitionBottom }}>
      <View style={{ ...styles.main }}>
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <Icon name="comment" size={30} color="white" style={{ position: 'relative', top: -4 }} />
          <Text style={{ position: 'absolute', bottom: 6, color: 'white' }}>{{ 0: '×', 1: '...', 2: '...' }[state.status] || state.data.count}</Text>
        </View>
      </View>
    </AnimatedTouchableOpacity>
  )
}

export default withNavigation(commentHOC(CommentButton))

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30
  },

  main: {
    backgroundColor: $colors.main,
    elevation: 10,
    width: size,
    height: size,
    borderRadius: size / 2
  }
})