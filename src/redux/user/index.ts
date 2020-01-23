import CookieManager from 'react-native-cookies'
import storage from '~/utils/storage'

export const SET_INFO = Symbol()
export const CLEAR_INFO = Symbol()

export interface State {
  name: string | null
}

const reducer: __Redux.ReduxReducer<State> = (state = {
  name: null
}, action) => {
  switch (action.type) {
    case SET_INFO: {
      storage.set('userName', action.name)

      return {
        name: action.name
      }
    }

    case CLEAR_INFO: {
      storage.remove('userName')
      CookieManager.clearAll()

      return {
        name: null
      }
    }

    default: {
      return state 
    }
  }
}

export default reducer