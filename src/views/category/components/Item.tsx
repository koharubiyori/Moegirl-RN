import React, { PropsWithChildren } from 'react'
import { Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import store from '~/mobx'

export interface Props {
  title: string
  imgUrl: string | null
  onPress(): void
}

function CategoryItem(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const boxWidth = Dimensions.get('window').width / 2 - 10 
  const imgSize = boxWidth - 10

  const isNightTheme = store.settings.theme === 'night'
  return (
    <TouchableOpacity style={{ ...styles.wrapper, width: boxWidth }} onPress={props.onPress}>
      <View style={{ ...styles.container, backgroundColor: theme.colors.surface }}>
        {props.imgUrl ? <>
          <Image 
            source={{ uri: props.imgUrl }} 
            // 默认图片在debug版本不会生效
            defaultSource={require('~/assets/images/placeholder.png')} 
            resizeMode="contain" 
            style={{ width: imgSize, height: imgSize, borderRadius: 1 }} 
          />
        </> : <>
          {/* 这里无论用哪个颜色都不是特别满意，所以就使用单独的颜色了 */}
          <View style={{ width: imgSize, height: imgSize, backgroundColor: isNightTheme ? '#5B5B5B' : '#E2E2E2', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: theme.colors.disabled, fontSize: 18, borderRadius: 1 }}>暂无图片</Text>
          </View>
        </>}
        <View style={{ ...styles.divider, backgroundColor: theme.colors.accent }} />
        <Text style={{ textAlign: 'center' }} numberOfLines={1}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default CategoryItem

const styles = StyleSheet.create({
  container: {
    padding: 5,
    elevation: 1,
    borderRadius: 2,
  },

  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  divider: {
    height: 2,
    marginVertical: 5
  }
})