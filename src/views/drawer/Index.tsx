import React, { PropsWithChildren, useEffect, useRef, useState, createContext } from 'react'
import { Dimensions, DrawerLayoutAndroid } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import DrawerContent from './components/Content'

export interface Props {
  children(): JSX.Element
}

export interface DrawerController {
  setLock(lock?: boolean): void
}

const Drawer = createDrawerNavigator()

export let drawerController: DrawerController = null as any

function DrawerView(props: Props) {
  const [lock, setLock] = useState(false)

  drawerController = {
    setLock: (lock = true) => setLock(lock)
  }

  return (
    <Drawer.Navigator 
      initialRouteName="main"
      edgeWidth={50}
      drawerStyle={{
        width: Dimensions.get('window').width * 0.6,
        elevation: 10
      }}
      screenOptions={{
        swipeEnabled: !lock
      }}
      drawerContent={(props: any) => <DrawerContent {...props} />}
    >
      <Drawer.Screen name="main" component={props.children} />
    </Drawer.Navigator>
  )
}

export default DrawerView