import store from './redux'
import storage from './utils/storage'
// import toast from './utils/toast'
import { SET_USERNAME } from './redux/user'
import { logout as userLogout, check as checkLoginStatus, getWaitNotificationsTotal, getUserInfo } from './redux/user/HOC'

import { set as setConfig, init as initConfig } from './redux/config/HOC'

storage.get('userName').then(name => {
  if (!name) { return }
  store.dispatch({ type: SET_USERNAME, name })

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