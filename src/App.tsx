import React, { useEffect, useRef, useState } from 'react'
import { BackHandler, DeviceEventEmitter, NativeModules } from 'react-native'
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
import { colors, initSetThemeStateMethod, setThemeColor } from './theme'
import OptionsSheet, { OptionsSheetRef } from './components/dialog/OptionsSheet'
import appInit from './init'
import { pushMessage } from './notificationServe'
// import AsyncStorage from '@react-native-community/async-storage'

// AsyncStorage.clear()

const initialTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    ...colors.green
  }
}

function App() {
  const [theme, setTheme] = useState(initialTheme)
  const [isConfigLoaded, setIsConfigLoaded] = useState(false)
  const refs = {
    alert: useRef<AlertRef>(),
    confirm: useRef<ConfirmRef>(),
    snackBar: useRef<SnackBarRef>(),
    appNavigator: useRef<{ _navigation: __Navigation.Navigation }>(),
    optionsSheet: useRef<OptionsSheetRef>()
  }

  initSetThemeStateMethod(setTheme)

  useEffect(() => {    
    // 初始化dialog方法
    let dialog: any = {}
    for (let key in refs) {
      dialog[key] = refs[key as keyof typeof refs].current
    }
    
    global.$dialog = dialog

    // 执行其他初始化操作
    appInit().then(config => {
      if (config) {
        setThemeColor(config.theme)
      }

      setIsConfigLoaded(true)
      setTimeout(initGlobalNavigatorAndExitAppHandler)
    })

    // 初始化完成一秒后隐藏启动图
    setTimeout(SplashScreen.hide, 1000)
  }, [])

  // 每隔30秒check一次未读通知
  useEffect(() => {
    const intervalKey = setInterval(() => {
      getWaitNotificationsTotal()
        .then(awaitNotiTotal => {
          awaitNotiTotal && pushMessage(`你有${awaitNotiTotal}条未读通知。`, 'awaitNotification')
        })
    }, 1000 * 30)
    return () => clearInterval(intervalKey)
  }, [])

  function initGlobalNavigatorAndExitAppHandler() {
    global.$appNavigator = refs.appNavigator.current!._navigation
        
    let onPressBackBtnMark = false
    return BackHandler.addEventListener('hardwareBackPress', () => {
      // navigation需要不断更新赋值，否则状态都是旧的(像是routes字段等)
      if (refs.appNavigator.current) global.$appNavigator = refs.appNavigator.current!._navigation

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
  }

  function navigationStateChange (prevState: NavigationState, state: NavigationState) {
    DeviceEventEmitter.emit('navigationStateChange', prevState, state)
  }

  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        {/* 为了能拿到用户设置，这里要等待配置载入完成 */}
        {isConfigLoaded ? <>
          <Drawer>
            <AppNavigator onNavigationStateChange={navigationStateChange} ref={refs.appNavigator as any} />
          </Drawer>
        </> : null}

        <Alert getRef={refs.alert} />
        <Confirm getRef={refs.confirm} />
        <SnackBar getRef={refs.snackBar} />
        <OptionsSheet getRef={refs.optionsSheet} />
      </PaperProvider>
    </ReduxProvider>
  )
}

export default App