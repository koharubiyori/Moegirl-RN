import { ADD } from './actionTypes'

export default function reducer(state = {
  pagesCache: {}
}, action){
  switch(action.type){
    case ADD: {
      return { 
        pagesCache: {
          ...state.pagesCache,
          [action.name]: action.data
        } 
      }
    }

    default: {
      return state
    }
  }
}