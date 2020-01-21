import React, { useState, PropsWithChildren } from 'react'
import BottomNavigation from 'react-native-material-ui/src/BottomNavigation'

export interface Props {

}

type FinalProps = Props & { jumpTo (routeName: string): void }

function MyBottomNavigation(props: PropsWithChildren<FinalProps>) {
  const [active, setActive] = useState('home')

  function selectTab(key: string) {
    setActive(key)
    props.jumpTo(key)
  }

  return (
    <BottomNavigation active={active}>
      <BottomNavigation.Action
        key="home"
        icon="book"
        label="首页"
        onPress={() => selectTab('home')}
      />        
      <BottomNavigation.Action
        key="finds"
        icon="stars"
        label="发现"
        onPress={() => selectTab('finds')}
      />        
      <BottomNavigation.Action
        key="history"
        icon="history"
        label="历史"
        onPress={() => selectTab('history')}
      />        
    </BottomNavigation>
  )
}

export default MyBottomNavigation