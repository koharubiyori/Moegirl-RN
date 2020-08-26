import React, { FC, PropsWithChildren } from 'react'
import { StyleSheet, View, ViewProps } from 'react-native'
import { useTheme } from 'react-native-paper'
import store from '~/mobx'

export interface Props extends ViewProps {
  grayBgColor?: boolean
}

function ViewContainer(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  
  // 在使用灰背景时，如果是夜间模式则还是使用夜间的背景颜色
  const backgroundColor = store.settings.theme !== 'night' && props.grayBgColor ? 
    '#eee' :
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

export default ViewContainer

const styles = StyleSheet.create({
  
})