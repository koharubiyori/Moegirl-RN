import { SET_USERNAME, CLEAR_USERNAME, State, SET_WAIT_NOTIFICATIONS_TOTAL } from './index'
import store from '~/redux'
import accountApi from '~/api/account'
import editApi from '~/api/edit'
import myConnect from '~/utils/redux/myConnect'
import notificationApi from '~/api/notification'

const { dispatch, getState } = store

export const login = (userName: string, password: string): Promise<string> => new Promise((resolve, reject) => {
  accountApi.login(userName, password).then(data => {
    if (data.clientlogin.status === 'PASS') {
      dispatch({ type: SET_USERNAME, name: data.clientlogin.username })
      resolve(data.clientlogin.username)
    } else { reject(data.clientlogin.status) }
  }).catch(reject)
})

export const logout = () => {
  dispatch({ type: CLEAR_USERNAME })
  accountApi.logout()
}

export const check = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    editApi.getToken()
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

export const checkWaitNotificationsTotal = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    notificationApi.get(false, '', 1)
      .then(data => {
        dispatch({ type: SET_WAIT_NOTIFICATIONS_TOTAL, total: data.query.notifications.rawcount })
        resolve(data.query.notifications.rawcount)
      })
      .catch(reject)
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

export const userHOC = myConnect('$user', { login, logout, check })