import store from './redux'
import storage from './utils/storage'
import { SET_INFO } from './redux/user/actionTypes'
import { logout } from './redux/user/HOC'
import { check } from './redux/user/HOC'

store.dispatch(dispatch =>{
  storage.get('userName').then(name => dispatch({ type: SET_INFO, name }))
})

check().catch(() =>{
  logout()
  $dialog.confirm.show({
    content: '登录状态貌似失效了，要前往登录吗？',
    onTapCheck: () =>{
      $appNavigator.current._navigation.push('login')
    }
  })
})
