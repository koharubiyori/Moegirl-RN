import count from './api/count'
import store from './redux'
import { init as initConfig, set as setConfig } from './redux/config/HOC'
import { SET_USERNAME } from './redux/user'
import { check as checkLoginStatus, getUserInfo, getWaitNotificationsTotal, logout as userLogout } from './redux/user/HOC'
import storage from './utils/storage'

storage.get('userName').then(name => {
  if (!name) return count.increment()
  store.dispatch({ type: SET_USERNAME, name })

  // 统计使用量排除自己
  name !== '東東君' && count.increment(name)

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
        onTapCheck: () => {
          $appNavigator.push('login')
        }
      })
    })    
})

storage.get('config').then(localConfig => {
  localConfig ? setConfig(localConfig) : initConfig()
})