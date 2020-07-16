import React, { PropsWithChildren } from 'react'
import { StyleProp, TouchableNativeFeedback, View, ViewStyle } from 'react-native'

export interface Props {
  style?: StyleProp<ViewStyle>
  contentContainerStyle?: StyleProp<ViewStyle>
  rippleColor?: string
  noRippleLimit?: boolean
  onPress? (): void
}

;(MyButton as DefaultProps<Props>).defaultProps = {
  contentContainerStyle: { padding: 5 },
  rippleColor: 'white',
  noRippleLimit: false
}

function MyButton(props: PropsWithChildren<Props>) {
  return (
    <View style={props.style}>
      <TouchableNativeFeedback 
        onPress={props.onPress}
        background={TouchableNativeFeedback.Ripple(props.rippleColor!, props.noRippleLimit)}
      >
        <View style={props.contentContainerStyle}>{props.children}</View>
      </TouchableNativeFeedback>
    </View>
  )
}

export default MyButton