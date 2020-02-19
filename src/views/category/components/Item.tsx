import React, { useState, useEffect, useRef, PropsWithChildren } from 'react'
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native'
import Button from '~/components/Button'

export interface Props {
  title: string
  imgUrl: string | null
  onPress(): void
}

type FinalProps = Props

function CategoryItem(props: PropsWithChildren<FinalProps>) {
  const boxWidth = Dimensions.get('window').width / 2 - 10 
  const imgSize = boxWidth - 10

  return (
    <TouchableOpacity style={{ ...styles.wrapper, width: boxWidth }} onPress={props.onPress}>
      <View style={styles.container}>
        {props.imgUrl ? <>
          <Image 
            source={{ uri: props.imgUrl }} 
            // 默认图片在debug版本不会生效
            defaultSource={require('~/assets/images/placeholder.png')} 
            resizeMode="contain" 
            style={{ width: imgSize, height: imgSize, borderRadius: 1 }} 
          />
        </> : <>
          <View style={{ width: imgSize, height: imgSize, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: $colors.subtext, fontSize: 18, borderRadius: 1 }}>暂无图片</Text>
          </View>
        </>}
        <View style={styles.divider} />
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
    backgroundColor: $colors.primary,
    height: 2,
    marginVertical: 5
  }
})