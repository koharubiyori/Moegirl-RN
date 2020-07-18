import React, { PropsWithChildren, useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, TouchableOpacity, Vibration, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import watchListApi from '~/api/watchList'
import MyStatusBar from '~/components/MyStatusBar'
import MyToolbar from '~/components/MyToolbar'
import ViewContainer from '~/components/ViewContainer'
import useLayoutAnimation from '~/hooks/useLayoutAnimation'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import dialog from '~/utils/dialog'
import { diffDate } from '~/utils/diffDate'
import toast from '~/utils/toast'
import Item from './components/Item'
import i from './lang'

export interface Props {

}

export interface RouteParams {

}

type WatchListList = {
  list: {
    title: string
    lastEditDate?: string
    image?: undefined | {
      source: string
      width: number
      height: number
    }
    redirect?: string
  }[]

  status: 0 | 1 | 2 | 2.1 | 3 | 4 | 5
  continue: string | undefined
}

function WatchListPage(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const [watchListList, setWatchListList] = useState<WatchListList>({
    list: [],
    status: 1,
    continue: undefined
  })

  useEffect(() => {
    load(true)
  }, [])

  useLayoutAnimation()

  function load(force = false) {
    if ([2, 2.1, 4, 5].includes(watchListList.status) && !force) return Promise.resolve()
    setWatchListList(prevVal => force ? { list: [], status: 2.1, continue: undefined } : { ...prevVal, status: 2 })
    
    return watchListApi.getListWithImage(force ? undefined : watchListList.continue)
      .then(data => {
        const { redirects } = data.query
        const pages = Object.values(data.query.pages).filter(item => !('missing' in item))
        let result: WatchListList['list'] = pages.map(item => ({
          title: item.title,
          lastEditDate: diffDate(new Date(item.revisions[0].timestamp)),
          image: item.thumbnail
        }))

        if (redirects) {
          result = result.concat(redirects.map(item => ({
            title: item.from,
            redirect: item.to
          })))
        }

        setWatchListList(prevVal => ({
          list: prevVal.list.concat(result),
          status: 3,
          continue: data.continue ? data.continue.gwrcontinue : undefined
        }))

        if (!data.continue && pages.length !== 0) {
          setWatchListList(prevVal => ({ ...prevVal, status: 4 }))
        }
        if (pages.length === 0) {
          setWatchListList(prevVal => ({ ...prevVal, status: 5 }))
        }
      })
  }

  async function unwatchTitle(title: string) {
    Vibration.vibrate(25)
    await dialog.confirm.show({ content: i.index.unwatchTitle.check(title) })
    dialog.loading.show()
    watchListApi.setWatchStatus(title, true)
      .finally(dialog.loading.hide)
      .then(() => {
        setWatchListList(prevVal => ({ ...prevVal, list: prevVal.list.filter(item => item.title !== title) }))
        toast(i.index.unwatchTitle.success)
      })
      .catch(console.log)
  }
  
  return (
    <ViewContainer grayBgColor>
      <MyStatusBar />  
      <MyToolbar
        title={i.index.title}
        leftIcon="keyboard-backspace"
        onPressLeftIcon={() => navigation.goBack()}
      />   
      
      <FlatList data={watchListList.list} 
        onEndReachedThreshold={1}
        onEndReached={() => load()}
        style={{ flex: 1 }}
        renderItem={item => 
          <Item 
            key={item.index}
            title={item.item.title}
            imageUrl={item.item.image ? item.item.image.source : undefined}
            lastEditDate={item.item.lastEditDate}
            redirect={item.item.redirect}
            onPress={() => navigation.push('article', { pageName: item.item.title })}
            onLongPress={() => unwatchTitle(item.item.title)}
          />
        }

        refreshControl={
          <RefreshControl 
            colors={[theme.colors.accent]} 
            onRefresh={() => load(true)} 
            refreshing={watchListList.status === 2.1} 
          />
        }

        ListFooterComponent={{
          0: () => 
            <TouchableOpacity onPress={() => load()}>
              <View style={{ height: 60, justifyContent: 'center', alignItems: 'center' }}>
                <Text>{i.index.netErr}</Text>
              </View>
            </TouchableOpacity>,
          1: () => null,
          2: () => <ActivityIndicator color={theme.colors.accent} size={50} style={{ marginVertical: 10 }} />,
          2.1: () => null,
          3: () => null,
          4: () => <Text style={{ textAlign: 'center', fontSize: 16, marginVertical: 20, color: theme.colors.disabled }}>{i.index.allLoaded}</Text>,
          5: () => null
        }[watchListList.status]()}
      />
    </ViewContainer>
  )
}

export default WatchListPage

const styles = StyleSheet.create({
  
})