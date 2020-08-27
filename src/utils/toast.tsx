import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import RootSiblings from 'react-native-root-siblings'

export interface Props {
  text: string
  position: 'top' | 'center' | 'bottom'
  duration: number
  onHide(): void
}

function MyToast(props: Props) {
  const transitionValue = {
    transformY: useRef(new Animated.Value(20)).current,
    scaleX: useRef(new Animated.Value(0.3)).current,
    opacity: useRef(new Animated.Value(0)).current
  }

  useEffect(() => {
    ;(async () => {
      await show()
      await new Promise(resolve => setTimeout(() => hide().then(resolve), props.duration))
      props.onHide()
    })()
  }, [])

  function show() {
    const defaultConfig = {
      duration: 200,
      useNativeDriver: true
    }
    return new Promise(resolve =>
      Animated.parallel([
        Animated.timing(transitionValue.transformY, { ...defaultConfig, toValue: 0 }),
        Animated.timing(transitionValue.scaleX, { ...defaultConfig, toValue: 1 }),
        Animated.timing(transitionValue.opacity, { ...defaultConfig, toValue: 1 })
      ]).start(resolve)
    )
  }

  function hide() {
    const defaultConfig = {
      duration: 200,
      useNativeDriver: true
    }
    return new Promise(resolve =>
      Animated.parallel([
        Animated.timing(transitionValue.transformY, { ...defaultConfig, toValue: 5 }),
        Animated.timing(transitionValue.scaleX, { ...defaultConfig, toValue: 0.8 }),
        Animated.timing(transitionValue.opacity, { ...defaultConfig, toValue: 0 })
      ]).start(resolve)
    )
  }

  const positionStyle = {
    top: {
      justifyContent: 'flex-start',
      paddingTop: 70
    },
    center: {},
    bottom: {
      justifyContent: 'flex-end',
      paddingBottom: 70
    }
  }[props.position]

  return (
    <View style={{
      ...styles.container,
      ...(positionStyle as any)
    }} pointerEvents="none">
      <Animated.View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 10,
          transform: [
            { translateY: transitionValue.transformY },
            { scaleX: transitionValue.scaleX },
          ],
          opacity: transitionValue.opacity
        }}
      >
        <Text style={{ color: 'white' }}>{props.text}</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },

  toast: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
  }
})

const baseToast = (options: {
  text: string
  position: Props['position']
  duration: number
}) => {
  const toastView = new RootSiblings(
    <MyToast 
      {...options}
      onHide={() => toastView.destroy()}
    />
  )
}

const toast = (text: string, position: Props['position'] = 'bottom', duration = 3000) => {
  baseToast({ text, position, duration })
}

export default toast