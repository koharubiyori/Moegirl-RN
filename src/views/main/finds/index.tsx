import React, { useState, useRef, PropsWithChildren } from 'react'
import {
  View, Text, ScrollView, RefreshControl,
  StyleSheet
} from 'react-native'
import Header from '../components/Header'
import Trend, { FindsModuleTrendRef } from './modules/Trend'
import Recommended, { FindsModuleRecommendedRef } from './modules/Recommended'
import { useTheme } from 'react-native-paper'

export interface Props {

}

type FinalProps = Props & __Navigation.InjectedNavigation

function Finds(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const [visibleRefreshControl, setVisibleRefreshControl] = useState(false)
  const refs = {
    trend: useRef<FindsModuleTrendRef>(),
    recommended: useRef<FindsModuleRecommendedRef>()
  }

  function reload () {
    setVisibleRefreshControl(true)
    Promise.all(
      Object.values(refs).map(ref => ref.current!.reload())
    ).finally(() => {
      setVisibleRefreshControl(false)
    })
  }

  function dateStr() {
    let date = new Date()
    let week = '日一二三四五六'
    return `${date.getMonth() + 1}月${date.getDate()}日 星期${week[date.getDay()]}`
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#eee' }}>
      <Header title="发现" />

      <ScrollView
        refreshControl={<RefreshControl colors={[theme.colors.primary]} onRefresh={reload} refreshing={visibleRefreshControl} />}
      >
        {/* <Text style={{ marginVertical: 20, marginLeft: 20, fontSize: 16 }}>{dateStr()}</Text> */}
        <Trend navigation={props.navigation} getRef={refs.trend} />
        <Recommended navigation={props.navigation} getRef={refs.recommended} />
      </ScrollView>
    </View>
  )
}

export default Finds