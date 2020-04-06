import React, { PropsWithChildren, useState, useEffect } from 'react'
import { Image, StyleSheet } from 'react-native'
import Button from '~/components/Button'
import { BrowsingHistoryWithViewDate } from '../index'
import { useTheme, Surface, Text } from 'react-native-paper'
import RNFetchBlob from 'rn-fetch-blob'
import { BROWSING_HISTORY_IMGS_DIRNAME } from '~/constants'

export interface Props {
  data: BrowsingHistoryWithViewDate
  onPress (link: string): void
}

type FinalProps = Props

export default function HistoryItem(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const [articleImg, setArticleImg] = useState<{ uri: string | null }>({ uri: null })

  // 异步读取配图
  useEffect(() => {
    if (!props.data.imgPath) { return }
    const imgPath = RNFetchBlob.fs.dirs.DocumentDir + props.data.imgPath
    const imgSuffixName = props.data.imgPath!.match(/\.([^\.]+)$/)![1]
    RNFetchBlob.fs.readFile(imgPath, 'base64')
      .then(data => {
        setArticleImg({ uri: `data:image/${imgSuffixName};base64,` + data })
      })
      .catch(e => console.log(e))
  }, [])

  return (
    <Button contentContainerStyle={{ ...styles.container, backgroundColor: theme.colors.surface }} noLimit={false} rippleColor={theme.colors.accent}
      onPress={() => props.onPress(props.data.title)}
    >
      <Image 
        source={props.data.imgPath ? articleImg : require('~/assets/images/moemoji.png')} 
        resizeMode="cover" 
        style={{ width: 60, height: 70, position: 'absolute', top: 5, left: 5 }} 
      />
      {/* 每行最多15个字 */}
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