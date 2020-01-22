import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, LayoutAnimation, NativeModules, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import searchApi from '~/api/search'
import Button from '~/components/Button'
import StatusBar from '~/components/StatusBar'
import Item from './components/Item'
import { SearchData } from '~/api/search'

export interface Props {
  
}

export interface RouteParams {
  searchWord: string
}

type FinalProps = Props & __Navigation.InjectedNavigation<RouteParams>

function SearchResult(props: PropsWithChildren<FinalProps>) {
  const [list, setList] = useState<SearchData[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState(1) // 1：初始值，2：加载中，3：加载成功，0：加载失败，4：全部加载完成，5：已加载，但结果为空
  let searchWord = props.navigation.getParam('searchWord')

  useEffect(() => {
    loadList()
  }, [])

  useEffect(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(200, LayoutAnimation.Types.easeIn, LayoutAnimation.Properties.opacity)
    )
  })

  function loadList () {
    if (status === 4 || status === 2) { return }
    setStatus(2)
    searchApi.search(searchWord, list.length)
      .then(({ query }) => {
        if (!query.searchinfo.totalhits) {
          setStatus(5)
          return
        }

        let status = 3

        if (query.searchinfo.totalhits === list.length + query.search.length) {
          status = 4
        }

        setTotal(query.searchinfo.totalhits)
        setList(list.concat(query.search))
        setStatus(status)
      }).catch(e => {
        console.log(e)
        setStatus(0)
      })
  }

  const statusBarHeight = NativeModules.StatusBarManager.HEIGHT
  return (
    <View style={{ flex: 1 }}>
      <StatusBar blackText color="white" />
      <View style={{ ...styles.header, height: 56 + statusBarHeight, paddingTop: statusBarHeight }}>
        <Button onPress={() => props.navigation.goBack()} rippleColor={$colors.light}>
          <Icon name="keyboard-backspace" size={25} color="#666" />
        </Button>

        <Text ellipsizeMode="tail" numberOfLines={1} style={styles.title}>搜索：{searchWord}</Text>
      </View>

      {/* {this.state.total ?
        <View style={styles.totalHint}>
          <Text style={{ color: '#666' }}>共搜索到{this.state.total}结果</Text>
        </View>
      : null} */}

      {status !== 5 ? <>
        <FlatList data={list} 
          onEndReachedThreshold={1}
          onEndReached={loadList}
          style={{ flex: 1 }}
          // textBreakStrategy="balanced"
          renderItem={item => <Item 
            // key={item.item.id}
            data={item.item}
            searchWord={searchWord} 
            onPress={link => props.navigation.push('article', { link })}
          />}

          ListFooterComponent={(({
            0: () => 
              <TouchableOpacity onPress={loadList}>
                <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>加载失败，点击重试</Text>
                </View>
              </TouchableOpacity>,
            2: () => <ActivityIndicator color={$colors.main} size={50} style={{ marginVertical: 10 }} />,
            4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: '#666' }}>已经没有啦</Text>,
          } as { [status: number]: () => JSX.Element | null })[status] || (() => {}))()}
        />
      </> : <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', top: -40 }}>
          <Image source={require('~/assets/images/sushimoe.png')} style={{ width: 170, height: 170 }} />
          <Text style={{ color: '#ABABAB' }}>什么也没找到...</Text>
        </View>
      </>}
    </View>
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
    color: '#666',
    fontSize: 18,
    marginLeft: 10,
  },
})