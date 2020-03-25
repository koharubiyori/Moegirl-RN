import count from './api/count'
import store from './redux'
import { init as initConfig, set as setConfig } from './redux/config/HOC'
import { SET_USERNAME } from './redux/user'
import { check as checkLoginStatus, getUserInfo, getWaitNotificationsTotal, logout as userLogout } from './redux/user/HOC'
import storage from './utils/storage'
import baseStorage from './utils/baseStorage'
import { State as ConfigState } from './redux/config'
import appApi from './api/app'
import { version, isHmoe } from '~/../app.json'
import { Linking } from 'react-native'

export default function appInit() {  
  return new Promise<ConfigState | null>(async resolve => {
    try {      
      // 等待数据载入到redux
      const localConfig = await baseStorage.get('config')
      await (localConfig ? setConfig(localConfig) : initConfig())

      // 初始化当前选中的source数据
      await storage.load()
      
      accessCount()
      checkLoginStatusAndGetUserInfo()
      checkLastVersion()
      resolve()
    } catch (e) {
      console.log(e)
      resolve()
    }
  })
  
  function accessCount() {
    const name = storage.get('userName')
    name 
      ? name !== '東東君' && !__DEV__ && count.increment(name)
      : !__DEV__ && count.increment()
  }

  function checkLoginStatusAndGetUserInfo() {
    const name = storage.get('userName')
    if (name) {
      store.dispatch({ type: SET_USERNAME, name })

      // 获取一次编辑令牌，判断登录状态是否有效
      checkLoginStatus()
        .then(() => {
          getWaitNotificationsTotal() // 获取等待的通知总数
          getUserInfo() // 获取用户信息
        })
        .catch(() => {
          userLogout()
          $dialog.confirm.show({
            content: '登录状态貌似失效了，要前往登录吗？',
            onPressCheck: () => {
              $appNavigator.push('login')
            }
          })
        })  
    }
  }

  function checkLastVersion() {
    appApi.getGithubLastRelease()
      .then(data => {
        function version2float(version: string) {
          return parseFloat(
            version
              .replace(/[^\d\.]/g, '')
              .replace(/\.(\d)$/, '$1')
          )
        }
        
        if (version2float(data.version) > version2float(version)) {
          $dialog.confirm.show({
            title: '发现新版本，是否下载？',
            content: data.info,
            onPressCheck() {
              Linking.openURL(isHmoe ? data.downloadLink : 'https://www.coolapk.com/apk/247471')
            }
          })
        }
      })
  }
}