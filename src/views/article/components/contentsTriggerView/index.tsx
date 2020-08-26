import React, { MutableRefObject, PropsWithChildren, useEffect, useRef } from 'react'
import { BackHandler, Dimensions, DrawerLayoutAndroid } from 'react-native'
import ArticleContentsBody from './Body'

export interface Props {
  items: any[]
  onPressTitle (anchor: string): void
  getRef: MutableRefObject<any>
}

export interface ArticleContentTriggerViewRef {
  open (): void
  close (): void
}

function ArticleContentsTriggerView(props: PropsWithChildren<Props>) {
  const visible = useRef(false)
  const refs = {
    drawer: useRef<any>()
  }

  if (props.getRef) props.getRef.current = { open, close }

  useEffect(() => {
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (visible.current) {
        close()
        return true
      }
    })

    return () => listener.remove()
  }, [])

  function open() {
    refs.drawer.current.openDrawer()
  }

  function close() {
    refs.drawer.current.closeDrawer()
  }

  return (
    <DrawerLayoutAndroid
      renderNavigationView={() => 
        <ArticleContentsBody 
          items={props.items} 
          onPressTitle={props.onPressTitle} 
          onClose={close} 
        />
      }
      drawerWidth={Dimensions.get('window').width * 0.55}
      drawerPosition={'right' as any}
      onDrawerOpen={() => visible.current = true}
      onDrawerClose={() => visible.current = false}
      ref={refs.drawer}
    >{props.children}</DrawerLayoutAndroid>
  )
}

export default ArticleContentsTriggerView