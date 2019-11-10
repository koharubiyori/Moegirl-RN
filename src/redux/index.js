import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import user from './user'
import articleView from './articleView'
import comment from './comment'
import config from './config'

const reducers = combineReducers({ user, articleView, comment, config })
const finalCreateStore = applyMiddleware(thunk)(createStore)
const store = finalCreateStore(reducers)

export default store