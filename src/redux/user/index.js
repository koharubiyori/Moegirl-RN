import { SET_INFO, CLEAR_INFO } from './actionTypes'

export default function reducer(state = {
  name: null
}, action){
  switch(action.type){
    case SET_INFO: {
      return {
        name: action.data.name
      }
    }

    case CLEAR_INFO: {
      return {
        name: null
      }
    }

    default: {
     return state 
    }
  }
}