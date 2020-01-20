import store from './redux'
import storage from './utils/storage'
// import toast from './utils/toast'
import { SET_INFO } from './redux/user/actionTypes'
import { logout as userLogout, check as checkLoginStatus } from './redux/user/HOC'

import { set as setConfig, init as initConfig } from './redux/config/HOC'

store.dispatch(dispatch => {
  storage.get('userName').then(name => {
    if (!name) { return }
    dispatch({ type: SET_INFO, name })

    // 获取一次编辑令牌，判断登录状态是否有效
    checkLoginStatus().catch(() => {
      userLogout()
      $dialog.confirm.show({
        content: '登录状态貌似失效了，要前往登录吗？',
        onTapCheck: () => {
          $appNavigator.push('login')
        }
      })
    })    
  })
})

storage.get('config').then(localConfig => {
  localConfig ? setConfig(localConfig) : initConfig()
})