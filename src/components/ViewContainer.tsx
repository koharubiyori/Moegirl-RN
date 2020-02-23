import React, { PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { useTheme } from 'react-native-paper'
import { configHOC, ConfigConnectedProps } from '~/redux/config/HOC'

export interface Props extends ViewProps {
  grayBgColor?: boolean
}

type FinalProps = Props & ConfigConnectedProps

function ViewContainer(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  
  const backgroundColor = props.state.config.theme !== 'night' ? 
    (props.grayBgColor ? '#eee' : theme.colors.background) : 
    theme.colors.background 
  return (
    <View {...props} 
      style={{ 
        backgroundColor, 
        flex: 1, 
        ...(props.style as any) 
      }}
    >
      {props.children}
    </View>
  )
}

export default configHOC(ViewContainer)

const styles = StyleSheet.create({
  
})