import React, { PropsWithChildren, useEffect, useState } from 'react'
import { Image, StyleSheet } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import RNFetchBlob from 'rn-fetch-blob'
import MyButton from '~/components/MyButton'
import { BrowsingHistoryWithDiffDate } from '../index'

export interface Props {
  data: BrowsingHistoryWithDiffDate
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
    <MyButton 
      contentContainerStyle={{ ...styles.container, backgroundColor: theme.colors.surface }} 
      rippleColor={theme.colors.accent}
      onPress={() => props.onPress(props.data.title)}
    >
      <Image 
        source={props.data.imgPath ? articleImg : require('~/assets/images/moemoji.png')} 
        resizeMode="contain" 
        style={{ width: 60, height: 70, position: 'absolute', top: 5, left: 5 }} 
      />
      {/* 每行最多15个字 */}
      <Text style={{ maxWidth: 14 * 15, textAlign: 'center' }} numberOfLines={2}>{props.data.title}</Text>
      <Text style={{ position: 'absolute', right: 5, bottom: 5 }}>{props.data.date}</Text>
    </MyButton>
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