import CookieManager from 'react-native-cookies'
import storage from '~/utils/storage'
import { SET_INFO, CLEAR_INFO } from './actionTypes'

export default async function reducer(state = {
  name: null
}, action){
  switch(action.type){
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