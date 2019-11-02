import store from './redux'
import storage from './utils/storage'
import { SET_INFO } from './redux/user/actionTypes'
import { logout } from './redux/user/HOC'
import { check } from './redux/user/HOC'

store.dispatch(dispatch =>{
  storage.get('userName').then(name =>{
    if(!name){ return }
    dispatch({ type: SET_INFO, name })

    // 获取一次编辑令牌，判断登录状态是否有效
    check().catch(() =>{
      logout()
      $dialog.confirm.show({
        content: '登录状态貌似失效了，要前往登录吗？',
        onTapCheck: () =>{
          $appNavigator.current._navigation.push('login')
        }
      })
    })    
  })
})

storage.get('config').then(config =>{
  if(!config) storage.set('config', {
    heimu: true,
    biliPlayerReload: false,
    immersionMode: false
  })
})