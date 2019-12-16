import React, { useState, useRef, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, TouchableOpacity, Animated,
  StyleSheet
} from 'react-native'
import { withNavigation } from 'react-navigation'
import Icon from 'react-native-vector-icons/MaterialIcons'
import commentHOC from '~/redux/comment/HOC'

CommentButton.propTypes = {
  id: PropTypes.number,
  onTap: PropTypes.func,
  getRef: PropTypes.object
}

const size = 60

function CommentButton(props){
  const [visible, setVisible] = useState(false)
  const [transitionScale] = useState(new Animated.Value(1))
  const animateLock = useRef(false)

  if(props.getRef) props.getRef.current = { show, hide }

  useLayoutEffect(() =>{
    props.comment.setActiveId(props.id)
    props.comment.load()
    setTimeout(show, 2000)
  }, [])

  function show(){
    if(animateLock.current || visible){ return }

    animateLock.current = true
    setVisible(true)
    Animated.timing(transitionScale, {
      toValue: 1.1,
      duration: 100,
      useNativeDriver: true
    })
      .start(() =>{
        Animated.timing(transitionScale, {
          toValue: 1,
          duration: 50,
          useNativeDriver: true
        })
          .start(() => animateLock.current = false)
      })
  }

  function hide(){
    if(animateLock.current || !visible){ return }

    animateLock.current = true
    setTimeout(() => Animated.timing(transitionScale, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true
    }).start(() =>{
      setVisible(false)
      animateLock.current = false
    }), 500)
  }

  function tap(){
    let state = props.comment.getActiveData()
    if(state.status === 0) props.comment.load()
    props.onTap()
  }

  const state = props.comment.getActiveData()
  return (
    !visible ? null :
    <TouchableOpacity onPress={tap} style={{ ...styles.container,  transform: [{ scale: transitionScale }] }}>
      <Animated.View style={{ ...styles.main }}>
        <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
          <Icon name="comment" size={30} color="white" style={{ position: 'relative', top: -4 }} />
          <Text style={{ position: 'absolute', bottom: 6, color: 'white' }}>{{ 0: '×', 1: '...', 2: '...' }[state.status] || state.data.count}</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  )
}

export default withNavigation(commentHOC(CommentButton))

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
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