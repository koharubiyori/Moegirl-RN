import React, { PropsWithChildren } from 'react'
import { ActivityIndicator, Image, StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native'

export interface Props {
  title: string
  subtitle?: string
  icon: JSX.Element
  articles: any[]
  style?: StyleProp<ViewStyle>
  navigation: __Navigation.Navigation
  status: number
  onTapReload (): void
}

type FinalProps = Props

export default function ArticleGroup(props: PropsWithChildren<FinalProps>) {
  return (
    <View style={{ ...styles.container, ...(props.style as any) }}>
      <View style={{ ...styles.header, borderBottomWidth: props.status === 3 || props.status === 4 ? 1 : 0 }}>
        <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {props.icon}
            <Text style={{ marginLeft: 10 }}>{props.title}</Text>
          </View>

          {!props.subtitle ? null : <>
            <View style={{ justifyContent: 'center', marginLeft: 10, flex: 1 }}>
              <Text style={{ color: '#ABABAB', fontSize: 13 }} numberOfLines={1}>{props.subtitle}</Text>
            </View>
          </>}

          {props.status === 2 ? <ActivityIndicator color={$colors.main} size={26} style={{ marginLeft: 10 }} /> : null}
        </View>
      </View>

      {props.status === 3 ? <>
        <View style={{ marginTop: 10 }}>{props.articles.map(item =>
          <TouchableOpacity onPress={() => props.navigation.push('article', { link: item.title })} key={item.title}>
            <View style={styles.item}>
              <Image source={item.image ? { uri: item.image } : require('~/assets/images/moemoji.png')} style={{ width: 60, height: 65, borderRadius: 3 }} />
              <Text style={{ textAlign: 'center', flex: 1 }} numberOfLines={2}>{item.title}</Text>
            </View>
          </TouchableOpacity>
        )}</View>
      </> : null}

      {props.status === 4 ? <Text style={{ marginVertical: 20, color: '#ABABAB', textAlign: 'center' }}>暂无相关条目</Text> : null}

      {props.status === 0 ? <>
        <TouchableOpacity onPress={props.onTapReload}>
          <Text style={{ marginVertical: 20, color: $colors.main, textAlign: 'center' }}>重新加载</Text>
        </TouchableOpacity>  
      </> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    elevation: 2,
    backgroundColor: 'white',
    borderRadius: 3
  },

  header: {
    paddingHorizontal: 10,
    borderBottomColor: '#ccc'
  },

  item: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  }
})