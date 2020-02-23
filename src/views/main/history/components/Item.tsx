import React, { PropsWithChildren } from 'react'
import { Image, StyleSheet } from 'react-native'
import Button from '~/components/Button'
import { BrowsingHistoryWithViewDate } from '../index'
import { useTheme, Surface, Text } from 'react-native-paper'

export interface Props {
  data: BrowsingHistoryWithViewDate
  onPress (link: string): void
}

type FinalProps = Props

export default function HistoryItem(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  
  return (
    <Button contentContainerStyle={{ ...styles.container, backgroundColor: theme.colors.surface }} noLimit={false} rippleColor={theme.colors.accent}
      onPress={() => props.onPress(props.data.title)}
    >
      <Image source={props.data.img || require('~/assets/images/moemoji.png')} resizeMode="cover" style={{ width: 60, height: 70, position: 'absolute', top: 5, left: 5 }} />
      <Text style={{ maxWidth: 14 * 15, textAlign: 'center' }} numberOfLines={2}>{props.data.title}</Text>
      <Text style={{ position: 'absolute', right: 5, bottom: 5 }}>{props.data.date}</Text>
    </Button>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 80,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    marginVertical: 5,
    marginHorizontal: 10,
    elevation: 2,
    borderRadius: 1
  }
})