import React, { useState, MutableRefObject, PropsWithChildren } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, Animated, 
  StyleSheet, 
} from 'react-native'

export interface SnackBarRef {
  show (message: string): void
  hide (): void
}

export interface Props {
  getRef: MutableRefObject<any>
}

type FinalProps = Props

function SnackBar(props: PropsWithChildren<FinalProps>) {
  const [height, setHeight] = useState(45)
  const [transitionTop, setTransitionTop] = useState(new Animated.Value(-height))
  const [visible, setVisible] = useState(false)
  const [content, setContent] = useState('')
  const [queue, setQueue] = useState<string[]>([])

  if (props.getRef) props.getRef.current = { show, hide }

  function show(message: string) {
    if (visible) return setQueue(prevVal => prevVal.concat([message]))

    setContent(content)
    setVisible(true)

    Animated.timing(transitionTop, {
      toValue: 0,
      duration: 200
    }).start(() => {
      setTimeout(() => {
        // 等待hide结束，检查队列，若有等待的消息则500毫秒后显示
        hide().then(() => {
          if (queue.length) {
            let message = queue.pop()
            setQueue(queue)
            setTimeout(() => show(message!), 500)
          }
        })
      }, 3000)
    })
  }

  function hide() {
    return new Promise((resolve, reject) => {
      Animated.timing(transitionTop, {
        toValue: -height,
        duration: 200
      }).start(() => {
        setVisible(false)
        resolve()
      })
    })
  }

  function layoutChange(e: any) {
    setHeight(e.nativeEvent.layout.height)
  }

  return (
    visible ? <>
      <Animated.View style={{ ...styles.main, bottom: transitionTop }} onLayout={layoutChange}>
        <Text style={{ color: 'white', lineHeight: 20 }}>{content}</Text>
      </Animated.View>
    </> : null
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