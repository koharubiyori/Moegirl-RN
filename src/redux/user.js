import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'


function reducer(state = {
  info: null
}, action){
  switch(action.type){
    case 'writeInfo': {
      return {
        info: action.data
      }
    }

    default: {
      return state
    }
  }
}

const finalCreateStore = applyMiddleware(thunk)(createStore)
const store = finalCreateStore(reducer)

store._async = {
  
}

export default store