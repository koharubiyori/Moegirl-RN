import store from './redux'
import storage from './utils/storage'
import { SET_INFO } from './redux/user/actionTypes'

store.dispatch(dispatch =>{
  storage.get('userName').then(name =>{
    // 不知道为什么aaa会变成Promise
    dispatch({ type: SET_INFO, name: 'aaa' })
    console.log(name)
    console.log(store.getState())
  })
})