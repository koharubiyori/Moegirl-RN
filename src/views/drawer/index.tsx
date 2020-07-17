import React, { PropsWithChildren, useEffect, useRef, useState } from 'react'
import { Dimensions, DrawerLayoutAndroid } from 'react-native'
import { createDrawerNavigator } from '@react-navigation/drawer'
import DrawerContent from './components/Content'

export interface Props {

}

interface DrawerController {
  // visible: boolean
  // lock: boolean
  // open(): void
  // close(): void
  setLock(lock?: boolean): void
}

export let drawerController: DrawerController = null as any

// function DrawerView(props: PropsWithChildren<Props>) {
//   const [visible, setVisible] = useState(false)
//   const [lock, setLock] = useState(false)
//   const drawerRef = useRef<any>()

//   useEffect(() => {
//     drawerController = {
//       visible,
//       lock,
//       open: () => drawerRef.current.openDrawer(),
//       close: () => drawerRef.current.closeDrawer(),
//       setLock: (lock = true) => setLock(lock),
//     }
//   })  

//   return (
//     <DrawerLayoutAndroid
//       keyboardDismissMode="on-drag"
//       drawerLockMode={lock ? 'locked-closed' : 'unlocked'}
//       renderNavigationView={() => <DrawerContent />}
//       drawerWidth={Dimensions.get('window').width * 0.6}
//       onDrawerOpen={() => setVisible(true)}
//       onDrawerClose={() => setVisible(false)}
//       ref={drawerRef}
//     >{props.children}</DrawerLayoutAndroid>
//   )
// }

// export default DrawerView

const Drawer = createDrawerNavigator()
const WrappedDrawerContent = (props: any) => <DrawerContent {...props} />

function DrawerView(props: PropsWithChildren<Props>) {
  const [lock, setLock] = useState(false)
  
  drawerController = {
    setLock: (lock = true) => setLock(lock)
  }

  return (
    <Drawer.Navigator 
      initialRouteName="main"
      edgeWidth={lock ? 0 : 50}
      drawerStyle={{
        width: Dimensions.get('window').width * 0.6,
        elevation: 10
      }}
      drawerContent={WrappedDrawerContent}
    >
      <Drawer.Screen name="main" component={() => props.children as any} />
    </Drawer.Navigator>
  )
}

export default DrawerView