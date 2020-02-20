import React, { useEffect, useRef, useState } from 'react'
import { BackHandler, DeviceEventEmitter } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { Provider as ReduxProvider } from 'react-redux'
import Alert, { AlertRef } from '~/components/dialog/Alert'
import Confirm, { ConfirmRef } from '~/components/dialog/Confirm'
import SnackBar, { SnackBarRef } from '~/components/dialog/SnackBar'
import Drawer from '~/views/drawer'
import store from './redux'
import AppNavigator from './router'
import toast from './utils/toast'
import { NavigationState } from 'react-navigation'
import { getWaitNotificationsTotal } from './redux/user/HOC'
import { Provider as PaperProvider, DefaultTheme, Theme } from 'react-native-paper'
import { green } from './theme'
// import AsyncStorage from '@react-native-community/async-storage'

// AsyncStorage.clear()

const initialTheme: Theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    ...green
  }
}

function App() {
  const [theme, setTheme] = useState(initialTheme)
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
    // 初始化dialog方法
    let dialog: any = {}
    for (let key in refs) {
      dialog[key] = refs[key as keyof typeof refs].current
    }
    
    global.$dialog = dialog

    // 执行其他初始化操作
    require('./init')

    // 初始化完成一秒后隐藏启动图
    setTimeout(SplashScreen.hide, 1000)
  }, [])

  // 每隔一分钟check一次未读通知
  useEffect(() => {
    const intervalKey = setInterval(getWaitNotificationsTotal, 1000 * 60)
    return () => clearInterval(intervalKey)
  }, [])

  function navigationStateChange (prevState: NavigationState, state: NavigationState) {
    DeviceEventEmitter.emit('navigationStateChange', prevState, state)
  }

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <Drawer>
          <AppNavigator onNavigationStateChange={navigationStateChange} ref={refs.appNavigator as any} />
        </Drawer>

        <Alert getRef={refs.alert} />
        <Confirm getRef={refs.confirm} />
        <SnackBar getRef={refs.snackBar} />
      </PaperProvider>
    </ReduxProvider>
  )
}

export default App