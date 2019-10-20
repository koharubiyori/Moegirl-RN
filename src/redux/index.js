import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import user from './user'
import webView from './webView'
import comment from './comment'

const reducers = combineReducers({ user, webView, comment })
const finalCreateStore = applyMiddleware(thunk)(createStore)
const store = finalCreateStore(reducers)

export default store