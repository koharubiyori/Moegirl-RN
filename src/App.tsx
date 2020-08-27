import { NavigationContainerRef } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import { BackHandler, Linking } from 'react-native'
import { DefaultTheme, Provider as PaperProvider, Theme } from 'react-native-paper'
import SplashScreen from 'react-native-splash-screen'
import { linkHandler } from './components/articleView/utils/linkHandler'
import init from './init'
import i from './lang'
import store from './mobx'
import StackRoutes from './routes'
import { colors, initSetThemeMethod, setThemeColor } from './theme'
import { DialogBaseView } from './utils/dialog'
import { initGlobalNavigation } from './utils/globalNavigation'
import toast from './utils/toast'

const initialTheme: Theme = {
  ...DefaultTheme,
  dark: true,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    ...colors.green
  }
}

export default function App() {
  const [theme, setTheme] = useState(initialTheme)
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false)
  const refs = {
    stackRoutes: useRef<NavigationContainerRef>()
  }
  
  // 初始化主题方法
  initSetThemeMethod(setTheme)

  // 初始化全局导航器
  useEffect(() => {
    initGlobalNavigation(refs.stackRoutes.current!)
  }, [isSettingsLoaded])

  // 其他初始化动作
  useEffect(() => {
    ;(async () => {
      await init()
      setIsSettingsLoaded(true)
      const currentTheme = store.settings.theme
      setThemeColor(currentTheme)
      setTimeout(SplashScreen.hide, 500)

      // 响应深度链接
      const initialUrl = await Linking.getInitialURL()
      if (!initialUrl) { return undefined }
      linkHandler(initialUrl)
    })()
  }, [])

  // 监听返回键
  useEffect(() => {
    let pressBackFlag = false
    
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {      
      // 如果页面栈不为1，则这里什么都不做(页面栈pop)
      const rootRoute = refs.stackRoutes.current!.getRootState()
      if (rootRoute.routes.length > 1) { return }
      
      // 两次返回退出程序
      if (!pressBackFlag) {
        pressBackFlag = true
        setTimeout(() => pressBackFlag = false, 3000)
        toast(i.againPressToExit)
        return true
      } else {
        BackHandler.exitApp()
      }
    })

    return () => subscription.remove()
  }, [])

  // 每30秒check一次等待的通知
  useEffect(() => {
    const intervalKey = setInterval(() => {
      store.user.checkWaitNotificationTotal()
    }, 30000)

    return () => clearInterval(intervalKey)
  }, [])
  
  return (
    <PaperProvider theme={theme}>
      {/* 等待用户设置载入完成 */}
      {isSettingsLoaded &&
        <StackRoutes getRef={refs.stackRoutes} />
      }
      <DialogBaseView />
    </PaperProvider>
  )
}
