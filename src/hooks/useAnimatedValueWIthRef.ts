import { useRef } from 'react'
import { Animated } from 'react-native'

export default function useAnimatedValueWithRef(initialValue: number) {
  const animatedValue = useRef(new Animated.Value(initialValue)).current
  const animatedValueRef = useRef(initialValue)

  function setValue(value: number | ((currentValue: number) => number)) {
    if (typeof value === 'number') {
      animatedValue.setValue(value)
    } else {
      const computedValue = value(animatedValueRef.current)
      if ([null, undefined, animatedValueRef.current].includes(computedValue) === false) {
        animatedValue.setValue(computedValue)
        animatedValueRef.current = computedValue
      }
    }
  }

  return {
    value: animatedValue,
    ref: animatedValueRef,
    setValue
  }
}