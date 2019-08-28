import React from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, TouchableNativeFeedback,
  StyleSheet
} from 'react-native'

Button.propTypes = {
  style: PropTypes.object,
  children: PropTypes.element,

  onPress: PropTypes.func
}

export default function Button(props){
  return (
    <View style={props.style}>
      <TouchableNativeFeedback 
        onPress={props.onPress}
        background={TouchableNativeFeedback.Ripple('white', true)}
      >
        <View style={{ padding: 5 }}>{props.children}</View>
      </TouchableNativeFeedback>
    </View>
  )
}