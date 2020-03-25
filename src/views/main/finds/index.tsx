import React, { PropsWithChildren, useRef, useState } from 'react'
import { RefreshControl, ScrollView } from 'react-native'
import { useTheme } from 'react-native-paper'
import ViewContainer from '~/components/ViewContainer'
import Header from '../components/Header'
import Recommended, { FindsModuleRecommendedRef } from './modules/Recommended'
import Trend, { FindsModuleTrendRef } from './modules/Trend'

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
    <ViewContainer grayBgColor>
      <Header title="发现" />

      <ScrollView
        contentContainerStyle={{ paddingTop: 10 }}
        refreshControl={<RefreshControl colors={[theme.colors.accent]} onRefresh={reload} refreshing={visibleRefreshControl} />}
      >
        {/* <Text style={{ marginVertical: 20, marginLeft: 20, fontSize: 16 }}>{dateStr()}</Text> */}
        <Trend navigation={props.navigation} getRef={refs.trend} />
        <Recommended navigation={props.navigation} getRef={refs.recommended} />
      </ScrollView>
    </ViewContainer>
  )
}

export default Finds