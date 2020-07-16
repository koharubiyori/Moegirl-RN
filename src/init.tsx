import { Linking } from 'react-native'
import { isHmoe, version } from '~/../app.json'
import accessCount from './api/accessCount'
import appApi from './api/app'
import store from './mobx'
import baseStorage from './utils/baseStorage'
import dialog from './utils/dialog'
import globalNavigation from './utils/globalNavigation'
import storage from './utils/storage'

export default async function init() {
  try {
    const settings = await baseStorage.get('settings')
    if (settings) {
      store.settings.set('heimu', settings!.heimu)
      store.settings.set('cachePriority', settings!.cachePriority)
      store.settings.set('source', settings!.source)
      store.settings.set('theme', settings!.theme)
    }

    // 初始化当前source的数据
    await storage.load()

    checkLoginStatus()
    _accessCount()
    checkLastVersion()
  } catch (e) {
    console.log(e)
    return Promise.resolve()
  }
}

function _accessCount() {
  const name = storage.get('userName')
  name 
    ? name !== '東東君' && !__DEV__ && accessCount.increment(name)
    : !__DEV__ && accessCount.increment()
}

function checkLoginStatus() {
  const name = storage.get('userName')
  if (name) {
    store.user.setName(name)
    
    // 获取一次编辑令牌，判断登录状态是否有效
    store.user.check()
      .then(() => {
        store.user.checkWaitNotificationTotal() // 获取等待的通知总数
        store.user.getUserInfo() // 获取用户信息
      })
      .catch(() => {
        store.user.logout()
        dialog.confirm.show({
          content: '登录状态貌似失效了，要前往登录吗？'
        })
          .then(() => globalNavigation.current.push('login'))
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
        dialog.confirm.show({
          title: '发现新版本，是否下载？',
          content: data.info,
        })
          .then(() => Linking.openURL(isHmoe ? data.downloadLink : 'https://www.coolapk.com/apk/247471'))
      }
    })
}