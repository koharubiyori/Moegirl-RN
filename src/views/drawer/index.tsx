import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { BackHandler, DeviceEventEmitter, Dimensions, DrawerLayoutAndroid } from 'react-native'
import DrawerBody from './components/Body'
import baseStorage from '~/utils/baseStorage'

export interface Props {

}

type FinalProps = Props

function MyDrawer(props: PropsWithChildren<FinalProps>) {
  const [immersionMode, setImmersionMode] = useState(false)
  const [isWatchingArticle, setIsWatchingArticle] = useState(false)
  const [lock, setLock] = useState(false)
  const visible = useRef(false)
  const refs = {
    drawer: useRef<any>()
  }
  
  // 监听路由变化，判断用户是否在article页面上
  useEffect(() => {
    const listener = DeviceEventEmitter.addListener('navigationStateChange', (prevState, state) => {
      let lastRouteName = state.routes[state.routes.length - 1].routeName
      setIsWatchingArticle(lastRouteName === 'article')
      baseStorage.get('config').then(config => setImmersionMode(config!.immersionMode))
    })

    return () => listener.remove()
  }, [])

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible.current) {
        close()
        return true
      }
    })

    return () => listener.remove()
  }, [])

  useEffect(() => {
    global.$drawer = { visible: visible, open, close, setLock }
  })

  function open() {
    refs.drawer.current.openDrawer()
  }

  function close() {
    refs.drawer.current.closeDrawer()
  }

  return (
    <DrawerLayoutAndroid
      keyboardDismissMode="on-drag"
      drawerLockMode={lock ? 'locked-closed' : 'unlocked'}
      renderNavigationView={() => <DrawerBody immersionMode={immersionMode && isWatchingArticle} />}
      drawerWidth={Dimensions.get('window').width * 0.6}
      onDrawerOpen={() => visible.current = true}
      onDrawerClose={() => visible.current = false}
      ref={refs.drawer}
    >{props.children}</DrawerLayoutAndroid>
  )
}

export default MyDrawer