import CookieManager from 'react-native-cookies'
import storage from '~/utils/storage'
import setActionHandler from '~/utils/redux/setActionHandler'

export const SET_INFO = Symbol()
export const CLEAR_INFO = Symbol()

export interface ActionTypes {
  [SET_INFO]: {
    name: string
  }

  [CLEAR_INFO]: null
}

export interface State {
  name: string | null
}

const reducer: __Redux.ReduxReducer<State, keyof ActionTypes> = (state = {
  name: null
}, action) => setActionHandler<ActionTypes, State>(action, {
  [SET_INFO]: action => {
    storage.set('userName', action.name)

    return {
      name: action.name
    }
  },

  [CLEAR_INFO]: action => {
    storage.remove('userName')
    CookieManager.clearAll()

    return {
      name: null
    }
  }
}) || state

export default reducer