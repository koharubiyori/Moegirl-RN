import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { login } from '~/api/login'

function reducer(state = {
  name: null
}, action){
  switch(action.type){
    case 'writeName': {
      return {
        name: action.data
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
  login: (userName, password) => store.dispatch(dispatch => 
    new Promise((resolve, reject) =>{
      login(userName, password).then(data =>{
        if(data.clientlogin.status === 'PASS'){
          dispatch({ type: 'writeName', data: data.clientlogin.username })
          resolve(data.clientlogin.username)
        }else{ reject(data.clientlogin.status) }
      }).catch(reject)
    })
  )
}

export default store


