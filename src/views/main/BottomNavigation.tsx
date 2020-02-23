import React, { PropsWithChildren, useState } from 'react'
import { StyleSheet, TouchableNativeFeedback, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

export interface Props {

}

type FinalProps = Props & { jumpTo (routeName: string): void }

function MyBottomNavigation(props: PropsWithChildren<FinalProps>) {
  const theme = useTheme()
  const [active, setActive] = useState('home')

  function selectTab(key: string) {
    setActive(key)
    props.jumpTo(key)
  }

  return (
    <View style={{ 
      ...styles.container, 
      backgroundColor: theme.colors.background,
      borderTopColor: '#eee'
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
    </View>
  )
}

export default MyBottomNavigation

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 55,
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
  const theme = useTheme()
  
  return (
    <TouchableNativeFeedback onPress={props.onPress}>
      <View style={styles.item}>
        <MaterialIcon name={props.icon} size={20} color={props.selected ? theme.colors.accent : theme.colors.disabled} />
        <Text style={{ color: props.selected ? theme.colors.accent : theme.colors.disabled }}>{props.label}</Text>
      </View>
    </TouchableNativeFeedback>
  )
}