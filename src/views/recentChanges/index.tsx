import moment from 'moment'
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { FlatList, RefreshControl, StatusBar, StyleSheet } from 'react-native'
import { useTheme } from 'react-native-paper'
import searchApi from '~/api/search'
import { RecentChangeData } from '~/api/search/types'
import MovableHeaderWrapperForList from '~/components/MovableHeaderWrapperForList'
import MyStatusBar from '~/components/MyStatusBar'
import MyToolbar from '~/components/MyToolbar'
import ViewContainer from '~/components/ViewContainer'
import useTypedNavigation from '~/hooks/useTypedNavigation'
import useMyRoute from '~/hooks/useTypedRoute'
import store from '~/mobx'
import EditItem, { UserDataForRecentChangesItem } from './components/EditItem'
import RecentChangesOptionsBar, { RecentChangesOptions } from './components/OptionsBar'

export interface Props {
  
}

export interface RouteParams {
  
}

;(RecentChangesPage as DefaultProps<Props>).defaultProps = {
  
}

type ChangesListItem = RecentChangeData & {
  details: RecentChangeData[]
  users: UserDataForRecentChangesItem[]
}

function RecentChangesPage(props: PropsWithChildren<Props>) {
  const theme = useTheme()
  const navigation = useTypedNavigation()
  const route = useMyRoute<RouteParams>()
  const [changesList, setChangesList] = useState<ChangesListItem[]>([])
  const [status, setStatus] = useState<0 | 1 | 2 | 3>(1)
  const recentChangesOptions = useRef<RecentChangesOptions>()
  const [optionsBarHeight, setOptionsBarHeight] = useState(0)
  
  useEffect(() => {
    loadChanges()
  }, [])

  function loadChanges() {
    if (status === 2) { return }
    
    setStatus(2)
    const options = recentChangesOptions.current!
    searchApi.getRecentChanges({
      startISO: moment().date(-options.daysAgo).toISOString(),
      limit: options.totalLimit,
      ...(options.includeSelf && store.user.isLoggedIn ? { excludeUser: store.user.name } : {}),
      namespace: options.namespace,
      includeMinor: options.includeMinor,
      includeRobot: options.includeRobot
    })
      .then(data => {
        // 为数据添加最近修改详细信息
        const result = data.reduce((result, item) => {
          if (result.every(resultItem => resultItem.title !== item.title)) {
            result.push({ ...item, details: [item], users: [] }) // 本身也算在详细信息里
          } else {
            result.find(resultItem => resultItem.title === item.title)!.details.push(item)
          }

          return result
        }, [] as typeof changesList)
        
        // 添加users
        result.forEach(item => {
          item.details.forEach(detail => {
            const foundUserIndex = item.users.findIndex(user => user.name === detail.user)
            if (foundUserIndex !== -1) {
              item.users[foundUserIndex].total++
            } else {
              item.users.push({ name: detail.user, total: 1 })
            }
          })
        })

        setChangesList(result)
        setStatus(3)
      })
      .catch(e => {
        console.log(e)
        setStatus(0)
      })
  }
  
  return (
    <ViewContainer grayBgColor>
      <MyStatusBar color={theme.colors.primary} />
      <MovableHeaderWrapperForList
        maxDistance={56}
        header={<>
          <MyToolbar
            title={'最近更改'}
            leftIcon="keyboard-backspace"
            rightIcon="refresh"
            onPressLeftIcon={() => navigation.goBack()}
            onPressRightIcon={() => {}}
          />

          <RecentChangesOptionsBar
            onChange={options => recentChangesOptions.current = options}
            onLayout={e => setOptionsBarHeight(e.nativeEvent.layout.height)}
          />
        </>}
      >{(scrollEventMapTo, maxDistance) => 
        <FlatList
          style={{ flex: 1 }}
          data={changesList}
          contentContainerStyle={{ marginTop: MyToolbar.height + optionsBarHeight + StatusBar.currentHeight! }}
          onScroll={scrollEventMapTo}
          renderItem={({ item }) => 
            <EditItem
              key={item.timestamp}
              type={item.type as any}
              title={item.title}
              comment={item.comment}
              users={item.users}
              newLength={item.newlen}
              oldLength={item.oldlen}
              revId={item.revid}
              oldRevId={item.old_revid}
              dateISO={item.timestamp}
              editDetails={item.details}
            />  
          }
          refreshControl={
            <RefreshControl 
              colors={[theme.colors.accent]} 
              onRefresh={loadChanges} 
              refreshing={status === 2} 
              style={{ position: 'relative', zIndex: 1000 }}
            />
          }
        />
      }</MovableHeaderWrapperForList>
    </ViewContainer>
  )
}

export default RecentChangesPage

const styles = StyleSheet.create({

})