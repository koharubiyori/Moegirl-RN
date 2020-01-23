import { connect } from 'react-redux'
import { SET_INFO, CLEAR_INFO, State } from './index'
import store from '~/redux'
import accountApi from '~/api/account'
import { getToken as getEditToken } from '~/api/edit'

const { dispatch, getState } = store

export const login = (userName: string, password: string): Promise<string> => new Promise((resolve, reject) => {
  accountApi.login(userName, password).then(data => {
    if (data.clientlogin.status === 'PASS') {
      dispatch({ type: SET_INFO, name: data.clientlogin.username })
      resolve(data.clientlogin.username)
    } else { reject(data.clientlogin.status) }
  }).catch(reject)
})

export const logout = () => {
  dispatch({ type: CLEAR_INFO })
  accountApi.logout()
}

export const check = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    getEditToken()
      .then(data => {
        if (data.query.tokens.csrftoken === '+\\') {
          logout()
          reject()
        } else {
          resolve()
        }
      })
      .catch(e => {
        console.log(e)
        resolve()
      })
  })
}

interface ConnectedDispatch {
  $user: {
    login: typeof login
    logout: typeof logout
    check: typeof check
  }
}

export type UserConnectedProps = ConnectedDispatch & {
  state: { user: State }
}

export const userHOC = connect(
  state => ({ state }),
  dispatch => ({ 
    $user: { login, logout, check }
  })
)