import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, LayoutAnimation, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialIcons'
import searchApi from '~/api/search'
import { SearchData } from '~/api/search/types'
import MyButton from '~/components/MyButton'
import MyStatusBar from '~/components/MyStatusBar'
import ViewContainer from '~/components/ViewContainer'
import useLayoutAnimation from '~/hooks/useLayoutAnimation'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import useMyRoute from '~/hooks/useTypedRoute'
import Item from './components/Item'
import i from './lang'

export interface Props {
  
}

export interface RouteParams {
  keyword: string
}

function SearchResultPage(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const route = useMyRoute<RouteParams>()
  const [list, setList] = useState<SearchData[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState<0 | 1 | 2 | 3 | 4 | 5>(1) // 1：初始值，2：加载中，3：加载成功，0：加载失败，4：全部加载完成，5：已加载，但结果为空
  const keyword = route.params.keyword

  useEffect(() => {
    loadList()
  }, [])

  useLayoutAnimation()

  function loadList () {
    if (status === 4 || status === 2) { return }
    setStatus(2)
    searchApi.search(keyword, list.length)
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
        setTimeout(() => setStatus(nextStatus as any)) // 延迟到下一个macro task，否则这个会先于列表的更新，导致滚动条出现向上一点的情况
      }).catch(e => {
        console.log(e)
        setStatus(0)
      })
  }

  const statusBarHeight = StatusBar.currentHeight!
  return (
    <ViewContainer>
      <MyStatusBar blackText />
      <View 
        style={{ 
          ...styles.header, 
          backgroundColor: theme.colors.surface, 
          height: 56 + statusBarHeight, paddingTop: statusBarHeight 
        }}
      >
        <MyButton onPress={() => navigation.goBack()} rippleColor={theme.colors.placeholder}>
          <Icon name="keyboard-backspace" size={25} color={theme.colors.disabled} />
        </MyButton>
        <Text numberOfLines={1} style={styles.title}>{i.index.title(keyword)}</Text>
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
            searchWord={keyword} 
            onPress={pageName => navigation.push('article', { pageName })}
          />}

          ListHeaderComponent={ 
            (status === 3 || status === 4) ?
              <View style={styles.totalHint}>
                <Text style={{ color: theme.colors.disabled }}>{i.index.resultCount(total)}</Text>
              </View>
            : null
          }

          ListFooterComponent={({
            0: () => 
              <TouchableOpacity onPress={loadList}>
                <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
                  <Text>{i.index.netErr}</Text>
                </View>
              </TouchableOpacity>,
            1: () => null,
            2: () => <ActivityIndicator color={theme.colors.accent} size={50} style={{ marginVertical: 10 }} />,
            3: () => null,
            4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: theme.colors.disabled }}>{i.index.allLoaded}</Text>,
          }[status])()}
        />
      </> : <>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', position: 'relative', top: -40 }}>
          <Image source={require('~/assets/images/sushimoe.png')} style={{ width: 170, height: 170 }} />
          <Text style={{ color: theme.colors.disabled }}>{i.index.noData}</Text>
        </View>
      </>}
    </ViewContainer>
  )
}

export default SearchResultPage

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