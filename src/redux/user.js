import React from 'react'
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { connect, Provider } from 'react-redux'
import storage from '~/utils/storage'
import { login } from '~/api/login'
import CookieManager from 'react-native-cookies'

function reducer(state = {
  name: null
}, action){
  switch(action.type){
    case 'writeName': {
      storage.set('userName', action.data)
      return {
        name: action.data
      }
    }

    case 'logout': {
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

const finalCreateStore = applyMiddleware(thunk)(createStore)
const store = finalCreateStore(reducer)

// 载入缓存中保存的用户名
store.dispatch(async dispatch => dispatch({ type: 'writeName', data: await storage.get('userName') }))

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

export { store }


function mapStateToProps(state){
  return {
    userName: state.name
  }
}

function mapDispatchToProps(dispatch){
  return {
    userLogin: store._async.login,
    userLogout: () => dispatch({ type: 'logout' })
  }
}

export const createHOC = connect(mapStateToProps, mapDispatchToProps)
export const StoreProvider = props => <Provider store={store}>{props.children}</Provider>
