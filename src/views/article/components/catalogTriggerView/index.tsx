import PropTypes from 'prop-types'
import React, { MutableRefObject, PropsWithChildren, useEffect, useRef } from 'react'
import { BackHandler, Dimensions, DrawerLayoutAndroid } from 'react-native'
import CatalogBody from './Body'

catalogTriggerView.propTypes = {
  immersionMode: PropTypes.bool,
  items: PropTypes.array,
  onTapTitle: PropTypes.func,
  getRef: PropTypes.object
}

export interface Props {
  immersionMode: boolean
  items: any[]
  onTapTitle (anchor: string): void
  getRef: MutableRefObject<any>
}

export interface CatalogTriggerViewRef {
  open (): void
  close (): void
}

type FinalProps = Props

function catalogTriggerView(props: PropsWithChildren<FinalProps>) {
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
        <CatalogBody 
          immersionMode={props.immersionMode}
          items={props.items} 
          onTapTitle={props.onTapTitle} 
          onClose={close} 
        />
      }
      drawerWidth={Dimensions.get('window').width * 0.5}
      drawerPosition={(DrawerLayoutAndroid as any).positions.Right}
      onDrawerOpen={() => visible.current = true}
      onDrawerClose={() => visible.current = false}
      ref={refs.drawer}
    >{props.children}</DrawerLayoutAndroid>
  )
}

export default catalogTriggerView