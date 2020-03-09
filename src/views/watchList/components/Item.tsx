import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { View, StyleSheet, Image, TouchableNativeFeedback } from 'react-native'
import { useTheme, Text } from 'react-native-paper'

export interface Props {
  title: string
  imageUrl: string | undefined
  lastEditDate: string | undefined
  redirect: string | undefined
  onPress(): void
  onLongPress(): void
}

type FinalProps = Props

function WatchListItem(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  
  return (
    <TouchableNativeFeedback 
      background={TouchableNativeFeedback.Ripple(theme.colors.primary)} 
      onPress={props.onPress}
      onLongPress={props.onLongPress}
    >
      <View style={{ ...styles.container, backgroundColor: theme.colors.surface }}>
        <Image 
          source={props.imageUrl ? { uri: props.imageUrl } : require('~/assets/images/moemoji.png')} 
          style={styles.image} 
        />
        <View style={{ flex: 1, justifyContent: 'space-evenly', marginLeft: 10 }}>
          <Text style={{ ...styles.title }}>{props.title}</Text>
          <Text style={{ ...styles.subInfo, color: theme.colors.disabled }}>
            {props.lastEditDate ? 
              '最后编辑于：' + props.lastEditDate
              :
              '重定向至：' + props.redirect
            }
          </Text>
        </View>
      </View>
    </TouchableNativeFeedback>
  )
}

export default WatchListItem

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    marginBottom: 1,
    padding: 5
  },

  image: {
    width: 60,
    height: 70,
  },

  title: {
    maxWidth: 14 * 15, 
    fontSize: 16
  },

  subInfo: {
  }
})