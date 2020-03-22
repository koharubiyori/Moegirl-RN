import React, { FC, MutableRefObject, PropsWithChildren, useLayoutEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { withNavigation } from 'react-navigation'
import { CommentConnectedProps, commentHOC } from '~/redux/comment/HOC'

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
const size = 60

export interface Props {
  id: number
  backgroundColor?: string
  textColor?: string
  onPress (): void
  getRef: MutableRefObject<any>
}

export interface CommentButtonRef {
  show (): void
  hide (): void
}

type FinalProps = Props & CommentConnectedProps

function CommentButton(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const [visible, setVisible] = useState(false)
  const [transitionBottom] = useState(new Animated.Value(-size))
  const showLock = useRef(true) // 为了保证延迟显示，声明一个变量用于判断前n秒不响应show方法
  const animateLock = useRef(false)

  if (props.getRef) props.getRef.current = { show, hide }

  useLayoutEffect(() => {
    props.$comment.initPageData(props.id)
    props.$comment.load(props.id)
    setTimeout(() => {
      showLock.current = false
      show()
    }, 100)
  }, [])

  function show() {
    if (animateLock.current || visible || showLock.current) { return }

    animateLock.current = true
    setVisible(true)
    Animated.timing(transitionBottom, {
      toValue: 30,
      duration: 150,
    })
      .start(() => animateLock.current = false)
  }

  function hide() {
    if (animateLock.current || !visible) { return }

    animateLock.current = true
    Animated.timing(transitionBottom, {
      toValue: -size,
      duration: 150,
    }).start(() => {
      setVisible(false)
      animateLock.current = false
    })
  }

  function tap() {
    let state = props.$comment.getCommentDataByPageId(props.id)
    if (state.status === 0) props.$comment.load(props.id)
    props.onPress()
  }

  const state = props.$comment.getCommentDataByPageId(props.id)
  console.log(state)
  return (
    visible ? <>
      <AnimatedTouchableOpacity onPress={tap} style={{ ...styles.container, bottom: transitionBottom }}>
        <View style={{ ...styles.main, backgroundColor: props.backgroundColor || theme.colors.primary }}>
          <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="comment" size={30} color={props.textColor || 'white'} style={{ position: 'relative', top: -4 }} />
            <Text style={{ position: 'absolute', bottom: 6, color: props.textColor || 'white' }}>
              {({ 0: '×', 1: '...', 2: '...' } as { [status: number]: string })[state ? state.status : 1] || state.data.count}
            </Text>
          </View>
        </View>
      </AnimatedTouchableOpacity>
    </> : null
  )
}

export default withNavigation(commentHOC(CommentButton)) as FC<Props>

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30
  },

  main: {
    elevation: 10,
    width: size,
    height: size,
    borderRadius: size / 2
  }
})