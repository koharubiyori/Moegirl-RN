import React, { PropsWithChildren } from 'react'
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

export interface Props {
  text: string
  style: StyleProp<ViewStyle>
}

type FinalProps = Props

export default function HistoryTitle(props: PropsWithChildren<FinalProps>) {
  return (
    <View style={{ ...(props.style as any), marginVertical: 5 }}>
      <Text style={{ marginLeft: 5, color: $colors.main, fontSize: 16 }}>{props.text}</Text>      
      <View style={{ marginTop: 3, marginRight: 10, height: 2, backgroundColor: $colors.main }} />
    </View>
  )
}

const styles = StyleSheet.create({
  
})