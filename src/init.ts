import count from './api/count'
import store from './redux'
import { init as initConfig, set as setConfig } from './redux/config/HOC'
import { SET_USERNAME } from './redux/user'
import { check as checkLoginStatus, getUserInfo, getWaitNotificationsTotal, logout as userLogout } from './redux/user/HOC'
import storage from './utils/storage'
import baseStorage from './utils/baseStorage'
import { State as ConfigState } from './redux/config'

export default function appInit() {  
  function main() {
    const name = storage.get('userName')
    if (!name) {
      !__DEV__ && count.increment()
    } else {
      store.dispatch({ type: SET_USERNAME, name })
  
      // 统计使用量排除自己
      name !== '東東君' && !__DEV__ && count.increment(name)
    
      // 获取一次编辑令牌，判断登录状态是否有效
      checkLoginStatus()
        .then(() => {
          getWaitNotificationsTotal()
          getUserInfo()
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

  return new Promise<ConfigState | null>(resolve => {
    // 这里先等待载入当前domain的本地数据
    storage.load().then(() => {
      main()
      // 再等待初始化config到redux中
      baseStorage.get('config').then(localConfig => {
        localConfig ? setConfig(localConfig) : initConfig()
        resolve(localConfig)
      })
    })
  })
}