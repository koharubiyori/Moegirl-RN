import React, { PropsWithChildren } from 'react'
import { StyleProp, TouchableNativeFeedback, View, ViewStyle } from 'react-native'

export interface Props {
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  rippleColor?: string
  noLimit?: boolean
  onPress? (): void
}

(Button as DefaultProps<Props>).defaultProps = {
  contentContainerStyle: { padding: 5 },
  rippleColor: 'white',
  noLimit: true
}

type FinalProps = Props

function Button(props: PropsWithChildren<FinalProps>) {
  return (
    <View style={props.style}>
      <TouchableNativeFeedback 
        onPress={props.onPress}
        background={TouchableNativeFeedback.Ripple(props.rippleColor!, props.noLimit)}
      >
        <View style={props.contentContainerStyle}>{props.children}</View>
      </TouchableNativeFeedback>
    </View>
  )
}

export default Button