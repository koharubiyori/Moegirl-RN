import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  View, Text, DrawerLayoutAndroid, Dimensions, BackHandler, DeviceEventEmitter,
  StyleSheet
} from 'react-native'
import CatalogBody from './Body'

catalogTriggerView.propTypes = {
  immersionMode: PropTypes.bool,
  items: PropTypes.array,
  onTapTitle: PropTypes.func,
  getRef: PropTypes.object
}

function catalogTriggerView(props){
  const visible = useRef(false)
  const refs = {
    drawer: useRef()
  }

  if(props.getRef) props.getRef.current = { open, close }

  useEffect(() =>{
    const listener = BackHandler.addEventListener('hardwareBackPress', () =>{
      if(visible.current){
        close()
        return true
      }
    })

    return () => listener.remove()
  }, [])

  function open(){
    refs.drawer.current.openDrawer()
  }

  function close(){
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
      drawerPosition={DrawerLayoutAndroid.positions.Right}
      onDrawerOpen={() => visible.current = true}
      onDrawerClose={() => visible.current = false}
      ref={refs.drawer}
    >{props.children}</DrawerLayoutAndroid>
  )
}

export default catalogTriggerView