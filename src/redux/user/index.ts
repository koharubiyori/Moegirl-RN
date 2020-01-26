import CookieManager from 'react-native-cookies'
import storage from '~/utils/storage'
import setActionHandler from '~/utils/redux/setActionHandler'

export const SET_USERNAME = Symbol()
export const CLEAR_USERNAME = Symbol()
export const SET_WAIT_NOTIFICATIONS_TOTAL = Symbol()

export interface ActionTypes {
  [SET_USERNAME]: {
    name: string
  }

  [CLEAR_USERNAME]: null
  [SET_WAIT_NOTIFICATIONS_TOTAL]: {
    total: number
  }
}

export interface State {
  name: string | null
  waitNotificationsTotal: number
}

const reducer: __Redux.ReduxReducer<State, keyof ActionTypes> = (state = {
  name: null,
  waitNotificationsTotal: 0
}, action) => setActionHandler<ActionTypes, State>(action, {
  [SET_USERNAME]: action => {
    storage.set('userName', action.name)

    return {
      ...state,
      name: action.name
    }
  },

  [CLEAR_USERNAME]: action => {
    storage.remove('userName')
    CookieManager.clearAll()

    return {
      ...state,
      name: null
    }
  },

  [SET_WAIT_NOTIFICATIONS_TOTAL]: action => {
    return {
      ...state,
      waitNotificationsTotal: action.total
    }
  }
}) || state

export default reducer