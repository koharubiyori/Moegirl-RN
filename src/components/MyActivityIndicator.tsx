import React, { PropsWithChildren } from 'react'
import { View, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from 'react-native'
import { useTheme } from 'react-native-paper'

export interface Props {
  color?: string
  size?: 'small' | 'large' | number
  style?: StyleProp<ViewStyle>
}

;(MyActivityIndicator as DefaultProps<Props>).defaultProps = {
  size: 45
}

function MyActivityIndicator(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  
  return (
    <ActivityIndicator
      color={props.color || theme.colors.accent}    
      size={props.size}
      style={props.style}
    />
  )
}

export default MyActivityIndicator

const styles = StyleSheet.create({
  
})