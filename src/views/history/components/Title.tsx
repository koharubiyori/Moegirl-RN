import React, { PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { useTheme, Text } from 'react-native-paper'

export interface Props {
  text: string
  style: StyleProp<ViewStyle>
}

type FinalProps = Props

export default function HistoryTitle(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  
  return (
    <View style={{ ...(props.style as any), marginVertical: 5 }}>
      <Text style={{ marginLeft: 5, color: theme.colors.accent, fontSize: 16 }}>{props.text}</Text>      
      <View style={{ marginTop: 3, marginRight: 10, height: 2, backgroundColor: theme.colors.accent }} />
    </View>
  )
}

const styles = StyleSheet.create({
  
})