import Orientation from '@koharubiyori/react-native-orientation'
import React, { MutableRefObject, PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Animated, BackHandler, DeviceEventEmitter, Dimensions, PanResponder, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import WebView from 'react-native-webview'
import bilibiliApi from '~/api/bilibili'
import useStateWithRef from '~/hooks/useStateWithRef'
import toast from '~/utils/toast'

export interface Props {
  getRef?: MutableRefObject<any>
}

export interface BiliPlayerController {
  visible: boolean
  smallMode: boolean
  start(videoId: string, page: number, isBvId?: boolean): void
  show(): void
  hide(orientation: 'left' | 'right'): void
  grow(): void
  shrink(): void
}

export let biliPlayerController: BiliPlayerController = null as any

const AnimatedWebView = Animated.createAnimatedComponent(WebView)

function BiliPlayerModal(props: PropsWithChildren<Props>) {
  const [html, setHtml] = useState('')
  const [collapseTransitionValue] = useStateWithRef(new Animated.Value(0))
  const collapseTransitionValueRef = useRef(0)
  const [horizontalSwipeTransitionValue] = useState(new Animated.Value(1)) // 为0.5时显示，为0时隐藏在左边，为1时隐藏在右边
  const horizontalSwipeTransitionValueRef = useRef(1)

  const [visible, setVisible] = useState(false)
  const [smallMode, setSmallMode, smallModeRef] = useStateWithRef(false)
  const animationLock = useRef(false)
  
  useEffect(() => {
    biliPlayerController = {
      visible,
      smallMode,
      start,
      show,
      hide,
      grow,
      shrink
    } 
  })

  useEffect(() => {
    let listener: any = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible && !smallModeRef.current) {
        shrink() 
        return true
      }
    })

    return () => listener.remove()
  }, [visible])

  // 创建收起动画事件组
  const lastMoveY = useRef(0)
  function createCollapseEvents() {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (animationLock.current) return false

        const { dy } = gestureState
        return dy > 50 || dy < -50
      },
      onPanResponderGrant: () => {
        animationLock.current = true
      },
      onPanResponderMove: (e, gestureState) => {
        let { moveY } = gestureState
        if (lastMoveY.current - moveY > 0.5 || lastMoveY.current - moveY < -0.5) {
          const speed = 0.05
  
          let value = speed
          if (lastMoveY.current > moveY) value = -speed
  
          collapseTransitionValueRef.current -= value
          
          if (collapseTransitionValueRef.current > 1) collapseTransitionValueRef.current = 1
          if (collapseTransitionValueRef.current < 0) collapseTransitionValueRef.current = 0
          
          collapseTransitionValue.setValue(collapseTransitionValueRef.current as any)
        }
        
        lastMoveY.current = moveY
      },

      onPanResponderRelease: () => {
        collapseTransitionValueRef.current > 0.5 ? grow() : shrink()
        animationLock.current = false
      }
    })
  }

  // 创建关闭动画事件组
  const lastMoveX = useRef(0)
  function createHorizontalSwipeEvents() {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (e, gestureState) => {
        if (animationLock.current || !smallMode) return false
        
        const { dx } = gestureState
        return dx > 30 || dx < -30
      },
      onPanResponderGrant: () => {
        animationLock.current = true
      },
      onPanResponderMove: (e, gestureState) => {
        let { moveX } = gestureState
        if (lastMoveX.current - moveX > 1 || lastMoveX.current - moveX < -1) {
          const speed = 0.04

          let value = speed
          if (lastMoveX.current > moveX) value = -speed

          horizontalSwipeTransitionValueRef.current += value
          
          if (horizontalSwipeTransitionValueRef.current > 0.8) horizontalSwipeTransitionValueRef.current = 0.8
          if (horizontalSwipeTransitionValueRef.current < 0.2) horizontalSwipeTransitionValueRef.current = 0.2
          
          horizontalSwipeTransitionValue.setValue(horizontalSwipeTransitionValueRef.current as any)
        }
        
        lastMoveX.current = moveX
      },

      onPanResponderRelease: () => {
        if (horizontalSwipeTransitionValueRef.current > 0.7) {
          hide('right')
        } else if (horizontalSwipeTransitionValueRef.current < 0.3) {
          hide('left')
        } else {
          show()
        }

        animationLock.current = false
      }
    })
  }

  function start(videoId: string, page = 1, isBvId = false) {
    bilibiliApi.getVideoInfo(videoId, isBvId)
      .then(data => {
        console.log(data)
        setHtml(createDocument(videoId, page, isBvId, data.pages[page - 1].cid))
        show().then(grow)
      })
      .catch(e => {
        toast('视频地址获取失败，请重试')
        console.log(e)
      })
  }

  // 全屏
  function grow() {    
    setSmallMode(false)
    collapseTransitionValueRef.current = 1
    Animated.timing(collapseTransitionValue, {
      toValue: 1,
      duration: 300,
    }).start()
  }

  //  小窗模式
  function shrink() {
    return new Promise(resolve => {
      setSmallMode(true)
      collapseTransitionValueRef.current = 0
      Animated.timing(collapseTransitionValue, {
        toValue: 0,
        duration: 300
      }).start(resolve)
    })
  }

  // 显示
  function show() {
    DeviceEventEmitter.emit('biliPlayerVisibleChange', true)
    return new Promise(resolve => {
      setVisible(true)
      horizontalSwipeTransitionValueRef.current = 0.5
      Animated.timing(horizontalSwipeTransitionValue, {
        toValue: 0.5,
        duration: 150,
      }).start(resolve)
    })
  }

  // 隐藏
  function hide(orientation: 'left' | 'right') {
    DeviceEventEmitter.emit('biliPlayerVisibleChange', false)
    horizontalSwipeTransitionValueRef.current = orientation === 'left' ? 0 : 1
    shrink().then(() => {
      Animated.timing(horizontalSwipeTransitionValue, {
        toValue: orientation === 'left' ? 0 : 1,
        duration: 150,
      }).start(() => setVisible(false))
    })
  }

  function createDocument (videoId: string, page: number, isBvId: boolean, cid: string) {
    // 要传入的html代码
    let injectJsCodes = `
      window.addEventListener('fullscreenchange', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'onFullScreenChange', data: { isFullScreen: !!document.fullscreenElement } }))
      })
    `

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>bilibili播放器</title>
        <style>
          html{
            height: 100%;
          }

          body{
            height: 100%;
            background: black;
            display: flex;
            align-items: center;
            margin: 0;
          }

          .bilibili-player {
            width:100%; 
            height:300px;
            background-color:#ccc; 
          }

          @media all and (orientation: landscape){
            .bilibili-player {
              height: 100vh;
            }
          }
        </style>
      </head>
      <body>
        <iframe src="https://www.bilibili.com/blackboard/html5mobileplayer.html?${isBvId ? 'bvid' : 'aid'}=${videoId}&page=${page}&cid=${cid}" scrolling="no" framespacing="0" border="0" frameborder="no"  allowfullscreen="true" class="bilibili-player"></iframe>
        <script>
          ${injectJsCodes};
        </script>
      </body>
      </html>      
    `
  }

  function receiveMessage(event: any) {
    const { type, data } = JSON.parse(event.nativeEvent.data)

    if (type === 'print') {
      console.log('=== print ===', data)
    }

    if (type === 'error') {
      console.log('--- WebViewError ---', data)
    }

    if (type === 'onFullScreenChange') {
      data.isFullScreen ? Orientation.lockToLandscape() : Orientation.lockToPortrait()
      StatusBar.setHidden(data.isFullScreen)
    }
  }

  const minWidth = Dimensions.get('window').width / 2
  const minHeight = minWidth * 0.65
  const positionOffset = 15
  const windowSize = Dimensions.get('window')

  const containerWidth = collapseTransitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [minWidth, windowSize.width]
  })

  const containerHeight = collapseTransitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [minHeight, windowSize.height]
  })

  const containerTranslate = collapseTransitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-positionOffset, 0]
  })

  const container2TranslateX = horizontalSwipeTransitionValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-minWidth / 2, minWidth / 2]
  })

  // 给view添加opacity无法影响到内部的webview，必须给webview设置opacity
  const webViewOpacity = horizontalSwipeTransitionValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0]
  })

  if (!visible) return null
  return (
    // 这个view负责处理收起展开手势
    <Animated.View
      {...createCollapseEvents().panHandlers}
      style={{
        ...styles.container,
        width: containerWidth,
        height: containerHeight,
        transform: [
          { translateX: containerTranslate },
          { translateY: containerTranslate }
        ]
      }}
    >
      {/* 这个view负责处理开启关闭手势 */}
      <Animated.View
        {...createHorizontalSwipeEvents().panHandlers}
        style={{
          ...styles.webViewWrapper,
          transform: [{ translateX: container2TranslateX }],
        }}
      >
        <TouchableOpacity 
          style={styles.webViewWrapper}
          onPress={() => smallMode && grow()}
        >
          {/* 使用一个view盖住webview，防止在小窗状态下点击到webview中的内容 */}
          {smallMode &&
            <View style={{
              width: minWidth,
              height: minHeight,
              right: positionOffset,
              bottom: positionOffset,
              position: 'absolute',
              zIndex: 10
            }} />
          }
          <AnimatedWebView allowsFullscreenVideo
            style={{ opacity: webViewOpacity, backgroundColor: '#ccc' }}
            scalesPageToFit={false}
            source={{ html: html }}
            onMessage={receiveMessage}
          />
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
}

export default BiliPlayerModal

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },

  webViewWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})