import { createStore, combineReducers } from '~/../node_modules/redux'
import user from './user'
import articleView from './articleView'
import comment from './comment'
import config from './config'

const reducers = combineReducers({ user, articleView, comment, config })
const store = createStore(reducers)

export default store