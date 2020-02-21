import CookieManager from '@koharubiyori/react-native-cookies'

import setActionHandler from '~/utils/redux/setActionHandler'
import { AccountApiData } from '~/api/account.d'

export const SET_USERNAME = Symbol()
export const CLEAR = Symbol()
export const SET_WAIT_NOTIFICATIONS_TOTAL = Symbol()
export const SET_USER_INFO = Symbol()

export interface ActionTypes {
  [SET_USERNAME]: {
    name: string
  }

  [CLEAR]: null
  [SET_WAIT_NOTIFICATIONS_TOTAL]: {
    total: number
  }
  [SET_USER_INFO]: {
    info: AccountApiData.GetInfo
  }
}

export interface State {
  name: string | null
  waitNotificationsTotal: number
  info: AccountApiData.GetInfo | null
}

const reducer: __Redux.ReduxReducer<State, keyof ActionTypes> = (state = {
  name: null,
  waitNotificationsTotal: 0,
  info: null
}, action) => setActionHandler<ActionTypes, State>(action, {
  [SET_USERNAME]: action => {
    return {
      ...state,
      name: action.name
    }
  },

  [CLEAR]: action => {
    CookieManager.clearAll()

    return {
      ...state,
      name: null,
      waitNotificationsTotal: 0,
      info: null
    }
  },

  [SET_WAIT_NOTIFICATIONS_TOTAL]: action => {
    return {
      ...state,
      waitNotificationsTotal: action.total
    }
  },

  [SET_USER_INFO]: action => {
    return {
      ...state,
      info: action.info
    }
  }
}) || state

export default reducer