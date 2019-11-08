import { SET, INIT } from './actionTypes'
import storage from '~/utils/storage'

const init = () =>({
  heimu: true,
  biliPlayerReload: false,
  immersionMode: false,
})

export default function reducer(state = init(), action){
  switch(action.type){

    // data
    case SET: {
      storage.merge('config', action.data)
      return {
        ...state,
        ...action.data
      }
    }

    case INIT: {
      storage.set('config', init())
      return init()
    }

    default: {
      return state
    }
  }
}