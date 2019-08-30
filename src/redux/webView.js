import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-chunk'

function reducer(state = {
  pagesCache: {}
}, action){
  switch(action.type){
    case 'add': {
      return { pagesCache: {
        ...state.pagesCache,
        [action.name]: action.data
      } }
    }

    default: {
      return state
    }
  }
}

const finalCreateStore = applyMiddleware(thunk)(createStore)

const store = finalCreateStore(reducer)

export default store

