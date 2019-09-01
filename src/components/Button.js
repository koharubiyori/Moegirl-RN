import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, TouchableNativeFeedback,
  StyleSheet
} from 'react-native'

Button.propTypes = {
  style: PropTypes.object,
  children: PropTypes.element,
  rippleColor: PropTypes.string,
  noLimit: PropTypes.bool,

  onPress: PropTypes.func
}

export default function Button({
  style,
  contentContainerStyle = { padding: 5 },
  onPress,
  rippleColor = 'white',
  noLimit = true,
  children,
}){
  return (
    <View style={style}>
      <TouchableNativeFeedback 
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(rippleColor, noLimit)}
      >
        <View style={contentContainerStyle}>{children}</View>
      </TouchableNativeFeedback>
    </View>
  )
}