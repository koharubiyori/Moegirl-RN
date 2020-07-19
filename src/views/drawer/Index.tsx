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
  const [visibleBgColor, setVisibleBgColor] = useState(false)

  // 延迟1秒显示防止启动时闪烁
  useEffect(() => {
    setTimeout(() => setVisibleBgColor(true), 1000)
  }, [])

  drawerController = {
    setLock: (lock = true) => setLock(lock)
  }

  return (
    <Drawer.Navigator 
      initialRouteName="main"
      edgeWidth={50}
      drawerStyle={{
        width: Dimensions.get('window').width * 0.6,
        elevation: 10,
        backgroundColor: visibleBgColor ? 'white' : 'transparent'
      }}
      screenOptions={{
        swipeEnabled: !lock
      }}
      // 抽屉内容也要跟着一起隐藏1秒，防止闪烁
      drawerContent={(props: any) => visibleBgColor && <DrawerContent {...props} />}
    >
      <Drawer.Screen name="main" component={props.children} />
    </Drawer.Navigator>
  )
}

export default DrawerView