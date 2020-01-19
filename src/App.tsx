import React, { useEffect, useRef } from 'react'
import { BackHandler, DeviceEventEmitter } from 'react-native'
import { getTheme, ThemeContext } from 'react-native-material-ui'
import SplashScreen from 'react-native-splash-screen'
import { Provider } from 'react-redux'
import Alert from '~/components/dialog/Alert'
import Confirm from '~/components/dialog/Confirm'
import SnackBar from '~/components/dialog/SnackBar'
import Drawer from '~/views/drawer/Index'
import store from './redux'
import AppNavigator from './router'
import toast from './utils/toast'
// import AsyncStorage from '@react-native-community/async-storage'

// AsyncStorage.clear()

const theme = {
  palette: {
    primaryColor: $colors.main
  },
}

function App(){
  global.$appNavigator = useRef()
  const refs = {
    alert: useRef(),
    confirm: useRef(),
    snackBar: useRef()
  }

  useEffect(() =>{
    let onPressBackBtnMark = false
    const listener = BackHandler.addEventListener('hardwareBackPress', () =>{
      if($appNavigator.current.state.nav.routes.length !== 1){ return }
      if($drawer.visible.current) return $drawer.close()
      if(!onPressBackBtnMark){
        toast.show('再按一次返回键退出应用')
        onPressBackBtnMark = true
        setTimeout(() => onPressBackBtnMark = false, 3000)
        return true
      }else{
        BackHandler.exitApp()
      }
    })

    return listener.remove
  }, [])

  useEffect(() =>{
    let dialog = {}
    for(let key in refs){
      dialog[key] = refs[key].current
    }
    
    global.$dialog = dialog

    require('./init')
    setTimeout(SplashScreen.hide, 1000)
  }, [])

  function navigationStateChange (prevState, state){
    DeviceEventEmitter.emit('navigationStateChange', prevState, state)
  }

  return (
    <ThemeContext.Provider value={getTheme(theme)}>
      <Provider store={store}>
        <Drawer>
          <AppNavigator onNavigationStateChange={navigationStateChange} ref={$appNavigator} />
        </Drawer>
      </Provider>

      <Alert getRef={refs.alert} />
      <Confirm getRef={refs.confirm} />
      <SnackBar getRef={refs.snackBar} />
    </ThemeContext.Provider>
  )
}

export default App