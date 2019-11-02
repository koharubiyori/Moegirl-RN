import { connect } from 'react-redux'
import { SET_INFO, CLEAR_INFO } from './actionTypes'
import store from '~/redux'
import { login as _login, logout as _logout } from '~/api/login'
import { getToken as getEditToken } from '~/api/edit'

const { dispatch } = store

export const login = (userName, password) => dispatch(dispatch => 
  new Promise((resolve, reject) =>{
    _login(userName, password).then(data =>{
      if(data.clientlogin.status === 'PASS'){
        dispatch({ type: SET_INFO, name: data.clientlogin.username })
        resolve(data.clientlogin.username)
      }else{ reject(data.clientlogin.status) }
    }).catch(reject)
  })
)

export const logout = () =>{
  dispatch({ type: CLEAR_INFO })
  _logout()
}

export const check = () =>{
  return new Promise((resolve, reject) =>{
    getEditToken()
      .then(data =>{
        if(data.query.tokens.csrftoken === '+\\'){
          logout()
          reject()
        }else{
          resolve()
        }
      })
      .catch(e =>{
        console.log(e)
        resolve()
      })
  })
}

export default function(Element){
  return connect(
    state => ({ state }),
    dispatch => ({ 
      user: { login, logout, check }
    })
  )(Element)
}
