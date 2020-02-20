import count from './api/count'
import store from './redux'
import { init as initConfig, set as setConfig, init } from './redux/config/HOC'
import { SET_USERNAME } from './redux/user'
import { check as checkLoginStatus, getUserInfo, getWaitNotificationsTotal, logout as userLogout } from './redux/user/HOC'
import storage from './utils/storage'

export default function appInit() {
  storage.get('userName').then(name => {
    if (!name) {
      !__DEV__ && count.increment()
      return
    }
  
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
  })

  return storage.get('config').then(localConfig => {
    localConfig ? setConfig(localConfig) : initConfig()
    return localConfig
  })
}