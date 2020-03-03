import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, LayoutAnimation, NativeModules, StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import searchApi from '~/api/search'
import Button from '~/components/Button'
import StatusBar from '~/components/StatusBar'
import Item from './components/Item'
import { SearchData } from '~/api/search.d'
import { useTheme, Text } from 'react-native-paper'
import ViewContainer from '~/components/ViewContainer'
import useLayoutAnimation from '~/hooks/useLayoutAnimation'

export interface Props {
  
}

export interface RouteParams {
  searchWord: string
}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams>

function SearchResult(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const [list, setList] = useState<SearchData[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<0 | 1 | 2 | 3 | 4 | 5>(1) // 1：初始值，2：加载中，3：加载成功，0：加载失败，4：全部加载完成，5：已加载，但结果为空
  let searchWord = props.navigation.getParam('searchWord')

  useEffect(() => {
    loadList()
  }, [])

  useLayoutAnimation(
    LayoutAnimation.create(200, LayoutAnimation.Types.easeIn, LayoutAnimation.Properties.opacity)
  )

  function loadList () {
    if (status === 4 || status === 2) { return }
    setStatus(2)
    searchApi.search(searchWord, list.length)
      .then(({ query }) => {
        if (!query.searchinfo.totalhits) {
          setStatus(5)
          return
        }

        let nextStatus = 3

        if (query.searchinfo.totalhits === list.length + query.search.length) {
          nextStatus = 4
        }

        setTotal(query.searchinfo.totalhits)
        setList(list.concat(query.search))
        setStatus(nextStatus as any)
      }).catch(e => {
        console.log(e)
        setStatus(0)
      })
  }

  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT
  return (
    <ViewContainer>
      <StatusBar blackText />
      <View style={{ ...styles.header, backgroundColor: theme.colors.surface, height: 56 + statusBarHeight, paddingTop: statusBarHeight }}>
        <Button onPress={() => props.navigation.goBack()} rippleColor={theme.colors.placeholder}>
          <Icon name="keyboard-backspace" size={25} color={theme.colors.disabled} />
        </Button>

        <Text numberOfLines={1} style={styles.title}>搜索：{searchWord}</Text>
      </View>

      {status !== 5 ? <>
        <FlatList data={list} 
          onEndReachedThreshold={1}
          onEndReached={loadList}
          style={{ flex: 1 }}
          // textBreakStrategy="balanced"
          renderItem={item => <Item 
            key={item.item.title}
            data={item.item}
            searchWord={searchWord} 
            onPress={link => props.navigation.push('article', { link })}
          />}

          ListHeaderComponent={
            status === 3 || status === 4 ? <>
              <View style={styles.totalHint}>
                <Text style={{ color: theme.colors.disabled }}>共搜索到{total}条结果。</Text>
              </View>
            </> : null
          }

          ListFooterComponent={({
            0: () => 
              <TouchableOpacity onPress={loadList}>
                <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>加载失败，点击重试</Text>
                </View>
              </TouchableOpacity>,
            1: () => null,
            2: () => <ActivityIndicator color={theme.colors.accent} size={50} style={{ marginVertical: 10 }} />,
            3: () => null,
            4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: theme.colors.disabled }}>已经没有啦</Text>,
          }[status])()}
        />
      </> : <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', top: -40 }}>
          <Image source={require('~/assets/images/sushimoe.png')} style={{ width: 170, height: 170 }} />
          <Text style={{ color: theme.colors.disabled }}>什么也没找到...</Text>
        </View>
      </>}
    </ViewContainer>
  )
}

export default SearchResult

const styles = StyleSheet.create({
  header: {
    height: 55,
    elevation: 3,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white'
  },

  title: {
    fontSize: 18,
    marginLeft: 10,
    flex: 1
  },

  totalHint: {
    marginTop: 10,
    left: 10
  }
})