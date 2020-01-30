import { SET_USERNAME, CLEAR, State, SET_WAIT_NOTIFICATIONS_TOTAL, SET_USER_INFO } from './index'
import store from '~/redux'
import accountApi from '~/api/account'
import editApi from '~/api/edit'
import myConnect from '~/utils/redux/myConnect'
import notificationApi from '~/api/notification'
import { AccountApiData } from '~/api/account.d'

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
  dispatch({ type: CLEAR })
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

export const getWaitNotificationsTotal = (): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (getState().user.name === null) return resolve(0)
    notificationApi.get('', 1)
      .then(data => {
        dispatch({ type: SET_WAIT_NOTIFICATIONS_TOTAL, total: data.query.notifications.rawcount })
        resolve(data.query.notifications.rawcount)
      })
      .catch(reject)
  })
}

export const markReadAllNotifications = () => {
  return notificationApi.markReadAll()
    .then(() => dispatch({ type: SET_WAIT_NOTIFICATIONS_TOTAL, total: 0 }))
}

export const getUserInfo = (): Promise<AccountApiData.GetInfo> => {
  return new Promise((resolve, reject) => {
    const state = getState()
    if (state.user.info) return resolve(state.user.info)
    accountApi.getInfo()
      .then(data => {
        dispatch({ type: SET_USER_INFO, info: data })
        resolve(data)
      })
      .catch(reject)
  })
}

interface ConnectedDispatch {
  $user: {
    login: typeof login
    logout: typeof logout
    check: typeof check
    getWaitNotificationsTotal: typeof getWaitNotificationsTotal
    markReadAllNotifications: typeof markReadAllNotifications
    getUserInfo: typeof getUserInfo
  }
}

export type UserConnectedProps = ConnectedDispatch & {
  state: { user: State }
}

export const userHOC = myConnect('$user', { login, logout, check, getWaitNotificationsTotal, markReadAllNotifications, getUserInfo })