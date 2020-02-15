import React, { PropsWithChildren, useState } from 'react'
import { StyleSheet, View, Text, TouchableNativeFeedback, Dimensions } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { BorderShadow } from 'react-native-shadow'

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
    <BorderShadow setting={{
      width: Dimensions.get('window').width,
      border: 3,
      style: styles.container,
      opacity: 0,
      side: 'top',
      insert: true
    }}>
      <Item 
        selected={active === 'home'}
        icon="book"
        label="首页"
        onPress={() => selectTab('home')}
      />
      <Item 
        selected={active === 'finds'}
        icon="stars"
        label="发现"
        onPress={() => selectTab('finds')}
      />
      <Item 
        selected={active === 'history'}
        icon="history"
        label="历史"
        onPress={() => selectTab('history')}
      />
    </BorderShadow>
  )
}

export default MyBottomNavigation

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 55,
    backgroundColor: 'white',
    borderTopColor: '#eee',
    borderTopWidth: 0.8
  },

  item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  }
})

export interface BottomNavigationItemProps {
  icon: string
  label: string
  selected?: boolean
  onPress (): void
}

function Item(props: BottomNavigationItemProps) {
  return (
    <TouchableNativeFeedback onPress={props.onPress}>
      <View style={styles.item}>
        <MaterialIcon name={props.icon} size={20} color={props.selected ? $colors.primary : '#666'} />
        <Text style={{ color: props.selected ? $colors.primary : '#666' }}>{props.label}</Text>
      </View>
    </TouchableNativeFeedback>
  )
}