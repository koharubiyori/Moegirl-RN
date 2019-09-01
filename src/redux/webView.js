import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { getArticle } from '~/api/article'

function reducer(state = {
  pagesCache: {}
}, action){
  switch(action.type){
    case 'add': {
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

const finalCreateStore = applyMiddleware(thunk)(createStore)
const store = finalCreateStore(reducer)

store._async = {
  getContent: link => store.dispatch((dispatch, getState) =>{
    return new Promise((resolve, reject) => {
      const state = getState()

      var cache = state.pagesCache[link]
      if(cache){ return resolve(cache) }

      getArticle(link).then(data =>{
        dispatch({ type: 'add', name: link, data })
        resolve(data)
      }).catch(reject)
    })
  })
}

export default store

