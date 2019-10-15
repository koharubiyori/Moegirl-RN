import store from './redux'
import storage from './utils/storage'
import { SET_INFO } from './redux/user/actionTypes'

store.dispatch(dispatch =>{
  storage.get('userName').then(name => dispatch({ type: SET_INFO, name }))
})