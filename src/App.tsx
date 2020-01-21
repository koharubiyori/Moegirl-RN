import React, { useEffect, useRef } from 'react'
import { BackHandler, DeviceEventEmitter } from 'react-native'
import { getTheme, ThemeContext } from 'react-native-material-ui'
import SplashScreen from 'react-native-splash-screen'
import { Provider } from 'react-redux'
import Alert, { AlertRef } from '~/components/dialog/Alert'
import Confirm, { ConfirmRef } from '~/components/dialog/Confirm'
import SnackBar, { SnackBarRef } from '~/components/dialog/SnackBar'
import Drawer from '~/views/drawer/Index'
import store from './redux'
import AppNavigator from './router'
import toast from './utils/toast'
import { NavigationState } from 'react-navigation'
// import AsyncStorage from '@react-native-community/async-storage'

// AsyncStorage.clear()

const theme = {
  palette: {
    primaryColor: $colors.main
  },
}

function App() {
  const refs = {
    alert: useRef<AlertRef>(),
    confirm: useRef<ConfirmRef>(),
    snackBar: useRef<SnackBarRef>(),
    appNavigator: useRef<{ _navigation: __Navigation.Navigation }>()
  }

  useEffect(() => {
    global.$appNavigator = refs.appNavigator.current!._navigation
    
    let onPressBackBtnMark = false
    const listener = BackHandler.addEventListener('hardwareBackPress', () => {
      // navigation需要不断更新赋值，否则状态都是旧的(像是routes字段等)
      global.$appNavigator = refs.appNavigator.current!._navigation

      if (($appNavigator.state as any).routes.length !== 1) { return }
      if ($drawer.visible.current) return $drawer.close()
      if (!onPressBackBtnMark) {
        toast.show('再按一次返回键退出应用')
        onPressBackBtnMark = true
        setTimeout(() => onPressBackBtnMark = false, 3000)
        return true
      } else {
        BackHandler.exitApp()
      }
    })

    return listener.remove
  }, [])

  useEffect(() => {
    let dialog: any = {}
    for (let key in refs) {
      dialog[key] = refs[key as keyof typeof refs].current
    }
    
    global.$dialog = dialog

    require('./init')
    setTimeout(SplashScreen.hide, 1000)
  }, [])

  function navigationStateChange (prevState: NavigationState, state: NavigationState) {
    DeviceEventEmitter.emit('navigationStateChange', prevState, state)
  }

  return (
    <ThemeContext.Provider value={getTheme(theme)}>
      <Provider store={store}>
        <Drawer>
          <AppNavigator onNavigationStateChange={navigationStateChange} ref={refs.appNavigator as any} />
        </Drawer>
      </Provider>

      <Alert getRef={refs.alert} />
      <Confirm getRef={refs.confirm} />
      <SnackBar getRef={refs.snackBar} />
    </ThemeContext.Provider>
  )
}

export default App