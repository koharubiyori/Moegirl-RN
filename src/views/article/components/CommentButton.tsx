import { useObserver } from 'mobx-react-lite'
import React, { MutableRefObject, PropsWithChildren, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Animated, DeviceEventEmitter, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import store from '~/mobx'
import toast from '~/utils/toast'
import { biliPlayerController } from '~/views/biliPlayer'
import i from '../lang'

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)
const size = 60

export interface Props {
  pageId: number
  pageName: string
  backgroundColor?: string
  textColor?: string
  getRef: MutableRefObject<any>
}

export interface ArticleCommentButtonRef {
  show (): void
  hide (): void
}

function CommentButton(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const [visible, setVisible] = useState(false)
  const [bottomTransition] = useState(new Animated.Value(0))
  const [isBiliPlayerVisible, setIsBiliPlayerVisible] = useState(biliPlayerController.visible)
  const showLock = useRef(true) // 为了保证延迟显示，声明一个变量用于判断前n秒不响应show方法
  const animateLock = useRef(false)

  if (props.getRef) props.getRef.current = { show, hide }

  useLayoutEffect(() => {
    store.comment.loadNext(props.pageId)
    setTimeout(() => {
      showLock.current = false
      show()
    }, 100)
  }, [])

  // 监听b站播放器的显示，如果显示按钮的位置就需要往上提
  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('biliPlayerVisibleChange', setIsBiliPlayerVisible)
    return () => listener.remove()
  }, [])

  function show() {
    if (animateLock.current || visible || showLock.current) { return }

    animateLock.current = true
    setVisible(true)
    Animated.timing(bottomTransition, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true
    })
      .start(() => animateLock.current = false)
  }

  function hide() {
    if (animateLock.current || !visible) { return }

    animateLock.current = true
    Animated.timing(bottomTransition, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true
    }).start(() => {
      setVisible(false)
      animateLock.current = false
    })
  }

  function tap() {
    const loadingStatus = store.comment.data[props.pageId].status
    if (loadingStatus === 0) return store.comment.loadNext(props.pageId)
    if (loadingStatus === 2 || loadingStatus === 2.1) return toast(i.commentButton.loadingMsg)
    navigation.push('comment', { 
      pageName: props.pageName,
      pageId: props.pageId 
    })
  }

  const bottomTranslateY = bottomTransition.interpolate({
    inputRange: [0, 1],
    outputRange: [size + 30, 0]
  })
  
  // 这个的计算需要参考biliPlayer/index.tsx中的算法
  const biliPlayerHeightWithOffset = Dimensions.get('window').width / 2 * 0.65 + 15
  return useObserver(() => {
    const buttonText = (() => {
      const currentPageCommentData = store.comment.data[props.pageId] || {}
      // 如果状态不在0、1、2，则使用count，也就是显示评论总数
      const buttonText = ({   
        0: '×', 
        1: '...', 
        2: '...',
        2.1: '...'
      } as { [status: number]: string })[currentPageCommentData.status || 1] || currentPageCommentData.count

      return buttonText
    })()
  
    return visible ?
      <AnimatedTouchableOpacity onPress={tap} style={{ 
        ...styles.container, 
        bottom: isBiliPlayerVisible ? (biliPlayerHeightWithOffset + 10) : 30,
        transform: [{ translateY: bottomTranslateY }] 
      }}>
        <View style={{ ...styles.main, backgroundColor: props.backgroundColor || theme.colors.primary }}>
          <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="comment" size={30} color={props.textColor || 'white'} style={{ position: 'relative', top: -4 }} />
            <Text style={{ position: 'absolute', bottom: 6, color: props.textColor || 'white' }}>{buttonText}</Text>
          </View>
        </View>
      </AnimatedTouchableOpacity>
    : null
  })
}

export default CommentButton

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 30
  },

  main: {
    elevation: 10,
    width: size,
    height: size,
    borderRadius: size / 2
  }
})