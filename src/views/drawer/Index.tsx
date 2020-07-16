import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Dimensions, DrawerLayoutAndroid } from 'react-native'
import DrawerContent from './components/Content'

export interface Props {

}

interface DrawerController {
  visible: boolean
  lock: boolean
  open(): void
  close(): void
  setLock(lock?: boolean): void
}

export let drawerController: DrawerController = null as any

function DrawerView(props: PropsWithChildren<Props>) {
  const [visible, setVisible] = useState(false)
  const [lock, setLock] = useState(false)
  const drawerRef = useRef<any>()

  useEffect(() => {
    drawerController = {
      visible,
      lock,
      open: () => drawerRef.current.openDrawer(),
      close: () => drawerRef.current.closeDrawer(),
      setLock: (lock = true) => setLock(lock),
    }
  })  

  return (
    <DrawerLayoutAndroid
      keyboardDismissMode="on-drag"
      drawerLockMode={lock ? 'locked-closed' : 'unlocked'}
      renderNavigationView={() => <DrawerContent />}
      drawerWidth={Dimensions.get('window').width * 0.6}
      onDrawerOpen={() => setVisible(true)}
      onDrawerClose={() => setVisible(false)}
      ref={drawerRef}
    >{props.children}</DrawerLayoutAndroid>
  )
}

export default DrawerView