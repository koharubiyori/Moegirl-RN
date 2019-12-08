import React from 'react'
import PropTypes from 'prop-types'
import { 
  View, Text, NativeModules,
  StyleSheet
} from 'react-native'
import { Toolbar } from 'react-native-material-ui'

MyToolbar.propTypes = {
  
}

export default function MyToolbar(props){
  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT

  return (
    <Toolbar {...props} 
      // style={{
      //   ...props.style,
      //   container: {
      //     ...(props.style && props.style.container ? props.style.container : {}),
      //     height: 56 + statusBarHeight,
      //     paddingTop: statusBarHeight
      //   }
      // }} 
    />
  )
}

const styles = StyleSheet.create({
  
})