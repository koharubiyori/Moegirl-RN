import { max } from 'moment'
import React, { PropsWithChildren, useRef, useState } from 'react'
import { Animated, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, StyleSheet } from 'react-native'
import useAnimatedValueWithRef from '~/hooks/useAnimatedValueWIthRef'

export interface Props {
  maxDistance?: number
  header: JSX.Element | ((getDistanceByLayoutEvent: (event: LayoutChangeEvent) => void) => JSX.Element)
  children(scrollEventMapTo: (event: NativeSyntheticEvent<NativeScrollEvent>) => void, maxDistance: number): JSX.Element
}

;(MovableHeaderWrapperForList as DefaultProps<Props>).defaultProps = {
  maxDistance: 0
}

function MovableHeaderWrapperForList(props: PropsWithChildren<Props>) {
  const headerTranslateYTransition = useAnimatedValueWithRef(0)
  const lastScrollOffsetY = useRef(0)
  const maxDistance = useRef(props.maxDistance!)
  
  function scrollEventMapToHeaderTranslateY(event: NativeSyntheticEvent<NativeScrollEvent>) {
    headerTranslateYTransition.setValue(currentVal => {
      const scrollValue = (event.nativeEvent.contentOffset.y - lastScrollOffsetY.current) * 0.8
      lastScrollOffsetY.current = event.nativeEvent.contentOffset.y
      let nextValue = currentVal - scrollValue
      if (nextValue < -maxDistance.current) nextValue = -maxDistance.current
      if (nextValue > 0) nextValue = 0

      return nextValue
    })
  }

  function getDistanceByLayoutEvent(event: LayoutChangeEvent) {
    maxDistance.current = event.nativeEvent.layout.height
  }

  const header = typeof props.header === 'function' ? props.header(getDistanceByLayoutEvent) : props.header
  return (
    <>
      <Animated.View style={{
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        transform: [{ translateY: headerTranslateYTransition.value }]
      }}>{header}</Animated.View>
      {props.children(scrollEventMapToHeaderTranslateY, maxDistance.current)}
    </>
  )
}

export default MovableHeaderWrapperForList

const styles = StyleSheet.create({
  
})